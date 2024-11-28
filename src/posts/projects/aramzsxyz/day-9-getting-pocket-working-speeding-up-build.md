---
title: XYZ Site - Day 7 - Next step to rebuild Pocket exporting.
description: "Previously I had exported a nice simple JSON file I could turn into files, but that site broke, so trying Readwise instead"
date: 2024-11-27 17:59:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - CSV
  - CSVs
  - async
  - JSON
  - Pocket
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
- [ ] Minify HTML via Netlify plugin.

## Day 9

I'm trying to speed up the build time. It turns out that this many files is causing the memory in my Netlify build is causing the process to use up too much memory. So a few hacks to get in place.

`filter` is too expensive for arrays from everything I've read so I'm going to try and replace it with a `for` I pulled off a blogpost.

```js

/**
@func util
a custom high-performance filter
via https://dev.to/functional_js/write-a-custom-javascript-filter-function-that-is-60-faster-than-array-filter-4b66
@perf
60% faster than the built-in JavaScript filter func
@typedef {(e: *) => boolean} filterFnAny
@param {filterFnAny} fn
@param {*[]} a
@return {*[]}
*/
const betterFilter = (fn, a) => {
  const f = []; //final
  for (let i = 0; i < a.length; i++) {
    if (fn(a[i])) {
      f.push(a[i]);
    }
  }
  return f;
};
```

There are a few places the filters for Nunjucks are using that `filter`, so I'll replace them.

I can also exclude `amplify` contentType posts from a number of places where it is building big objects up. Discarding them and doing it early in those processes should mean the build will take up less memory and go faster.

This is helping drop some of the build time, but it is still expensive.

My last build gave me this info:

```bash
[11ty] Benchmark  16412ms  15% 12166× (Configuration) "excludeStubs" Nunjucks Filter
[11ty] Benchmark  35852ms  33% 36435× (Configuration) "countByKey" Nunjucks Filter
[11ty] Benchmark  13719ms  13% 12168× (Configuration) "identifyGlyphs" Transform
```

Big build functions. Let's see if I can accelerate further.

I'm going to try and use `"@11ty/eleventy-plugin-directory-output"` to give me some ideas of where I can decrease CPU and memory usage as well.

I've managed to improve some of these, but they're still expensive, especially when run so many times. `countByKey` is part of the menu build, so especially expensive.

I also want to try and remove the HTML minify process to Netlify, but the plugin they have for that doesn't seem to work, prob because it is so out of date. I'm going to [subtree](https://www.atlassian.com/git/tutorials/git-subtree) it in and run it internally.

`git commit -am "Moving html minification to a netlify function"`

Let's try and run this on Netlify to see if my switchover works!

Huh, apparently in order to run Netlify [plugins](https://docs.netlify.com/build-plugins/) that are local to the project I need to add a plugin:

```yaml
[[plugins]]
package = "@netlify/plugin-local-install-core"
```

This gets it running, but it doesn't seem to actually minify the HTML, no matter [what options](http://perfectionkills.com/experimenting-with-html-minifier/) I put in! Ugh. Maybe I'll leave that alone for now to fiddle with later. [Looks like there is info about how to test it here](https://docs.netlify.com/cli/get-started/#run-builds-locally).

I'm also looking at how to fix it so it isn't spending time building the sub-css files that are prefixed with `_`, which it seems to be doing.

Is there really no way to get postcss not to waste time on the included files? It seems very strange to me.

Ok, I looked around and [found](https://github.com/11ty/eleventy/discussions/2388) a way that speeds things up significantly. I can add it [as a template format](https://www.11ty.dev/docs/languages/custom/) and then manage it with an extension.

I can manage it in an extensions file.

```js
const cssHandler = {
  outputFileExtension: 'css',
  compile: async (inputContent, inputPath) => {
    if (inputPath !== './src/styles/main.css') {
      return;
    }

    return async () => {
      const postcss = require('postcss');
      // https://github.com/postcss/postcss-load-config
      const postcssrc = require('postcss-load-config');
      console.log('postcssrc', postcssrc);
      // https://github.com/11ty/eleventy/discussions/2388
      let cssPromise = new Promise((resolve, reject) => {
        postcssrc().then(({ plugins, options }) => {
          console.log('pcss plugins', plugins);
          options.from = inputPath;
          console.log('pcss options', options);
          postcss(plugins)
            .process(inputContent, options)
            .then((result) => {
              resolve(result.css)
            })
        })
      });
      const cssResult = await cssPromise;
      // console.log('cssResult', cssResult);
      // debugger;
      return cssResult;

      let output = await postcss([
        pimport,
        autoprefixer,
        csso
      ]).process(inputContent, { from: inputPath });
    }
  }
};


module.exports = {
  css: cssHandler
}
```

which I can then load like this in my eleventy config file:

```js
  eleventyConfig.addTemplateFormats('css');

  Object.keys(extensions).forEach((extensionName) => {
		eleventyConfig.addExtension(extensionName, extensions[extensionName]);
	});
```

I added the use of `'postcss-load-config'` here to let me manage postcss settings and plugins from a file at `postcss.config.js`.

In case you are wondering, the logging looks like this:

```bash
postcssrc [Function: rc]
pcss plugins [
  [Function: AtImport] { postcss: true },
  [Function: plugin] {
    postcss: true,
    data: { browsers: [Object], prefixes: [Object] },
    defaults: [ '> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead' ],
    info: [Function (anonymous)]
  },
  { postcssPlugin: 'postcss-purgecss', OnceExit: [Function: OnceExit] },
  [Function (anonymous)] { postcss: true }
]
pcss options {
  configLocation: './postcss.config.js',
  cwd: '/Users/chrono/Dev/aramzs.xyz',
  env: undefined,
  from: './src/styles/main.css'
}
```

Looks like the `options` we get out of that tool is just everything supplied in the export of the file that isn't on the `plugins` property.

Ok, that works *much* faster. Mostly because it only has to process the `main.css` file and not build the others.

`git commit -m "Move postcss processing internal to the template format flow of eleventy"`

I can also remove invocations of my most expensive functions from the pages that forward users where the users will never see the menu that triggers them.

`git commit -am "Remove the invocations of the counting function from pages that no user is likely to see because they mostly are forwarding people"`

