---
title: "Part 33: Markdown It Playtime and CSS Touchups"
description: "More devblog"
project: Dev Blog
date: 2021-11-12 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - WiP
  - Nunjucks
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

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [ ] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

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

## Day 33

Ok, got some plane time today. Let's see how far I can get without connecting to the internet.

### Syntax highlighting for NJK snippets.

I think I want to try to take on some of the hacking I need to do to the markdown parser. This is a good time to work at it a little and see what I can get it to do.

First, I've noticed that there isn't really a syntax highlight for Nunjucks in the Prism system I'm using for code hints. I've been building the code blocks using Liquid instead since they are basically the same. But it would be nice to use the correct naming convention. I think I should be able to? I copied the extension for how Prism handles Markdown from the Eleventy site. Can I do something similar here? Let's try.

#### Extending Liquid

New statement adding in Prism for code highlighting like this.

```javascript
	eleventyConfig.addPlugin(syntaxHighlight, {
		templateFormats: ["md", "njk"],
		init: function ({ Prism }) {
			Prism.languages.markdown = Prism.languages.extend("markup", {
				frontmatter: {
					pattern: /^---[\s\S]*?^---$/m,
					greedy: true,
					inside: Prism.languages.yaml,
				},
			});
			console.log(Prism.languages);
			Prism.languages.njk = Prism.languages.extend("liquid", {});
		},
	});
```

Ok, it didn't throw an error. Let's see what we can do? I added the console.log because I'm curious about what other languages are in there and interestingly it appears that maybe I don't need to have this language extension? I see a bunch of good looking rules in there under `md`. Something to try later.

Hmm I changed the log to only throw up the keys and the list is more limited than I thought.

```javascript
[
  'extend', 'insertBefore',
  'DFS',    'markup',
  'html',   'mathml',
  'svg',    'xml',
  'ssml',   'atom',
  'rss',    'css',
  'clike',  'javascript',
  'js',     'yaml',
  'yml',    'markdown'
]
```

So I guess using `liquid` was doing me no favors either. Annoying. I guess HTML is likely the way I want to go then?

#### Extending HTML

Hmmm extending HTML for liquid/njk is doing me no favors. It's too bad that the handlebars-style syntax is not more JS like because I could likely use a pattern to make it easier to read. Worth a try at least?

```javascript
			Prism.languages.liquid = Prism.languages.extend("html", {
				templateTag: {
					pattern: /(?<=\{\%).*?(?=\%\})/g,
					greedy: true,
					inside: Prism.languages.javascript,
				},
			});
			Prism.languages.njk = Prism.languages.extend("liquid", {});
```

Ok this is looking much better, though I'd like to have some color on the opening and closing brackets.

```javascript
			Prism.languages.liquid = Prism.languages.extend("html", {
				templateTag: {
					pattern: /(?<=\{\%).*?(?=\%\})/g,
					greedy: true,
					inside: Prism.languages.javascript,
				},
				templateTagBoundary: {
					pattern: /\{\%}?|\%\}?/g,
					greedy: false,
					alias: "template-tag-boundary",
				},
			});
```

#### CSS Touchup for new Code Blocks

Ok by adding the pattern to capture the tag boundaries I've now wrapped every template tag opener and closer in `<span>` tags with the class set to `token templateTagBoundary template-tag-boundary`. Perfect. So now I just have to add the style I want. And you know what, while I'm in there I might touch up a few more styles.

```sass
.template-tag-boundary {
	color: #ec4984;
}

.tag > .tag > .punctuation,
.tag > .punctuation:last-of-type {
	color: #1cf08d;
}
```

Ok, adding this to my syntax highlighting sheet means things are starting to look good. Great this is really great. I think I'm pretty satisfied with the code styling for now. Regex is always a mind-bender but I'm definitely getting better at it. I'd like to make the code blocks a little more readable. Let's start by giving them 100% width to fill to the width of the parent container.

Oh, this [overscroll behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior.html) looks useful. Maybe I'll add that, even if it isn't widely supported. Using `overscroll-behavior-x: contain` will hopefully at least prevent some of the browsers from bouncing when the user overscrolls on the `pre` elements on mobile.

I'm also going to shrink the size a bit, make it so that more fits into the pre box on smaller screens.

All together I think that should help make the code samples a little more readable on mobile.

`git commit -am "Touching up syntax highlighting"`

### Touching up Table of Contents

Hmmm, while I was in here touching up the CSS I was not happy with some of the behavior of the table of contents. It really needs a *lot* of vertical space. But why not support big screens when they are available? A few small touch ups and I can make my site a little easier to navigate on larger screens.

Let's add a size to my variables Sass for the minimum width I'll need to fit everything in: `$ultra-large: 1336px` and now I'll want to cover ultra long TOCs, just in case:

```sass
#toc-container__inner
    @media (min-width: variables.$large-mobile) and (min-height: 962px)
        overflow-y: auto
        max-height: 225px
    @media (min-width: variables.$ultra-large)
        overflow-y: auto
        max-height: 80%
```

And then I can fix the unit itself to the side of the content.

```sass
@media (min-width: variables.$ultra-large)
    position: fixed
    top: 10px
    left: 1005px
    width: 295px
```

