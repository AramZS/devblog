---
title: Hello World Devblog - Pt. 8
subtitle: Getting this dev blog running
description: Part 8 of setting up 11ty deb blog.
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - Github Actions
---


1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [ ] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/master/src/BuildTOC.js) mby?

- [ ] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

- [ ] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

## Day 8

So, the Sass source-map is still giving me file:// URLs. This is apparently some sort of weird error in the dart-sass implementation? I found a few issues, all of which seem to point at [one issue's set of solutions](https://github.com/sass/libsass/issues/908#issuecomment-76452477). But none of these worked for me. I'm not really sure why. I think because dart-sass assumes source maps are only used for local development, not also for public-facing examples like I want. But the top of that thread pointed me [at a useful build script example](https://github.com/joliss/node-sass-source-map-example/blob/master/better-output.js).

On the basis of that (which still uses dirname for local file paths) I altered it to match my reality of running a local server"

```javascript
	const outFile = "/assets/css/style.css";
	var result = sass.renderSync({
		includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
		file: "src/_sass/_index.sass",
		outputStyle: "compressed",
		sourceMap: true,
		sourceMapContents: true,
		outFile: path.join(process.cwd(), path.basename(outFile)),
	});
	console.log("Sass renderSync result", result);
	var fullCSS = result.css.toString();
	var map = JSON.parse(result.map);
	map.sourceRoot = domain;
	result.map = JSON.stringify(map, null, "\t");
	var fullMap = result.map.toString();
```

I understand everything that my code is doing here, but the use of `process.cwd` here is very confusing. It works, for sure! I now have:

```json
	"version": 3,
	"sourceRoot": "http://localhost:8080",
	"sources": [
		"dinky/_sass/jekyll-theme-dinky.scss",
		"dinky/_sass/rouge-github.scss",
		"src/_sass/base-syntax-highlighting.scss",
		"src/_sass/syntax-highlighting.scss",
		"src/_sass/user.sass"
	],
```

The code sample says "HACK 1: Force all "sources" to be relative to project root" but it apparently does this so that dart-sass... gets rid of the project root? I find this process very confusing, I'm adding the project root so Sass can remove the project root? This is fking baffling to me and apparently hits some process that is very badly documented in dart-sass. The other hack "node-sass does not support sourceRoot, but we can add it" at least makes sense. Seems like something you should support! It looks like some iteration of Node-based Sass takes the `sourceMapRoot` configuration property, but not dart-sass. The documentation and debugging process is very confusing for this because dart-sass links to node-sass for most of its documentation, but node-sass clearly has some features that dart-sass does not, and the fact that issues are often in node-sass that are actually about dart-sass is just a *mess*.

Anyway, this works now... and it gives me a really useful insight into how the source map is built. I can hack better paths for sources! The paths themselves are useful for the project, but having them at the base of the website sort of irks me. Now I can put them all in a nice `sass` folder, makes it neat.

```javascript
	var newSources = map.sources.map((source) => {
		return "sass/" + source;
	});
	map.sources = newSources;
```

And I can also change my passthroughs in `.eleventy.js`.

```javascript
	eleventyConfig.addPassthroughCopy({
		"dinky/_sass": "sass/dinky/_sass",
	});
	eleventyConfig.addPassthroughCopy({
		"src/_sass": "sass/src/_sass",
	});
```

If this works correctly on publish, it will resolve the last of my base requirements!

Ok, I was thinking about how to handle build-time cache-breaking and realized that there's likely a way to handle getting a cache-break variable at the build stage. There's [a plugin for Jekyll to do it](https://github.com/jekyll/github-metadata), it looks like [it does so at least partially via the Github API](https://github.com/jekyll/github-metadata/blob/master/docs/authentication.md). It gets [a pretty good list of data too](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md). There's also [the "Github Context" which is available to GitHub actions](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context). I could call the API during build time, which is what it appears that Jekyll is doing (I didn't really look too deeply into the plugin). But if this data is available in the Actions context... couldn't I export it as a environment variable? Why not try adding that to the Github Actions script?

```yaml
        - run: export GITHUB_HEAD_SHA=${{ github.run_id }}
```

Now I should be able to call this in my site data, right? So I'll update the file at `src/_data/site.js`.

```javascript
module.exports = (info) => {
	return {
		lang: "en-US",
		github: {
			build_revision: process.env.GITHUB_HEAD_SHA || 1.0,
		},
		site_url: process.env.DOMAIN,
	};
};
```

Huh... about to try this but a thought occurs... should I just export the whole `github` object? Would that work? Wait... [is it already there](https://docs.github.com/en/actions/reference/environment-variables)? Let me try that both ways and see what I get.
