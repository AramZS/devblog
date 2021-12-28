---
title: Extract Sass into an Eleventy Plugin
description: "More devblog"
project: Dev Blog
date: 2021-11-26 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - Sass
  - NPM
  - SCSS
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

<s>
- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).
</s>

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

<s>

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

</s>

- [x] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [x] Posts should be able to support a preview header image that can also be shown on post lists.

- [x] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

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

## Day 41

Ok, so I want to continue to get a better understanding of Eleventy so as part of my end-of-project clean up I'm extracting tools I wrote for this blog into general use plugins. Yesterday, a Markdown-It plugin. Today, let's see if I can make my Sass plugin generally usable, since that seems to be missing in the Eleventy community.

### Basic Eleventy Plugin Setup

Ok, so let's look at some of the useful plugins I'm familiar with: [the TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/main/.eleventy.js) and [Eleventy Google Fonts](https://github.com/takanorip/eleventy-google-fonts/blob/master/.eleventy.js). These both handle different Eleventy flows and so are useful examples.

The first thing to note is that Eleventy plugins initiate with `.eleventy.js` files and take an `eleventyConfig` object and passed `options` object.

In the `.eleventy.js` file I'll set up a very basic structure and work in my original JS.

```javascript
const generateSass = require("./src/generate-sass");

module.exports = function (eleventyConfig, options) {
	return generateSass(eleventyConfig, options);
};
```

Ok, so now what and how do I handle this eleventyConfig object? Well let's take a look at it:

So here's what an eleventyConfig object looks like:

```javascript
Eleventy Plugin Info UserConfig {
  events: EventEmitter {
    _events: [Object: null prototype] { beforeWatch: [Function (anonymous)] },
    _eventsCount: 1,
    _maxListeners: undefined,
    [Symbol(kCapture)]: false
  },
  collections: {},
  templateFormats: undefined,
  liquidOptions: {},
  liquidTags: {},
  liquidFilters: {
    slug: [Function (anonymous)],
    url: [Function (anonymous)],
    log: [Function (anonymous)],
    getCollectionItem: [Function (anonymous)],
    getPreviousCollectionItem: [Function (anonymous)],
    getNextCollectionItem: [Function (anonymous)],
    eleventyNavigation: [Function (anonymous)],
    eleventyNavigationBreadcrumb: [Function (anonymous)],
    eleventyNavigationToHtml: [Function (anonymous)]
  },
  liquidShortcodes: { sitemap: [Function (anonymous)] },
  liquidPairedShortcodes: {},
  nunjucksFilters: {
    slug: [Function (anonymous)],
    url: [Function (anonymous)],
    log: [Function (anonymous)],
    getCollectionItem: [Function (anonymous)],
    getPreviousCollectionItem: [Function (anonymous)],
    getNextCollectionItem: [Function (anonymous)],
    eleventyNavigation: [Function (anonymous)],
    eleventyNavigationBreadcrumb: [Function (anonymous)],
    eleventyNavigationToHtml: [Function (anonymous)],
    absoluteUrl: [Function (anonymous)],
    getNewestCollectionItemDate: [Function (anonymous)],
    dateToRfc3339: [Function (anonymous)],
    rssLastUpdatedDate: [Function (anonymous)],
    rssDate: [Function (anonymous)]
  },
  nunjucksAsyncFilters: { htmlToAbsoluteUrls: [Function (anonymous)] },
  nunjucksTags: {},
  nunjucksShortcodes: {},
  nunjucksAsyncShortcodes: { sitemap: [Function (anonymous)] },
  nunjucksPairedShortcodes: {},
  nunjucksAsyncPairedShortcodes: {},
  handlebarsHelpers: {
    slug: [Function (anonymous)],
    url: [Function (anonymous)],
    log: [Function (anonymous)],
    getCollectionItem: [Function (anonymous)],
    getPreviousCollectionItem: [Function (anonymous)],
    getNextCollectionItem: [Function (anonymous)],
    eleventyNavigation: [Function (anonymous)],
    eleventyNavigationBreadcrumb: [Function (anonymous)],
    eleventyNavigationToHtml: [Function (anonymous)]
  },
  handlebarsShortcodes: {},
  handlebarsPairedShortcodes: {},
  javascriptFunctions: {
    slug: [Function (anonymous)],
    url: [Function (anonymous)],
    log: [Function (anonymous)],
    getCollectionItem: [Function (anonymous)],
    getPreviousCollectionItem: [Function (anonymous)],
    getNextCollectionItem: [Function (anonymous)],
    eleventyNavigation: [Function (anonymous)],
    eleventyNavigationBreadcrumb: [Function (anonymous)],
    eleventyNavigationToHtml: [Function (anonymous)],
    sitemap: [Function (anonymous)]
  },
  pugOptions: {},
  ejsOptions: {},
  markdownHighlighter: null,
  libraryOverrides: {},
  passthroughCopies: {},
  layoutAliases: {},
  linters: {},
  filters: {},
  activeNamespace: '',
  DateTime: [class DateTime],
  dynamicPermalinks: true,
  useGitIgnore: true,
  dataDeepMerge: false,
  extensionMap: Set(0) {},
  watchJavaScriptDependencies: true,
  additionalWatchTargets: [ './_custom-plugins/', './src/_sass' ],
  browserSyncConfig: {},
  chokidarConfig: {},
  watchThrottleWaitTime: 0,
  dataExtensions: Map(0) {},
  quietMode: false
}
```

It turns out that none of these things are... directly accessible though? I'm not sure how to get into any of those. Well, I have the usual `eleventyConfig` tools though, so I guess that's the point.

Let's set some default options that I'll need to build CSS files along with URL-domain-based source maps.

```javascript
const pluginDefaults = {
	domainName: "http://localhost:8080",
	includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
	sassLocation: path.join(path.resolve("../../"), "src/_sass/"),
	sassIndexFile: "_index.sass",
	outDir: path.join(path.resolve("../../"), "docs"),
	outPath: "/assets/css/",
	sourceMap: true,
	perTemplateFiles: "template-",
	cacheBreak: false,
};
```

It's a lot, I know, but I don't think there's any way around it.

I could use `addTransform` to alter the HTML output to add the CSS to it, but as I explore more plugins it seems like the way to do this is to supply a shortcode and let the user leverage it. It would be fun to play with this, but I think I may end up removing it.

```javascript
	eleventyConfig.addTransform("sassCore", async (content, outputPath) => {
		if (outputPath && outputPath.endsWith(".html")) {
		}

		return content;
	});
```

Ok, so I'll split this into three files to make it easy to handle, one each for: generating Sass stuff in the Eleventy context, creating Sass strings, writing Sass strings to the correct location.

It looks like my use of `renderSync` has been depreciated and [replaced by `compile`](https://sass-lang.com/documentation/js-api/modules#compile). Ok.

You know what? I'm just going to lock patch version. I don't want to deal with this badly documented transition right now and it looks like `compile` is missing some options I depend on and has transformed other options to a new unclear property.

Now dependencies looks like:

```javascript
  "dependencies": {
    "sass": "~1.45.1"
  }
```

This feels like a problem I keep encountering in the Sass project which is that... it's a mess for no good reason and it doesn't do a great job documenting changes. Frustrating.

Ok, let's seperate out the functions and put in the variables.

Note to self: can't assume users are in Eleventy v1, so `addGlobalData` is out.

Ok, how am I going to pass my plugin options into the shortcode? [Looks like it is in-scope as long as I have the call inside my function](https://github.com/gfscott/eleventy-plugin-youtube-embed/blob/main/.eleventy.js).

Ok, some difficulty in making sure I get all my file names correct, but nothing to do other then 3 or 4 or 5 iterations until I'm sure all my filepaths are correct. Just keep going!

Ok, a little more fiddling on file names and source maps' names. Alrighty! It looks good.

Looks like [there is a way](https://www.11ty.dev/docs/events/#beforebuild) I can make it rebuild that Sass on every build, even `watch` builds.

Let's test it as a module!

Oh right, I can't call it this. There's already [a plugin called "eleventy-plugin-sass"](https://www.npmjs.com/package/eleventy-plugin-sass) that I struggled with [on Day 1](https://fightwithtools.dev/posts/projects/devblog/hello-day-1/)! Ok, let's call it the more accurate "eleventy-plugin-dart-sass".

Works with passed configuration options. Let's try it with the defaults. Oo, nope. Ok, more path fiddling!

New default object figured out:

```javascript
const pluginDefaults = {
	domainName: "http://localhost:8080",
	includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
	sassLocation: path.normalize(path.join(__dirname, "../../../", "src/_sass/")),
	sassIndexFile: "_index.sass",
	outDir: path.normalize(path.join(__dirname, "../../../", "docs")),
	outPath: "/assets/css/",
	outFileName: "style",
	sourceMap: true,
	perTemplateFiles: "template-",
	cacheBreak: false,
	outputStyle: "compressed",
	watchSass: true,
};
```

Ok, yeah, everything is working now and even smoother than before! I guess I should write some tests? But that seems really really complicated right? I'm not sure where to start. Ok... well... maybe something to come back to. I'm going to write the docs and update the package. Let's test how it builds on remote first.

Oh, right, I need to path the paths until I update the NPM package. Ok, I will fix that annnnnddddd..... yeah, it works! Yay!

Ok, let's add the readme!

And [it is published](https://www.npmjs.com/package/eleventy-plugin-dart-sass)!

`git commit -am "Add final notes for the Sass Plugin"`