Perfect and I put it below the left sidebar, so it'll prefer this new layout if the screen is large enough, even if there is enough height available on the screen.

`git commit -am "Fix up TOC for ultra wide screens"`

### Continuing to muck with Markdown It

Ok, now that I've got a lot of big stuff out of the way I'd really like to see if I can load in my own Markdown-It plugin. I've still not connected to the internet, so let's examine one of the simple plugins I've got in my `node_modules` to see if I can learn something from that. I'll try `markdown-it-todo` as it seems closest to some of the stuff I want to do.

Ok, promising choice! The code totals 68 lines.

I'm going to start real simple. I want to turn `11ty` into `Eleventy`. I can see I was working on this before. So let's put 11ty into this blog post.

I'm actually currious, before I dive too deep into it, why the `markdown-it-regexp` library wasn't working when I tried it before. It looks like it is making some weird assumptions about what my regex should be, so I'm going to copy it local and see what happens if I change it a bit.

Ok, I fiddled with it and you know what? There is a lot of broken stuff. I'm not sure how it ever worked. I don't even see how it hooks into Markdown-it? Baffling. I'm going to drop it for real now I think it is too broken to save.

Ok, I'm sort of working blind from the example of the todo plugin but I've tried both that and a version of my previous work for creating `_blank` on links and neither are working.

```js
"use strict";

/**
const Plugin = require("../markdown-it-regexp");

module.exports = Plugin(/s11tys/g, (match, utils) => {
	console.log("Markdown It shorthand match", match);
	return String(` Eleventy `);
});
 */

const isInline = (token) => token && token.type === "inline";
const isParagraph = (token) => token && token.type === "paragraph_open";
const hasMyWords = (token) =>
	token && /^\[( 11ty | prob )]/.test(token.content);

function setAttr(token, name, value) {
	const index = token.attrIndex(name);
	const attr = [name, value];

	if (index < 0) {
		token.attrPush(attr);
	} else {
		token.attrs[index] = attr;
	}
}

function isMyWords(tokens, index) {
	return (
		isInline(tokens[index]) &&
		// isParagraph(tokens[index - 1]) &&
		hasMyWords(tokens[index])
	);
}

function fixMyWords(token, TokenConstructor) {
	let wordChoice = "";
	const betterWord = new TokenConstructor("inline", "", 0);
	if (/ 11ty /.test(token.content)) {
		betterWord.content = " Eleventy ";
		wordChoice = " 11ty ";
	} else if (/ prob /.test(token.content)) {
		betterWord.content = " probably ";
		wordChoice = " prob ";
	}

	return { betterWord, wordChoice };
}

function fixWordify(token, TokenConstructor) {
	const { betterWord, wordChoice } = fixMyWords(token, TokenConstructor);
	token.children.unshift(betterWord);

	const sliceIndex = wordChoice.length;
	token.content = token.content.slice(sliceIndex);
	token.children[1].content = token.children[1].content.slice(sliceIndex);
}

module.exports = (md) => {
	md.core.ruler.after("inline", "evernote-todo", (state) => {
		const tokens = state.tokens;
		console.log("Walking through possible words to fix2");
		for (let i = 0; i < tokens.length; i++) {
			if (isMyWords(tokens, i)) {
				console.log("Trying to fix some words!");
				fixMyWords(tokens[i], state.Token);
				setAttr(tokens[i - 1], "data-wordfix", "true");
			}
		}
	});
};

/**
module.exports = (markdownSetup) => {
	var defaultRender =
		markdownSetup.renderer.rules.fix_my_words ||
		function (tokens, idx, options, env, self) {
			return self.renderToken(tokens, idx, options);
		};
	markdownSetup.renderer.rules.fix_my_words = function (
		tokens,
		idx,
		options,
		env,
		self
	) {
		for (let i = 0; i < tokens.length; i++) {
			if (isMyWords(tokens, i)) {
				console.log("Trying to fix some words!");
				fixWordify(tokens[i], tokens);
				setAttr(tokens[i - 1], "data-wordfix", "true");
			}
		}

		// pass token to default renderer.
		return defaultRender(tokens, idx, options, env, self);
	};
};
*/
```

I'm not even sure it is scanning the right stuff?! Time to do some logging.

It's especially annoying to test because I can't use 11ty watch to reload the plugin and have it work consistently.

Ok so... `inline` is not the token type I need to target, it's just showing my little one-line code samples

Ok. It doesn't seem to be `inline` but I'm not sure what `paragraph_open` is and removing it has the plugin adding the ` "data-wordfix"` property to the `p` tags properly. So progress!

Oops, I need to use `fixWordify`!

Ok, the todo plugin is just cutting the first few characters off the string. That's fine for it I guess, but I'm operating on the middle of the string. It looks like I may need to (from the code they have) change the content of both the `token.content` value and the `token.children[1].content` value? (Presumably because it `unshift`s the new token in to the beginning of that array, for some reason?) Well let's take it once at a time.

Hmmm, still no good. But I think I'm getting closer. Ok backs straight, tables in the upright position time.

`git commit -am "Save day 33"`
