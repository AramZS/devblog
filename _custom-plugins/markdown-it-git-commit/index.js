const { Octokit } = require("@octokit/rest");
const { retry } = require("@octokit/plugin-retry");
const { throttling } = require("@octokit/plugin-throttling");
require("dotenv").config();
const fs = require("fs");
var slugify = require("slugify");
var path = require("path");
var sanitizeFilename = require("sanitize-filename");

const commit_pattern = () => {
	return /(?<=git commit \-am [\"|\'])(.+)(?=[\"|\'])/i;
};

const gitSearchQuery = (repo, commitMsg) => {
	let queryReadyCommitMsg = commitMsg;
	/** Looks like I don't need to do this
	// Commit msg max char count is 72
	if (commitMsg.length > 72) {
		// nice
		queryReadyCommitMsg = commitMsg.slice(0, 69);
		queryReadyCommitMsg += "...";
	}
	**/
	const searchCommitMsg = queryReadyCommitMsg.replace(/\s/g, "+");
	const repoName = repo.replace("https://github.com/", "");
	// https://docs.github.com/en/search-github/getting-started-with-searching-on-github/troubleshooting-search-queries#limitations-on-query-length
	let query = `repo:${repoName}+${searchCommitMsg}`;
	if (query.length > 256) {
		query = query.slice(0, 256);
		if (query.slice(-1) == "+") {
			query = query.slice(0, 255);
		}
	}
	return `repo:${repoName}+${searchCommitMsg}`;
};

function setAttr(token, name, value) {
	const index = token.attrIndex(name);
	const attr = [name, value];

	if (index < 0) {
		token.attrPush(attr);
	} else {
		token.attrs[index] = attr;
	}
}

const cacheFilePath = (pageFilePath, searchKey) => {
	const cacheFolder = path.join(
		__dirname,
		"../../",
		"/_queryCache",
		pageFilePath
	);
	const cacheFile =
		cacheFolder + sanitizeFilename(slugify(searchKey).replace(".", ""));
	// console.log('cacheFile: ', cacheFile)
	return { cacheFolder, cacheFile };
};

const getLinkToRepo = async (repo, commitMsg, pageFilePath) => {
	// console.log(repo, commitMsg)
	const searchKey = gitSearchQuery(repo, commitMsg);
	const { cacheFolder, cacheFile } = cacheFilePath(pageFilePath, searchKey);
	try {
		fs.accessSync(cacheFile, fs.constants.F_OK);
		// console.log('Query Cached, do not repeat', cacheFile)
		return true;
	} catch (e) {
		console.log("Query is not cached: ", cacheFile);
		// An error occurs when we cannot access the file and it needs to be created
		const MyOctokit = Octokit.plugin(retry, throttling);

		const myOctokit = new MyOctokit({
			auth: process.env.GITHUB_KEY,
			throttle: {
				onRateLimit: (retryAfter, options) => {
					myOctokit.log.warn(
						`Request quota exhausted for request ${options.method} ${options.url}`
					);

					if (options.request.retryCount === 0) {
						// only retries once
						myOctokit.log.info(
							`Retrying after ${retryAfter} seconds!`
						);
						return true;
					}
				},
				onAbuseLimit: (retryAfter, options) => {
					// does not retry, only logs a warning
					myOctokit.log.warn(
						`Abuse detected for request ${options.method} ${options.url}`
					);
				},
			},
			retry: {
				doNotRetry: ["429"],
			},
		});
		console.log("Retrieve Commit: ", searchKey);
		// NOTE: This search style only queries commits on 'main' branch
		// @TODO Should this search more than main?
		const r = await myOctokit.rest.search.commits({
			q: searchKey,
		});
		if (r && r.data && r.data.items && r.data.items.length) {
			console.log("Found commit: ", r.data.items[0].html_url);
			// Let's cache the results
			try {
				fs.mkdirSync(cacheFolder, { recursive: true });
				// console.log('write data to file', cacheFile)
				fs.writeFileSync(cacheFile, r.data.items[0].html_url);
			} catch (e) {
				console.log("writing to cache failed:", e);
			}
			return r.data.items[0].html_url;
		} else {
			console.log("Commit retrieve failed: ", r);
			return false;
		}
	}
};

const createLinkTokens = (TokenConstructor, commitLink) => {
	const link_open = new TokenConstructor("html_inline", "", 0);
	link_open.content = `<a target="_blank" href="${commitLink}" class="git-commit-link">`;
	// Why doesn't this work?
	// setAttr(link_open, "target", "_blank");
	// setAttr(link_open, "href", commitLink);
	// setAttr(link_open, "class", "git-commit-link");
	/**
	 * Ah, `html_inline` is not a "real" token type as per https://github.com/markdown-it/markdown-it/issues/320. It can't have any further processing.
	 *
	 * Arguably I should use `link_open` here? But [it](https://github.com/markdown-it/markdown-it/blob/df4607f1d4d4be7fdc32e71c04109aea8cc373fa/lib/rules_inline/link.js) seems to be reserved for specific functionality within the plugin? So perhaps not.
	 */
	// This is haunting me, so I asked - https://github.com/markdown-it/markdown-it/issues/834
	const link_close = new TokenConstructor("html_inline", "", 0);
	link_close.content = "</a>";
	return { link_open, link_close };
};

const gitCommitRule = (md) => {
	md.core.ruler.after("inline", "git_commit", (state) => {
		const tokens = state.tokens;
		if (state.env.hasOwnProperty("repo")) {
			for (let i = 0; i < tokens.length; i++) {
				if (
					commit_pattern().test(tokens[i].content) &&
					tokens[i].type === "inline"
				) {
					// console.log('tokens round 1: ', tokens[i])
					const commitMessage = tokens[i].content.match(
						commit_pattern()
					)[0];
					const searchKey = gitSearchQuery(
						state.env.repo,
						commitMessage
					);
					const { cacheFolder, cacheFile } = cacheFilePath(
						state.env.page.url,
						searchKey
					);
					getLinkToRepo(
						state.env.repo,
						commitMessage,
						state.env.page.url
					).then((commitLink) => {});
					let envRepo = state.env.repo;
					let linkToRepo = "";
					// Let's make the default link go to the commit log, that makes more sense.
					linkToRepo = envRepo;
					if (envRepo.slice(-1) != "/") {
						// Assure the last character is a "/"
						linkToRepo += "/";
					}
					linkToRepo += "commits/main";
					try {
						fs.accessSync(cacheFile, fs.constants.F_OK);
						linkToRepo = fs.readFileSync(cacheFile).toString();
					} catch (e) {
						// No file yet
						console.log(
							"Cached link " + cacheFile + " to repo not ready"
						);
					}
					const { link_open, link_close } = createLinkTokens(
						state.Token,
						linkToRepo
					);
					tokens[i].children.unshift(link_open);
					tokens[i].children.push(link_close);
				}
			}
		}
	});
};

module.exports = (md) => {
	gitCommitRule(md);
};
