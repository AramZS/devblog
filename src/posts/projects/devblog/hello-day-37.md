---
title: Hello World Devblog - Pt. 37
description: "More devblog"
project: Dev Blog
date: 2021-11-17 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - WiP
  - Markdown-It
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
---

## Project Scope and ToDos

1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [x] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [x] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

<s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

</s>

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [x] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [x] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [x] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [x] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [x] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [x] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [x] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [x] Social Icons

- [x] SEO/Social/JSON-LD HEAD data

## Day 37

Ok,so I need to apply the rules properly.

First, let's see what rules exist:

```javascript
console.dir(md.core.ruler)
```

Ok:

```javascript
Ruler {
  __rules__: [
    {
      name: 'normalize',
      enabled: true,
      fn: [Function: normalize],
      alt: []
    },
    { name: 'block', enabled: true, fn: [Function: block], alt: [] },
    { name: 'inline', enabled: true, fn: [Function: inline], alt: [] },
    {
      name: 'short-phrase-fixer',
      enabled: true,
      fn: [Function (anonymous)],
      alt: []
    },
    {
      name: 'evernote-todo',
      enabled: true,
      fn: [Function (anonymous)],
      alt: []
    },
    {
      name: 'replace-link',
      enabled: true,
      fn: [Function (anonymous)],
      alt: []
    },
    {
      name: 'linkify',
      enabled: true,
      fn: [Function: linkify],
      alt: []
    },
    {
      name: 'replacements',
      enabled: true,
      fn: [Function: replace],
      alt: []
    },
    {
      name: 'smartquotes',
      enabled: true,
      fn: [Function: smartquotes],
      alt: []
    },
    {
      name: 'anchor',
      enabled: true,
      fn: [Function (anonymous)],
      alt: []
    }
  ],
  __cache__: null
}
```

Ok, so I need to set up a token type starting with inline. Let's try and match the right token:

```javascript
const testPattern = /(?<=git commit \-am [\"|\'])(.*)(?=[\"|\'])/i;

// console.dir(md.core.ruler)
md.core.ruler.after('inline', 'git_commit', state => {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
  	if (testPattern.test(tokens[i].content)) {
  		console.log('tokens round 1: ', tokens[i])
  	}
  }
})
```

Results:

