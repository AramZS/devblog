const { Octokit } = require("@octokit/rest");
const { retry } = require("@octokit/plugin-retry");
const { throttling } = require("@octokit/plugin-throttling");
require('dotenv').config()
const fs = require('fs');
var slugify = require("slugify");
var path = require('path')
var sanitizeFilename = require("sanitize-filename");

const commit_pattern = () => {
	return /(?<=git commit \-am [\"|\'])(.+)(?=[\"|\'])/i;
}

const gitSearchQuery = (repo, commitMsg) => {
	const searchCommitMsg = commitMsg.replace(" ", "+")
	const repoName = repo.replace("https://github.com/", "")
	return `repo:${repoName}+${searchCommitMsg}`
}

const cacheFilePath = (pageFilePath, searchKey) => {
	const cacheFolder = path.join(__dirname, "../../", '/_queryCache', pageFilePath)
	const cacheFile = cacheFolder+sanitizeFilename(slugify(searchKey).replace(".", ""))
	// console.log('cacheFile: ', cacheFile)
	return { cacheFolder, cacheFile }
}

const getLinkToRepo = async (repo, commitMsg, pageFilePath) => {
	// console.log(repo, commitMsg)
	const searchKey = gitSearchQuery(repo, commitMsg)
	const {cacheFolder, cacheFile} = cacheFilePath(pageFilePath, searchKey)
	try {
		fs.accessSync(cacheFile, fs.constants.F_OK)
		// console.log('Query Cached, do not repeat', cacheFile)
		return true;
	} catch (e) {
		console.log('Query is not cached: ', cacheFile, e)
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
				myOctokit.log.info(`Retrying after ${retryAfter} seconds!`);
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
		const r = await myOctokit.rest.search.commits({
			q: searchKey,
		});
		if (r && r.data && r.data.items && r.data.items.length){
			console.log('Found commit: ', r.data.items[0].html_url)
			// Let's cache the results
			try {
				fs.mkdirSync(cacheFolder, { recursive: true })
				// console.log('write data to file', cacheFile)
				fs.writeFileSync(cacheFile, r.data.items[0].html_url)
			} catch (e) {
				console.log('writing to cache failed:', e)
			}
			return r.data.items[0].html_url
		}
		return false;
	}
}

const createLinkTokens = (TokenConstructor,commitLink) => {
	const link_open = new TokenConstructor('html_inline', '', 0)
	link_open.content = '<a href="'+commitLink+'" target="_blank">'
	const link_close = new TokenConstructor('html_inline', '', 0)
	link_close.content = '</a>'
	return {link_open, link_close}
}

const gitCommitRule = (md) => {
	md.core.ruler.after('inline', 'git_commit', state => {
		const tokens = state.tokens
		if (state.env.hasOwnProperty('repo')){

			for (let i = 0; i < tokens.length; i++) {
				if (commit_pattern().test(tokens[i].content) && tokens[i].type === 'inline') {
					// console.log('tokens round 1: ', tokens[i])
					const commitMessage = tokens[i].content.match(commit_pattern())[0]
					const searchKey = gitSearchQuery(state.env.repo, commitMessage)
					const {cacheFolder, cacheFile} = cacheFilePath(state.env.page.url, searchKey)
					getLinkToRepo(state.env.repo, commitMessage, state.env.page.url).then((commitLink) => {

					})
					let linkToRepo = state.env.repo;
					try {
						fs.accessSync(cacheFile, fs.constants.F_OK)
						linkToRepo = (fs.readFileSync(cacheFile)).toString()
						console.log('Cached link to repo found', linkToRepo)
					} catch (e) {
						// No file yet
						console.log('Cached link to repo not ready', e)
					}
					const { link_open, link_close } = createLinkTokens(state.Token,linkToRepo)
					tokens[i].children.unshift(link_open)
					tokens[i].children.push(link_close)

				}
			}
		}
	})
}

const reruleForGitLink = (md) => {
	// console.log("rules", Object.keys(md.renderer.rules));
	const defaultRender = md.renderer.rules.inline,
	testPattern = /(?<=git commit \-am [\"|\'])(.*)(?=[\"|\'])/i;

	// console.dir(md.core.ruler)

	md.renderer.rules.inline = function (
		tokens,
		idx,
		options,
		env,
		self
	) {
		let title = env.hasOwnProperty("title")
			? env.title
			: "no title";
		// console.log("env", Object.keys(env));
		console.log(
			"env repo:",
			env.hasOwnProperty("repo")
				? `${title} has no repo`
				: env.repo
		);
		var token = tokens[idx],
			content = token.content;
		if (testPattern.test(content) && env.hasOwnProperty("repo")) {
			console.log(tokens[idx])
			tokens[
				idx
			].content = `<a href="${env.repo}" target="_blank">${tokens[idx].content}</a>`;
		}
		// pass token to default renderer.
		return defaultRender(tokens, idx, options, env, self);
	};
}

module.exports = (md) => {
	gitCommitRule(md)
};
