---
title: XYZ Site - Day 12 - Setting up a share button.
description: "Make it easier to share my content online"
date: 2025-04-05 17:59:43.10 -4
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

## Day 12

Now that the Web Share API is pretty much available everywhere I really have wanted to take some time to figure out how to use it. [An article on setting up sharing with HTML/JS](https://piccalil.li/blog/simplify-sharing-with-built-in-apis-and-progressive-enhancement/) popped up on my feed reader and I figured this is the excuse to give it a try.

One thing I really want to do here is avoid having more network requests for script files. This has been an issue that has come up at work and the tactic I thought about there is one I want to try for myself here, which is to pull the script out of a JS file and into the HTML file for inline script tags.

There might be more than one script I want to handle this way, but I think they all belong in a single script tag? The potential problem here is that this could cause problems with how JS pointers bubble up, giving it a broad scope.

Actually... now that I've typed it out... I don't want it to be in a single script tag. Let's not do that.

Ok, so I need a block in the template:

`{{ build.footerInlineScript | safe }}`

I need to make it safe because it is HTML and I don't want it escaped.

This is a `build` 11ty data object in the `_data` folder. In there I have an object now:

```js
const shareActions = require("../../plugins/share-actions");

module.exports = {
	env: process.env.ELEVENTY_ENV,
	timestamp: new Date(),
	bookwyrm: {
		username: "aramzs",
		instance: "bookwyrm.tilde.zone",
	},
  footerInlineScript: `<script>${shareActions.js()}</script>`
};
```

With the `share-actions` file going to be my home for building this process. I can then build it like normal JS files in there and export it out from the `index.js` in the `share-actions` folder.

Now I'm free to build in `.js` files easily.

The other thing I may want to add to this process is minification, but I'll worry about that later.

I will want my custom HTML as well, and I can export that from my index also. I might not be able to get the per-page `data` context with the URL that way, but let's see what we can do.

Ok yeah, the data from the page build just doesn't seem accessible in the global data? At least not with the Nunjucks rendering process. I guess I'll have to define a Nunjucks template and import it into my template.

I'm putting it in the plugin's folder for now. That's not great b/c it doesn't trigger rebuild but hopefully it has full access to the page context?
