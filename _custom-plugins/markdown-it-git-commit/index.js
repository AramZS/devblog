import { Octokit } from "@octokit/rest";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import fs from "fs";
import slugify from "slugify";
import path from "path";
import sanitizeFilename from "sanitize-filename";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commit_pattern = () => {
	return /(?<=git commit \-am [\"|\'])(.+)(?=[\"|\'])/i;
};

const gitSearchQuery = (repo, branch, commitMsg) => {
	let queryReadyCommitMsg = commitMsg;
	/** Looks like I don't need to do this
	// Commit msg max char count is 72
	if (commitMsg.length > 72) {
		// nice
		queryReadyCommitMsg = commitMsg.slice(0, 69);
		queryReadyCommitMsg += "...";
	}
	**/
	// Notes on searching branches.
	// https://stackoverflow.com/questions/9179828/github-api-retrieve-all-commits-for-all-branches-for-a-repo
	// https://docs.github.com/en/rest/search#search-commits
	// Can't use `parent:` with a commit hash either.
	//let branchQuery = branch.length ? `/branches/${branch}` : "";
	const searchCommitMsg = queryReadyCommitMsg.replace(/\s/g, "+");
	const repoName = repo.replace("https://github.com/", "");
	console.log(
		"Checking with repo name:",
		repoName,
		"and commit msg:",
		searchCommitMsg
	);

	// Ensure we have search terms - GitHub Search API requires actual text, not just qualifiers
	if (!searchCommitMsg || searchCommitMsg.trim().replace(/\+/g, "") === "") {
		console.log("Warning: Empty commit message, using fallback search");
		return false;
	}

	// https://docs.github.com/en/search-github/getting-started-with-searching-on-github/troubleshooting-search-queries#limitations-on-query-length
	// let query = `repo:${repoName}${branchQuery}+${searchCommitMsg}`;
	let query = `repo:${repoName}+${searchCommitMsg}`;
	if (query.length > 256) {
		query = query.slice(0, 256);
		if (query.slice(-1) == "+") {
			query = query.slice(0, 255);
		}
	}
	return query;
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
		cacheFolder + sanitizeFilename(slugify(searchKey).replace(/\./g, ""));
	// console.log('cacheFile: ', cacheFile)
	return { cacheFolder, cacheFile };
};

const getLinkToRepo = async (repo, branch, commitMsg, pageFilePath) => {
	// console.log(repo, commitMsg)
	const searchKey = gitSearchQuery(repo, branch, commitMsg);
	if (!searchKey) {
		return false;
	}
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
			auth: process.env.APIS_GITHUB_KEY,
			request: {
				timeout: 10000, // 10 seconds timeout
			},
			log: {
				debug: console.log,
				info: console.log,
				warn: console.log,
				error: console.log,
			},
			throttle: {
				onRateLimit: (retryAfter, options) => {
					console.log("onRateLimit hit");
					myOctokit.log.warn(
						`Request quota exhausted for request ${options.method} ${options.url}`
					);

					if (options.request.retryCount === 0) {
						console.log(
							"onRateLimit retry",
							`Retrying after ${retryAfter} seconds!`
						);
						// only retries once
						myOctokit.log.info(
							`Retrying after ${retryAfter} seconds!`
						);
						return true;
					}
				},
				onSecondaryRateLimit: (retryAfter, options) => {
					console.log("onSecondaryRateLimit hit");
					myOctokit.log.warn(
						`Secondary rate limit detected for request ${options.method} ${options.url}`
					);
					// Don't retry on secondary rate limits
					return false;
				},
				onAbuseLimit: (retryAfter, options) => {
					console.log("onAbuseLimit hit");
					// does not retry, only logs a warning
					myOctokit.log.warn(
						`Abuse detected for request ${options.method} ${options.url}`
					);
					return false;
				},
			},
			retry: {
				doNotRetry: ["429"],
			},
		});
		console.log("Retrieve Commit: ", searchKey);
		try {
			// NOTE: This search style only queries commits on 'main' branch
			myOctokit.log.warn(
				"OCTOKIT Searching commits with query: " + searchKey
			);
			// @TODO Should this search more than main?
			const r = await myOctokit.search.commits({
				q: searchKey,
			});
			console.log("Git commit search successful", r);
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
				console.log(
					"Commit retrieve failed - no results found for query:",
					searchKey
				);
				return false;
			}
		} catch (e) {
			console.log("Git commit search error: ", e.message, e.status);
			return false;
		}
	}
	return false; // Fallback return
};

const createLinkTokens = (TokenConstructor, commitLink) => {
	const link_open = new TokenConstructor("link_open", "a", 1);
	setAttr(link_open, "target", "_blank");
	setAttr(link_open, "href", commitLink);
	setAttr(link_open, "class", "git-commit-link");
	// This is haunting me, so I asked - https://github.com/markdown-it/markdown-it/issues/834
	const link_close = new TokenConstructor("link_close", "a", -1);
	//console.log("link tokens", { link_open, link_close });
	console.log("Created link tokens for:", commitLink);
	return { link_open, link_close };
};

const gitCommitRule = (md) => {
	//console.log('md.core.ruler', md.core.ruler.__rules__[md.core.ruler.__rules__.length-1])

	md.core.ruler.push("git_commit", (state) => {
		// We haven't figured out branches yet.
		if (state.env.branch) {
			return state;
		}
		const tokens = state.tokens;
		console.log("Git tokens to process:", tokens.length);
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
						state.env.branch ? state.env.branch : "",
						commitMessage
					);
					const { cacheFolder, cacheFile } = cacheFilePath(
						state.env.page.url,
						searchKey
					);
					console.log("Search Key:", searchKey);
					try {
						getLinkToRepo(
							state.env.repo,
							state.env.branch ? state.env.branch : "",
							commitMessage,
							state.env.page.url
						);
					} catch (e) {
						console.log(
							"Error on linking to repo via getLinkToRepo:",
							e
						);
					}
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
		return state;
	});
};

export const gitCommitMarkdownRule = (md) => {
	gitCommitRule(md);
};
