---
title: Hello World Devblog - Pt. 17
subtitle: Getting this dev blog running
description: Part 17 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-07-29 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - Github Actions
  - WiP
---


1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [x] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [ ] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [ ] Order projects listing by last posted blog in that project

- [ ] Limit the output of home page post lists to a specific number of posts

- [ ] Show the latest post below the site intro on the homepage.

- [ ] Tags pages with Pagination

## Day 17

So as of last time I checked out [this walkthrough](https://docs.joshuatz.com/cheatsheets/node-and-npm/markdown-it/).

It has a little more information for me to use than the Markdown-it documentation. It also recommended I check out one of the markdown-it plugins I was actually able to get working. [So let's do that](https://github.com/valeriangalliat/markdown-it-anchor/blob/HEAD/index.js).

Just looking at my homepage and realizing I need to add some to-dos:

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [ ] Show the latest post below the site intro on the homepage.

- [ ] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

Ok, let's take on projects by last updated. I guess this means another field to add to that projects object. I guess I'll start off by getting the front matter. I guess the first step is pulling in a markdown frontmatter processor.

It looks [like `markdown-it` doesn't ship with frontmatter parsing](https://www.npmjs.com/package/markdown-it-front-matter). [Eleventy uses grey-matter to handle frontmatter](https://www.11ty.dev/docs/data-frontmatter/) so if I pull that package in it won't increase our NPM package footprint.

Ok, so with that in hand, let's get the file content.

```javascript
const { readdirSync, readFileSync } = require("fs");
const path = require("path");
const matter = require("gray-matter");
// ...
	const projectFilesContent = projectFiles.map((filePath) => {
		return readFileSync(
			path.resolve(`./src/posts/projects/${projectDir}/${filePath}`)
		).toString(); // Don't forget the `toString` part!
	});
```

Gotta remember to use `path` in this because otherwise it just gives me the last portion of the path.

Ok, so let's use grey-matter to pull out that data. Where on the object does it live? I'm not getting anything yet.

Ok, it's because the front-matter data lives on `object.data` so my date is at `object.data.date`. Cool. Ok, got it working now. I can use `Array.reduce` here to figure out the most recent date.

```javascript
	lastUpdated = projectFilesContent.reduce((prevValue, fileContent) => {
		try {
			const mdObject = matter(fileContent);
			// console.log("data", mdObject.data);
			if (!mdObject.data || !mdObject.data.date) {
				return 0;
			}
			const datetime = Date.parse(mdObject.data.date);
			if (prevValue > datetime) {
				return prevValue;
			} else {
				return datetime;
			}
		} catch (e) {
			console.log("Could not find date", e);
			return 0;
		}
	}, 0);
```

And then I can sort it.

```javascript
directorySet.sort((a, b) => b.lastUpdatedPost - a.lastUpdatedPost);
```

Done!

Ok, now I can limit the posts output on the homepage by adding a limit count ot the shortcode.

```javascript
	eleventyConfig.addShortcode(
		"projectList",
		function (collectionName, collectionOfPosts, order, hlevel, limit) {
		// ...
			if (collectionOfPosts && limit) {
				collectionOfPosts = collectionOfPosts.slice(0, limit);
			}
```

Works!

`git commit -am "Improve homepage outputs and ordering!" `
