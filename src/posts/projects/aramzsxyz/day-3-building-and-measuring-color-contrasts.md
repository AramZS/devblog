---
title: XYZ Site - Day 3 - Getting a npm module client side to measure contrasts
description: "I like collecting color combinations for future projects but I want to make sure they are a11y AAA contrasts for accessible readability."
date: 2024-04-06 10:59:43.10 -4
tags:
  - 11ty
  - Node
  - Browserify
  - a11y
  - SSG
  - WiP
---

## Project Scope and ToDos

1. Create a versatile blog site
2. Create a framework that makes it easy to add external data to the site

- [ ] Give the site the capacity to replicate the logging and rating I do on Serialized and Letterboxd.
- [ ] Be able to pull down RSS feeds from other sites and create forward links to my other sites
- [ ] Create forward links to sites I want to post about.
- [ ] Create a way to pull in my Goodreads data and display it on the site
- [ ] Create a way to automate pulls from other data sources
- [ ] Combine easy inputs like text lists and JSON data files with markdown files that I can build on top of.
- [ ] Add a TMDB credit to footer in base.njk
- [ ] Make sure tags do not repeat in the displayed tag list.

## Day 3

I frequently will bookmark or reblog particularly interesting images that I think will provide a good mix of colors I could use in a different project. I'm not much of a designer, so this is a good way to bootstrap a website into looking good. It's how I decided on the [Song Obsessed](https://songobsessed.com) color scheme for instance.

I want to put a page in this site that includes that and I want to be able to compare the colors' contrasts in order to make sure they are accessible. I found a [npm module called `get-contrast`](https://www.npmjs.com/package/get-contrast) that will do this for me. But I want to use it based on clicks on the contrast page, which means making it work client side.

I'll take a look at rollup, but it seems to complex for this. In theory eslint should do the trick, and it has a nice convenient API I can leverage in a JS file to run it as part of 11ty's build process. It isn't working though and eslint's documentation is--as always--a painful read. It's been a long time since I last used Browserify, so let's try that.

Ok, this looks promising! I think I need to import it into the JS file I want to build like so:

```javascript
const contrast = require('get-contrast')

window.contrast = contrast;
```
I can either set it to the `window` object like this or set up my code in that file I think. To get the result running client side, it looks like I need to place it as a module like so:

```html
<script type="module" src="/scripts/contrast-ratio.js" async></script>
```

It seems to work! Now to make it build with 11ty. I don't see docs on a javascript API for Browserify. I'll take my command line script and use `exec` from Node to run it in `eleventy.before`.

Looks good in theory, but isn't working on the actual built site.

It appears like there is a race condition where 11ty is copying over the script before Browserify finishes building it. I need to make it wait and exec doesn't have a built-in promise. I can use `util.promisify` [from node to make it work I think](https://stackoverflow.com/questions/30763496/how-to-promisify-nodes-child-process-exec-and-child-process-execfile-functions).

And yes, now it does!

```javascript
eleventyConfig.on(
		"eleventy.before",
		async ({ dir, runMode, outputMode }) => {
			// Run me before the build starts
			console.log("Before Build", dir, runMode, outputMode);
      const util = require('util');
      const exec = util.promisify(require('node:child_process').exec);
      await exec('npx browserify ./public/scripts/contrast-calc.js > ./public/scripts/contrast-ratio.js');
```

`git commit -am "Get a contrast checker npm module client side"`

Not the cleanest solution, but it works. Now let's see if I can get my functionality for interacting with the colors working.

I really want to compare two colors of any type, but that's a little much for now. I think I'll just click a foreground color and compare it to the background color. This seems good.

How do I want to grab the results? I think I can fix a div to the top of the page and output it there. That works well, though I'll need to mod some pixels widths and background colors to make the text persistently displayable and make the whole thing work on mobile.

I can select IDs and use those to easy swap in values where needed for now.

`git commit -am "Contrast interactives working"`
