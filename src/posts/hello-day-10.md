---
title: Hello World Devblog - Pt. 10
subtitle: Getting this dev blog running
description: Part 8 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-07-04 22:59:43.10 -4
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

- [ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

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

## Day 10

Ok, when we left off I had totally failed to build a macro in Nunjucks.

Ok, I forgot to change the argument that was passed in the macros file and when I did that it worked.

So... progress!

Now let's try and figure out how to make it more useful.

There are some interesting things you can do with Macros! I really would like to get it to work, so before we go the filter route, let's see if we can make my intended methodology work. This seems like it would be a thing people would want to do! So some more web searching may be in order.

Ok, after trying a few different search terms [I've found a useful middle ground](https://stackoverflow.com/questions/50685814/nunjucks-nested-variables). But I know that [Nunjucks applies filters in a specific way in 11ty](https://www.11ty.dev/docs/languages/nunjucks/#filters).

Hmmm, apparently part of the issue [is that Nunjucks fails silently on rendering stuff](https://github.com/11ty/eleventy/issues/354#issuecomment-449904901). Is there a way to turn it off? Looks like first [I'll have to redefine the Nunjucks rendering environment](https://www.11ty.dev/docs/languages/nunjucks/#optional-use-your-nunjucks-environment).

The Nunjucks page on 11ty suggests we pass in the `_includes` folder name as a string: `new Nunjucks.FileSystemLoader("_includes")`. But that's an extra instance of that string to keep track of. Better to use my 11ty config object instead. I also want to switch `throwOnUndefined` to `true`, but only in the local environment. Another good use for `process.env.DOMAIN`.

Now at the top of my `.eleventy.js` file I have

```javascript
let domain_name = "https://fightwithtools.dev";
let throwOnUndefinedSetting = false;

if (process.env.IS_LOCAL) {
	domain_name = "http://localhost:8080";
	throwOnUndefinedSetting = true;
}
```

And I have a new section that sets up my own Nunjucks filter:

{% raw %}
```javascript
	let nunjucksEnvironment = new Nunjucks.Environment(
		new Nunjucks.FileSystemLoader(siteConfiguration.dir.includes,
		{
			throwOnUndefined: throwOnUndefinedSetting
		}
	));
	eleventyConfig.setLibrary("njk", nunjucksEnvironment);
```
{% endraw %}

Ok... interesting... when I set it up, it no longer reads the include statement properly, which calls a template located in `src/_layouts` and passed into the configuration object to 11ty as `dir.layouts`:

{% raw %}
`{% extends "base.njk" %}`
{% endraw %}

Hmmmm. Well [let's take a look at how 11ty configures it](https://github.com/11ty/eleventy/blob/master/src/Engines/Nunjucks.js#L124).

```javascript
	const normalize = require("normalize-path");

	...

	const pathNormalizer = function(pathString){
		return normalize(path.normalize(path.resolve(".")))
	}

	let nunjucksEnvironment = new Nunjucks.Environment(
		new Nunjucks.FileSystemLoader([
			pathNormalizer(siteConfiguration.dir.includes),
			pathNormalizer(siteConfiguration.dir.layouts),
			pathNormalizer(".")
		]),
		{
			throwOnUndefined: throwOnUndefinedSetting
		}
	);
	eleventyConfig.setLibrary("njk", nunjucksEnvironment);
```

Well, [it looks like 11ty does more to configure the Nunjucks rendering engine than I thought](https://github.com/11ty/eleventy/blob/master/src/Engines/Nunjucks.js#L124). Let's see if I can try to duplicate how the core 11ty approach does it.

Hmmm, pulled the same configuration, but now it looks like one of my posts isn't working. It looks like Nunjucks is adding some secret juice to the `raw` tag for escaping stuff. Hmmm, ok, there is a lot of badly documented stuff that 11ty is doing with the Nunjucks engine and modifying it. Perhaps it is time to step back from attempting to mod it and take a different approach.

Maybe I should go for the custom filter method instead. Let's step back.

`git commit -am "Trying to get variable variables working and 11ty to set throwOnUndefined for nunjucks"`
