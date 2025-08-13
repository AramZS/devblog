---
title: XYZ Site - Day 13 - Setting up a share button as an eleventy plugin.
description: "Make it easier to share my content online"
date: 2025-06-15 17:59:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - Social Media
  - Web Share API
---

## Project Scope and ToDos

1. Create a versatile blog site
2. Create a framework that makes it easy to add external data to the site

- [ ] Give the site the capacity to replicate the logging and rating I do on Serialized and Letterboxd.
- [x] Be able to pull down RSS feeds from other sites and create forward links to my other sites
- [x] Create forward links to sites I want to post about.
- [ ] Create a way to pull in my Goodreads data and display it on the site
- [ ] Create a way to automate pulls from other data sources
- [x] Combine easy inputs like text lists and JSON data files with markdown files that I can build on top of.
- [x] Add a TMDB credit to footer in base.njk
- [x] Make sure tags do not repeat in the displayed tag list.
- [x] Get my Kindle Quotes into the site
- [ ] YouTube Channel Recommendations
- [x] Minify HTML via Netlify plugin.
- [ ] Log played games

## Day 13

After thinking about it some more I'm realizing the easiest thing is to turn this into a Eleventy plugin. So I'm going to restructure it that way.

Let's start with [a quick template](https://www.11ty.dev/docs/create-plugin/) for the `eleventy.config.js` file:

```js
export default function (eleventyConfig, options = {}) {
	let options = Object.assign({
		defaultUtms: []
	}, options);

	eleventyConfig.addPlugin(function(eleventyConfig) {
		// I am a plugin!
	});
};
```

Oh right, I'm in CJS, I gotta restructure:

```js
const { activateShortcodes } = require("./lib/shortcodes");

module.exports = {
  configFunction: function (eleventyConfig, options = {}) {
    options = Object.assign({
      defaultUtms: [],
      defaultShareText: "Share this post",
      domain: ""
    }, options);

    eleventyConfig.addPlugin(function(eleventyConfig) {
      // I am a plugin!
      activateShortcodes(eleventyConfig, options);
    });
  },
}
```

The button will need styles. For now I'm going to embed that together with the button supplied by the shortcode.

`git commit -am "Set up share button, still needs styling"`