```javascript
 Token {
  type: 'inline',
  tag: '',
  attrs: null,
  map: [ 143, 144 ],
  nesting: 0,
  level: 1,
  children: [
    Token {
      type: 'code_inline',
      tag: 'code',
      attrs: null,
      map: null,
      nesting: 0,
      level: 0,
      children: null,
      content: 'git commit -am "Get macros in the mix."',
      markup: '`',
      info: '',
      meta: null,
      block: false,
      hidden: false
    }
  ],
  content: '`git commit -am "Get macros in the mix."`',
  markup: '',
  info: '',
  meta: null,
  block: true,
  hidden: false
}
```

Good to know, ok, what is in this state object anyway?

{% raw %}
```javascript
StateCore {
  src: '',
  env: {
    defaults: { layout: 'default.njk', description: 'Talking about code' },
    description: 'Posts tagged with Markdown-It',
    layout: 'tags',
    projects: [ [Object], [Object] ],
    site: {
      lang: 'en-US',
      github: [Object],
      site_url: 'http://localhost:8080',
      site_name: 'Fight With Tools: A Dev Blog',
      description: 'A site opening up my development process to all.',
      featuredImage: 'nyc_noir.jpg',
      aramPhoto: 'https://raw.githubusercontent.com/AramZS/aramzs.github.io/master/_includes/Aram-Zucker-Scharff-square.jpg'
    },
    pkg: {
      name: 'fightwithtooldev',
      version: '1.0.0',
      description: "This is the repo for Aram ZS's developer notes and log, keeping track of code experiments and decisions.",
      main: 'index.js',
      scripts: [Object],
      keywords: [],
      author: '',
      license: 'ISC',
      devDependencies: [Object],
      dependencies: [Object]
    },
    templateName: 'tag',
    eleventyExcludeFromCollections: true,
    pagination: {
      data: 'collections.deepTagList',
      size: 1,
      alias: 'paged',
      pages: [Array],
      page: [Object],
      items: [Array],
      pageNumber: 37,
      previousPageLink: '/tag/smo/index.html',
      previous: '/tag/smo/index.html',
      nextPageLink: null,
      next: null,
      firstPageLink: '/tag/blogroll/index.html',
      lastPageLink: '/tag/markdown-it/index.html',
      links: [Array],
      pageLinks: [Array],
      previousPageHref: '/tag/smo/',
      nextPageHref: null,
      firstPageHref: '/tag/blogroll/',
      lastPageHref: '/tag/markdown-it/',
      hrefs: [Array],
      href: [Object]
    },
    permalink: 'tag/{{ paged.tagName | slug }}/{% if paged.number > 1 %}{{ paged.number }}/{% endif %}index.html',
    eleventyComputed: {
      title: 'Tag: {{ paged.tagName }}{% if paged.number > 1 %} | Page {{paged.number}}{% endif %}',
      description: 'Posts tagged with {{ paged.tagName }}'
    },
    page: {
      date: 2021-11-13T22:11:01.651Z,
      inputPath: './src/tags-pages.md',
      fileSlug: 'tags-pages',
      filePathStem: '/tags-pages',
      url: '/tag/markdown-it/',
      outputPath: 'docs/tag/markdown-it/index.html'
    },
    paged: {
      tagName: 'Markdown-It',
      number: 1,
      posts: [Array],
      first: true,
      last: true
    },
    title: 'Tag: Markdown-It',
    collections: {
      all: [Array],
      blogroll: [Array],
      'Personal Blog': [Array],
      links: [Array],
      'Tech Critical': [Array],
      Blockchain: [Array],
      Cryptocurrency: [Array],
      'Code Reference': [Array],
      'Ad Tech': [Array],
      'BAd Tech': [Array],
      'Broken By Design': [Array],
      posts: [Array],
      projects: [Array],
      Starters: [Array],
      '11ty': [Array],
      Node: [Array],
      Sass: [Array],
      WiP: [Array],
      'Github Actions': [Array],
      GPC: [Array],
      CSS: [Array],
      Aggregation: [Array],
      SEO: [Array],
      SMO: [Array],
      'Markdown-It': [Array],
      tagList: [Array],
      deepTagList: [Array]
    }
  },
  tokens: [],
  inlineMode: false,
  md: MarkdownIt {
    inline: ParserInline { ruler: [Ruler], ruler2: [Ruler] },
    block: ParserBlock { ruler: [Ruler] },
    core: Core { ruler: [Ruler] },
    renderer: Renderer { rules: [Object] },
    linkify: LinkifyIt {
      __opts__: [Object],
      __index__: -1,
      __last_index__: 29,
      __schema__: '',
      __text_cache__: 'Especially with the variable name in the ',
      __schemas__: [Object],
      __compiled__: [Object],
      __tlds__: [Array],
      __tlds_replaced__: false,
      re: [Object]
    },
    validateLink: [Function: validateLink],
    normalizeLink: [Function: normalizeLink],
    normalizeLinkText: [Function: normalizeLinkText],
    utils: {
      lib: [Object],
      assign: [Function: assign],
      isString: [Function: isString],
      has: [Function: has],
      unescapeMd: [Function: unescapeMd],
      unescapeAll: [Function: unescapeAll],
      isValidEntityCode: [Function: isValidEntityCode],
      fromCodePoint: [Function: fromCodePoint],
      escapeHtml: [Function: escapeHtml],
      arrayReplaceAt: [Function: arrayReplaceAt],
      isSpace: [Function: isSpace],
      isWhiteSpace: [Function: isWhiteSpace],
      isMdAsciiPunct: [Function: isMdAsciiPunct],
      isPunctChar: [Function: isPunctChar],
      escapeRE: [Function: escapeRE],
      normalizeReference: [Function: normalizeReference]
    },
    helpers: {
      parseLinkLabel: [Function: parseLinkLabel],
      parseLinkDestination: [Function: parseLinkDestination],
      parseLinkTitle: [Function: parseLinkTitle]
    },
    options: {
      html: true,
      xhtmlOut: false,
      breaks: true,
      langPrefix: 'language-',
      linkify: true,
      typographer: false,
      quotes: '“”‘’',
      highlight: [Function (anonymous)],
      maxNesting: 100,
      replaceLink: [Function: replaceLink]
    }
  }
}
```
{% endraw %}

Oh, look at that. Everything I need to handle it at the rule level, instead of the `rerender` process!

Ok, so now I can make a plugin pretty similar to the one I did before.

I can find the commit message by searching through `inline` tokens, and pull the repo out of `state.env.repo`. I can then pull the commit message out of the inline token's `content` and use it with Octokit to search for the repo. The API query results in a `data` object with an `items` property that returns an array that looks like:

```javascript
[
  {
    url: 'https://api.github.com/repos/AramZS/devblog/commits/29ae79850439397742e0b7147a0fd9b5683058a4',
    sha: '29ae79850439397742e0b7147a0fd9b5683058a4',
    node_id: 'MDY6Q29tbWl0Mzc2NzA2MzI2OjI5YWU3OTg1MDQzOTM5Nzc0MmUwYjcxNDdhMGZkOWI1NjgzMDU4YTQ=',
    html_url: 'https://github.com/AramZS/devblog/commit/29ae79850439397742e0b7147a0fd9b5683058a4',
    comments_url: 'https://api.github.com/repos/AramZS/devblog/commits/29ae79850439397742e0b7147a0fd9b5683058a4/comments',
    commit: {
      url: 'https://api.github.com/repos/AramZS/devblog/git/commits/29ae79850439397742e0b7147a0fd9b5683058a4',
      author: [Object],
      committer: [Object],
      message: 'Set up blogroll and links and write up day 26',
      tree: [Object],
      comment_count: 0
    },
    author: {
      login: 'AramZS',
      id: 748069,
      node_id: 'MDQ6VXNlcjc0ODA2OQ==',
      avatar_url: 'https://avatars.githubusercontent.com/u/748069?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/AramZS',
      html_url: 'https://github.com/AramZS',
      followers_url: 'https://api.github.com/users/AramZS/followers',
      following_url: 'https://api.github.com/users/AramZS/following{/other_user}',
      gists_url: 'https://api.github.com/users/AramZS/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/AramZS/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/AramZS/subscriptions',
      organizations_url: 'https://api.github.com/users/AramZS/orgs',
      repos_url: 'https://api.github.com/users/AramZS/repos',
      events_url: 'https://api.github.com/users/AramZS/events{/privacy}',
      received_events_url: 'https://api.github.com/users/AramZS/received_events',
      type: 'User',
      site_admin: false
    },
    committer: {
      login: 'AramZS',
      id: 748069,
      node_id: 'MDQ6VXNlcjc0ODA2OQ==',
      avatar_url: 'https://avatars.githubusercontent.com/u/748069?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/AramZS',
      html_url: 'https://github.com/AramZS',
      followers_url: 'https://api.github.com/users/AramZS/followers',
      following_url: 'https://api.github.com/users/AramZS/following{/other_user}',
      gists_url: 'https://api.github.com/users/AramZS/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/AramZS/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/AramZS/subscriptions',
      organizations_url: 'https://api.github.com/users/AramZS/orgs',
      repos_url: 'https://api.github.com/users/AramZS/repos',
      events_url: 'https://api.github.com/users/AramZS/events{/privacy}',
      received_events_url: 'https://api.github.com/users/AramZS/received_events',
      type: 'User',
      site_admin: false
    },
    parents: [ [Object] ],
    repository: {
      id: 376706326,
      node_id: 'MDEwOlJlcG9zaXRvcnkzNzY3MDYzMjY=',
      name: 'devblog',
      full_name: 'AramZS/devblog',
      private: false,
      owner: [Object],
      html_url: 'https://github.com/AramZS/devblog',
      description: null,
      fork: false,
      url: 'https://api.github.com/repos/AramZS/devblog',
      forks_url: 'https://api.github.com/repos/AramZS/devblog/forks',
      keys_url: 'https://api.github.com/repos/AramZS/devblog/keys{/key_id}',
      collaborators_url: 'https://api.github.com/repos/AramZS/devblog/collaborators{/collaborator}',
      teams_url: 'https://api.github.com/repos/AramZS/devblog/teams',
      hooks_url: 'https://api.github.com/repos/AramZS/devblog/hooks',
      issue_events_url: 'https://api.github.com/repos/AramZS/devblog/issues/events{/number}',
      events_url: 'https://api.github.com/repos/AramZS/devblog/events',
      assignees_url: 'https://api.github.com/repos/AramZS/devblog/assignees{/user}',
      branches_url: 'https://api.github.com/repos/AramZS/devblog/branches{/branch}',
      tags_url: 'https://api.github.com/repos/AramZS/devblog/tags',
      blobs_url: 'https://api.github.com/repos/AramZS/devblog/git/blobs{/sha}',
      git_tags_url: 'https://api.github.com/repos/AramZS/devblog/git/tags{/sha}',
      git_refs_url: 'https://api.github.com/repos/AramZS/devblog/git/refs{/sha}',
      trees_url: 'https://api.github.com/repos/AramZS/devblog/git/trees{/sha}',
      statuses_url: 'https://api.github.com/repos/AramZS/devblog/statuses/{sha}',
      languages_url: 'https://api.github.com/repos/AramZS/devblog/languages',
      stargazers_url: 'https://api.github.com/repos/AramZS/devblog/stargazers',
      contributors_url: 'https://api.github.com/repos/AramZS/devblog/contributors',
      subscribers_url: 'https://api.github.com/repos/AramZS/devblog/subscribers',
      subscription_url: 'https://api.github.com/repos/AramZS/devblog/subscription',
      commits_url: 'https://api.github.com/repos/AramZS/devblog/commits{/sha}',
      git_commits_url: 'https://api.github.com/repos/AramZS/devblog/git/commits{/sha}',
      comments_url: 'https://api.github.com/repos/AramZS/devblog/comments{/number}',
      issue_comment_url: 'https://api.github.com/repos/AramZS/devblog/issues/comments{/number}',
      contents_url: 'https://api.github.com/repos/AramZS/devblog/contents/{+path}',
      compare_url: 'https://api.github.com/repos/AramZS/devblog/compare/{base}...{head}',
      merges_url: 'https://api.github.com/repos/AramZS/devblog/merges',
      archive_url: 'https://api.github.com/repos/AramZS/devblog/{archive_format}{/ref}',
      downloads_url: 'https://api.github.com/repos/AramZS/devblog/downloads',
      issues_url: 'https://api.github.com/repos/AramZS/devblog/issues{/number}',
      pulls_url: 'https://api.github.com/repos/AramZS/devblog/pulls{/number}',
      milestones_url: 'https://api.github.com/repos/AramZS/devblog/milestones{/number}',
      notifications_url: 'https://api.github.com/repos/AramZS/devblog/notifications{?since,all,participating}',
      labels_url: 'https://api.github.com/repos/AramZS/devblog/labels{/name}',
      releases_url: 'https://api.github.com/repos/AramZS/devblog/releases{/id}',
      deployments_url: 'https://api.github.com/repos/AramZS/devblog/deployments'
    },
    score: 1
  }
]
```

So what I need is def in there. Now I just need to figure out how to get it out of the async request on on to my new token.

Hmm, [it looks like getting the async data into there is going to be the most complex part](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md#i-need-async-rule-how-to-do-it). The right answer has to be caching, and it looks like there is [an 11ty native tool for that](https://www.11ty.dev/docs/plugins/cache/), but I think that might be overkill. Especially because I want something I *can* save as basically a static file, since this won't be changing. Also, the 11ty plugin won't work because it is still async. This means I'm basically required to handle this as a file. Also, need to watch out as if I write to the directory I'm watching, I may end up triggering the watch in a loop.

Another thing I'll need to be careful of when caching this data is if I'm automatically creating files, I should likely be using the query as a file key, that query may contain characters not safe for file names, so I'll need to pull something in to handle sanitization.

```javascript
var sanitizeFilename = require("sanitize-filename");
```

Ok, so let's start putting it down.

```javascript
const commit_pattern = () => {
	return /(?<=git commit \-am [\"|\'])(.+)(?=[\"|\'])/i;
}
// I can get the "repo" from the post object
// Then I need to change the commit message I captured
// Queries don't allow spaces, so replace them with "+"
const gitSearchQuery = (repo, commitMsg) => {
	const searchCommitMsg = commitMsg.replace(" ", "+")
	const repoName = repo.replace("https://github.com/", "")
	return `repo:${repoName}+${searchCommitMsg}`
}
```

Now let's create a function to figure out the path to the new cache folder.

```javascript
const cacheFilePath = (pageFilePath, searchKey) => {
	const cacheFolder = path.join(__dirname, "../../", '/_queryCache', pageFilePath)
	const cacheFile = cacheFolder+sanitizeFilename(slugify(searchKey).replace(".", ""))
	// console.log('cacheFile: ', cacheFile)
	return { cacheFolder, cacheFile }
}
```

I can use `fs.accessSync` to check if the file exists before creating a cache. After all I don't want to query GitHub every time I do a build. So we can use this in the process to find the repo commit link.

```javascript
const getLinkToRepo = async (repo, commitMsg, pageFilePath) => {
	const searchKey = gitSearchQuery(repo, commitMsg)
	const {cacheFolder, cacheFile} = cacheFilePath(pageFilePath, searchKey)
	try {
		fs.accessSync(cacheFile, fs.constants.F_OK)
		return true;
```

If it exists the function ends here and returns true.

But when we know the file doesn't exist we will have to continue using the `catch`. I'll make a request to GitHub using Octokit. I'm pretty much skipping over how I set up Octokit because this is basically the boilerplate.

The only thing that I have added into the mix here is to get my Github Key using the environment. Locally I'll use DotEnv `require('dotenv').config()`. But I'll have to figure out how to handle it on GitHub next. And I get the searchKey using my above function `gitSearchQuery`.

```javascript
} catch (e) {
		console.log('Query is not cached: ', cacheFile, e)
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
```

Once the commit is found, I'll try to cache it by writing a file using the path to the post and then the search query as a file key.

```javascript
try {
	fs.mkdirSync(cacheFolder, { recursive: true })
	// console.log('write data to file', cacheFile)
	fs.writeFileSync(cacheFile, r.data.items[0].html_url)
} catch (e) {
	console.log('writing to cache failed:', e)
}
return r.data.items[0].html_url
```

Now that I have a way to handle caching, I need to trigger it as part of the markdown building process.

I'll need a process to actually create the link on the commit in the `markdown-it` way.

I'll need to create HTML tokens for the link open and close as follows:

```javascript
const createLinkTokens = (TokenConstructor,commitLink) => {
	const link_open = new TokenConstructor('html_inline', '', 0)
	link_open.content = '<a href="'+commitLink+'" target="_blank">'
	const link_close = new TokenConstructor('html_inline', '', 0)
	link_close.content = '</a>'
	return {link_open, link_close}
}
```

I'll need to take the markdown-it object and create a new `ruler` rule. I'll use `state.env` to check for the `repo` property and test for the commit pattern in each `inline` token. By using `inline` instead of `code_inline` I will be able to place my new `html_inline` token around the commit text.

```javascript

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
					let envRepo = state.env.repo;
					let linkToRepo = ''
					// Let's make the default link go to the commit log, that makes more sense.
					linkToRepo = envRepo
					if (envRepo.slice(-1) != "/"){
						// Assure the last character is a "/"
						linkToRepo += "/"
					}
					linkToRepo += "commits/main"
					try {
						fs.accessSync(cacheFile, fs.constants.F_OK)
						linkToRepo = (fs.readFileSync(cacheFile)).toString()
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

module.exports = (md) => {
	gitCommitRule(md)
};
```

It's looking good here, though it isn't super clear that it is a link. Maybe I can add some style to it. Let me grab an [image of a link](https://www.pinclipart.com/downpngs/iRxxRho_link-icon-navy-blue-blue-link-icon-png/) to add to the style. [I'll need to size it down](https://onlinepngtools.com/resize-png).

`git commit -am "Adding links to commits across all new posts along with a whole new plugin for building links to commits automatically into new posts for day 37"`

Then I can add the CSS.

```scss
.git-commit-link
    text-decoration: underline
    &:hover
        text-decoration-color: grey
    &:after
        content: ' '
        background: transparent url(/img/linkicon-s.png) center right no-repeat
        font-weight: normal
        font-style: normal
        margin: 0px 0px 0px 10px
        text-decoration: none
        background-size: contain
        display: inline-block
        width: 12px
        height: 12px
```

`git commit -am "Set the default link for repos to go to the main commit log"`
