---
title: "Day 15: Testing the Contexter in action"
description: "I want to get the data set up in an HTML block a user can style"
date: 2022-2-17 22:59:43.10 -4
tags:
  - Node
  - WiP
  - archiving
  - embeds
  - Twitter
---

## Project Scope and ToDos

1. Take a link and turn it into an oEmbed/Open Graph style share card
2. Take a link and archive it in the most reliable way
3. When the link is a tweet, display the tweet but also the whole tweet thread.
4. When the link is a tweet, archive the tweets, and display them if the live ones are not available.
5. Capture any embedded retweets in the thread. Capture their thread if one exists
6. Capture any links in the Tweet
7. Create the process as an abstract function that returns the data in a savable way

- [x] Archive links on Archive.org and save the resulting archival links
- [x] Create link IDs that can be used to cache related content
- [ ] Integrate it into the site to be able to make context pages here.
- [ ] Check if a link is still available at build time and rebuild the block with links to an archived link
- [ ] Use v1 Twitter API to get Gifs and videos

## Day 15

Ok, so I've figured out that I may want to try something different this time, instead of sitting it inside of the markdown-it process, I can use Eleventy. My hope is that at some point I can attach these promises to something that can resolve them within the build process, but I'm not seeing a way yet.

It looks like the right direction is setting up a custom renderer, the original docs said it worked on async, but it [doesn't work on async](https://github.com/11ty/eleventy/issues/2217) apparently, at least for now. So I think I'm going to have to pursue the same strategy I did in the past with the Markdown Github links, cache and reprocess opportunistically.

Ok, so the setup as an extension:

```javascript
eleventyConfig.addExtension(options.extension, {
	read: true,
	compile: compiler,
});
```

It looks like I can't use the `defaultRenderer` with the `inputContent` argument that is the first argument sent into the compiler. So I'm going to need to use the already set-up markdown object.

Hmmm, easiest way to handle it is to pass the Markdown-It object into my plugin's options.

```javascript
eleventyConfig.addPlugin(require("./_custom-plugins/markdown-contexter"), {
	existingRenderer: markdownSetup,
});
```

Ok, I've got Markdown-It working in my Eleventy extension, but it screwing up my other Markdown extension because it doesn't have anything set into the `env`. The object I need for my other markdown project in the `env` property looks like this:

```javascript
{
    defaults: { layout: 'default.njk', description: 'Talking about code' },
    description: 'I want to get the data set up in an HTML block a user can style',
    layout: 'post.njk',
    projects: [ [Object], [Object], [Object] ],
    site: {
      lang: 'en-US',
      github: [Object],
      site_url: 'http://localhost:8080',
      site_name: 'Fight With Tools: A Dev Blog',
      description: 'A site opening up my development process to all.',
      featuredImage: 'nyc_noir.jpg',
      aramPhoto: 'https://raw.githubusercontent.com/AramZS/aramzs.github.io/master/_includes/Aram-Zucker-Scharff-square.jpg'
    },
    eleventy: { env: [Object] },
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
    tags: [
      'posts',
      'projects',
      'Node',
      'WiP',
      'archiving',
      'embeds',
      'Twitter'
    ],
    date: 2022-02-07T02:59:43.100Z,
    project: 'Context Pages',
    repo: 'https://github.com/AramZS/contexter',
    featuredImage: 'radial_crosshair.jpg',
    title: 'Day 14: Testing the Contexter in action',
    page: {
      date: 2022-02-07T02:59:43.100Z,
      inputPath: './src/posts/projects/context-pages/day-14.md',
      fileSlug: 'day-14',
      filePathStem: '/posts/projects/context-pages/day-14',
      outputFileExtension: undefined,
      url: '/posts/projects/context-pages/day-14/',
      outputPath: 'docs/posts/projects/context-pages/day-14/index.html'
    },
    collections: {
      all: [Array],
      blogroll: [Array],
      'Personal Blog': [Array],
      links: [Array],
      'Code Reference': [Array],
      Sass: [Array],
      '11ty': [Array],
      NPM: [Array],
      'Product Output': [Array],
      'Tech Critical': [Array],
      Blockchain: [Array],
      Cryptocurrency: [Array],
      posts: [Array],
      Writing: [Array],
      Collaboration: [Array],
      'Open Source': [Array],
      'Ad Tech': [Array],
      'BAd Tech': [Array],
      'Broken By Design': [Array],
      projects: [Array],
      Node: [Array],
      WiP: [Array],
      Analytics: [Array],
      Privacy: [Array],
      Metrics: [Array],
      archiving: [Array],
      Twitter: [Array],
      embeds: [Array],
      oembed: [Array],
      opengraph: [Array],
      metadata: [Array],
      hcard: [Array],
      RDF: [Array],
      'JSON-LD': [Array],
      'Schema Dot Org': [Array],
      'Structured Data': [Array],
      Markdown: [Array],
      'Markdown-It': [Array],
      'Internet Archive': [Array],
      fetch: [Array],
      research: [Array],
      'Memento API': [Array],
      Starters: [Array],
      dinky: [Array],
      nvm: [Array],
      'GitHub Pages': [Array],
      Nunjucks: [Array],
      Shortcodes: [Array],
      'GitHub Actions': [Array],
      CSS: [Array],
      GPC: [Array],
      'Dart Sass': [Array],
      SEO: [Array],
      SMO: [Array],
      YAML: [Array],
      Aggregation: [Array],
      Mustache: [Array],
      'Code Blocks': [Array],
      a11y: [Array],
      GitHub: [Array],
      'GitHub API': [Array],
      Prism: [Array],
      'Source Maps': [Array],
      Sitemaps: [Array],
      Cachebreak: [Array],
      Mocha: [Array],
      RSS: [Array],
      'Cache breaking': [Array],
      Retros: [Array],
      '30m': [Array],
      SCSS: [Array],
      tagList: [Array],
      deepLinkPostsList: [Array],
      projectsPages: [Array],
      deepProjectPostsList: [Array],
      postsPages: [Array],
      deepTagList: [Array]
    }
  }
}
```

Ok, where can I get it?

My `compiler` function only gets the basic data, the file path and content. But of course, the Markdown-It function has to get this data at some point? How does it even get set?

Looks like [env gets passed into the Markdown-It render function](https://markdown-it.github.io/markdown-it/#MarkdownIt.render). Ok, what's the `data` argument that gets passed into the function I return from the compiler?

Let's log it.

Bingo! Ok, so we're going to have a bit of a complicated set up, the function that handles rendering the contexter output and passing it into the Markdown-It object is going to have to be pre-defined and passed into the returned function.

```javascript
	const reMarkdown = (inputContent, data) => {
		if (
			inputContent.includes(
				"https://twitter.com/Chronotope/status/1402628536121319424"
			)
		) {
			console.log("inputContent Process");
			let pContext = contexter(
				"https://twitter.com/Chronotope/status/1485620069229027329"
			);
		}
		// 2nd argument sets env
		return options.existingRenderer.render(inputContent, data);
	};
	const compiler = (inputContent, inputPath) => {
		let remark = false;
		if (
			inputContent &&
			inputPath &&
			inputPath.endsWith(`.${options.extension}`)
		) {
			remark = true;
		}
		return function (data) {
			if (remark && data.layout && /post/.test(data.layout)) {
				const rmResult = reMarkdown(inputContent, data);
				return rmResult;
			}
			// You can also access the default `markdown-it` renderer here:
			return this.defaultRenderer(data);
		};
	};
```

Ok, now to write some files!

Hmmm, to get the file name, I'll need to be able to get the link ID and the sanitized link before initiating the promise. I'll have to restructure the main object to return those functions.

`git commit -am "Small fixes and getting link utils facing out of the module"`

Ok, now to pull the URLs in with the regex. I'm going to name the regex group and use `exec` to pull just the URL along with the full match to make it possible to replace in the text.

Here's the final regex:

```javascript
const urlRegex =
	/^(?:[\t\- ]*)(?<main>(\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))(?=\n|\r)$)+)/gim;
```

Here's how I handled the walkthrough of the regex results:

```javascript
		let matchArray = [];
		let urlsArray = [];
		let counter = 0;
		while ((matchArray = urlRegex.exec(inputContent)) != null) {
			if (urls) {
				console.log(
					"Found URLs",
					matchArray.groups.main,
					matchArray[0]
				);
				urlsArray.push({
					url: matchArray.groups.main,
					replace: matchArray[0],
				});
				counter++;
			}
		}
		if (urlsArray.length) {
			urlsArray.forEach((urlObj) => {
				const link = urlObj.url;
				console.log("inputContent Process");
				// console.log("inputContent treated", inputContent);
				const { cacheFolder, cacheFile } = cacheFilePath(
					"",
					contexter.uidLink(contexter.sanitizeLink(link))
				);
				try {
					fs.accessSync(cacheFile, fs.constants.F_OK);
					const contextString = fs.readFileSync(cacheFile).toString();
					const contextData = JSON.parse(contextString);
					// console.log("contextData", contextData);
					// const contextData = JSON.parse(contextString);
					inputContent = inputContent.replace(
						urlObj.replace,
						contextData.htmlEmbed
					);
				} catch (e) {
					let pContext = contexter.context(link);
					// No file yet
					console.log(
						"Cached link " + cacheFile + " to repo not ready"
					);
					pContext.then((r) => {
						console.log("Context ready", r.linkId);
						// No file yet
						console.log(
							"Cached link for " + cacheFile + " ready to write."
						);
						try {
							fs.mkdirSync(cacheFolder, { recursive: true });
							// console.log('write data to file', cacheFile)
							fs.writeFileSync(cacheFile, JSON.stringify(r));
						} catch (e) {
							console.log("writing to cache failed:", e);
						}
					});
				}
			});
		}
```

Ok, my treatment here [looks good](https://github.com/AramZS/devblog/commit/b76853b38f74735fc7a1783ee176ce65b9bbdf84)! Only, the embeds don't look so good. Ok, looks like we have some work to do in terms of how the HTML can work, but the basic concept is very sound.
