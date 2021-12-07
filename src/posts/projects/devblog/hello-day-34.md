---
title: Hello World Devblog - Pt. 34
description: "More devblog"
project: Dev Blog
date: 2021-11-12 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - WiP
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

Ok, took some real vacation time, so on the flight back and back to work on trying to build my own markdown-it plugin.

### Modifying the Markdown-It Plugin

Ok, dealing with some errors when it does processing. But I made a good choice this time before getting on the flight, I loaded up the documentation page on Markdown-It. The problem is I needed to give my rule a unique (non-overlapping name with the to-do rule).

Changed it to `md.core.ruler.after("inline", "short-phrase-fixer", (state) => {` and now the plugin isn't crashing the build process!

But it isn't doing what I want either.

Ok, it's advancing to the point in the while loop where it is executing my function. That's good, it means my check to find valid language to replace `isMyWords` is working properly I think.

Ah, ok, it looks like I am absolutely required to change the content of both the token and it's first child. Interesting, I'm not sure why Markdown-it works that way, but good to know. Ok, basic functionality is working! Looks like this now:

```javascript

const isInline = (token) => token && token.type === "inline";
const isParagraph = (token) => token && token.type === "paragraph_open";
const hasMyWords = (token) => token && / 11ty | prob /.test(token.content);

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
	} else {
		return { betterWord: false, wordChoice: false };
	}

	return { betterWord, wordChoice };
}

function fixWordify(token, TokenConstructor) {
	const { betterWord, wordChoice } = fixMyWords(token, TokenConstructor);
	if (!betterWord) return false;
	token.content = token.content.replace(wordChoice, betterWord.content);
	const fixedContent = new TokenConstructor("inline", "", 0);
	fixedContent.content = token.content;
	token.children[0].content = fixedContent.content;
	console.log("token:", token);
}

module.exports = (md) => {
	md.core.ruler.after("inline", "short-phrase-fixer", (state) => {
		const tokens = state.tokens;
		console.log(
			"Walking through possible words to fix3",
			state.tokens.filter((token) => token.type === "text")
		);
		for (let i = 0; i < tokens.length; i++) {
			if ((tokens, isMyWords(tokens, i))) {
				console.log("Trying to fix some words!");
				fixWordify(tokens[i], state.Token);
				setAttr(tokens[i - 1], "data-wordfix", "true");
			}
		}
	});
};
```

But what if more than one word that I need to correct is in the paragraph? I'll need to set it up to run more than once on any piece of content, or do a smarter replace process.

### Better replacement of words

So what if I want to use both `prob` and `11ty` in a sentence or if I want to use `11ty` twice? I need to set it up so I can use both.

Ok, so my instinct here is to set up a set of patterns and their replacements than walk through it. Only, I'm getting an error `token.content.replaceAll is not a function`. Ok, is this applying to everything or is there some weird edge case?

I'm going to try this for the new `fixWordify` setup.

```javascript
const replaceMe = [
		{ pattern: / 11ty /, replace: " Eleventy " },
		{ pattern: / prob /, replace: " probably " },
		{ pattern: / graf /, replace: " paragraph " },
	];
	try {
		replaceMe.forEach((wordReplace) => {
			const betterWord = new TokenConstructor("inline", "", 0);
			betterWord.content = token.content.replaceAll(
				wordReplace.pattern,
				wordReplace.replace
			);
			token.content = betterWord.content;
			token.children[0].content = betterWord.content;
			console.log("token:", token);
		});
	} catch (e) {
		console.log("Could not replace content in token: ", token);
		console.log(e);
	}
```

Ok, now build continues, but notably the replacements don't seem to be happening. So it looks like it is breaking every time. Some of the tokens are indeed very complex like:

#### A More Complex Markdown-It Token

```javascript
Token {
  type: 'inline',
  tag: '',
  attrs: null,
  map: [ 82, 83 ],
  nesting: 0,
  level: 1,
  children: [
    Token {
      type: 'text',
      tag: '',
      attrs: null,
      map: null,
      nesting: 0,
      level: 0,
      children: null,
      content: "First of all, I want a chunk of that page that shows my various Work in Progress posts. I've tagged the posts themselves correctly ",
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    Token {
      type: 'link_open',
      tag: 'a',
      attrs: [Array],
      map: null,
      nesting: 1,
      level: 0,
      children: null,
      content: '',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    Token {
      type: 'text',
      tag: '',
      attrs: null,
      map: null,
      nesting: 0,
      level: 1,
      children: null,
      content: 'to create an 11ty collection',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    Token {
      type: 'link_close',
      tag: 'a',
      attrs: null,
      map: null,
      nesting: -1,
      level: 0,
      children: null,
      content: '',
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    },
    Token {
      type: 'text',
      tag: '',
      attrs: null,
      map: null,
      nesting: 0,
      level: 0,
      children: null,
      content: ", but I need to figure out how to call it. And I may want to display it elsewhere, so I'm going to create a component I can easily include that walks through the WiP tag.",
      markup: '',
      info: '',
      meta: null,
      block: false,
      hidden: false
    }
  ],
  content: "First of all, I want a chunk of that page that shows my various Work in Progress posts. I've tagged the posts themselves correctly [to create an 11ty collection](https://www.11ty.dev/docs/collections/), but I need to figure out how to call it. And I may want to display it elsewhere, so I'm going to create a component I can easily include that walks through the WiP tag.",
  markup: '',
  info: '',
  meta: null,
  block: true,
  hidden: false
}
```

But some are simple. And they all have content I can replace.

Ok, let's add more detail to the log.

```javascript
		console.log(
			"Could not replace content in token: ",
			token.content,
			token.children[0].content,
			token
		);
```

I'm still not seeing what could go wrong. These things are strings and should have `replaceAll`? I double checked and indeed, `replace` works just fine. I guess we can just use `replace` if I have the right configuration for the regex, ending it with `/gi`.

Ok, that's working! Now let's remove my potential future human error opportunity by keeping the patterns I'm walking through in a single place:

```javascript
const myWords = () => {
	return [
		{ pattern: / 11ty /gi, replace: " Eleventy " },
		{ pattern: / prob /gi, replace: " probably " },
		{ pattern: / graf /gi, replace: " paragraph " },
	];
};
```

and now my check is a little more complex:

```javascript
const hasMyWords = (token) => {
	if (token) {
		// myWords().forEach((word) => {
		for (let i = 0; i < myWords().length; i++) {
			if (myWords()[i].pattern.test(token.content)) {
				console.log("Word Replacement Time");
				return true;
			}
		}
	}
	return false;
};
```

Ok. Looking good. But it turns out this method doesn't handle the more complicated objects like the one above, instead of expecting only one child, we'll need to walk through all the children and do their replacements individually.

### Handle each token child

Ok, let's turn the `token.content` process into its own function I can use during the interation of token children:

```javascript
function fixMyWords(wordReplace, token, TokenConstructor) {
	const betterWord = new TokenConstructor("inline", "", 0);
	const replaced = token.content.replace(
		wordReplace.pattern,
		wordReplace.replace
	);
	if (replaced) {
		betterWord.content = replaced;
		token.content = betterWord.content;
	}
}
```

Now we can use a simpler version of `replaceMe` that works with walking over the children!

```javascript
replaceMe.forEach((wordReplace) => {
	fixMyWords(wordReplace, token, TokenConstructor);
	for (let i = 0; i < token.children.length; i++) {
		fixMyWords(wordReplace, token.children[i], TokenConstructor);
	}
})
```

That works!

Last thing I want to do... make sure this works if one of my replacement words is at the end of a sentence or has a comma after it and still needs to be replaced. I forgot about this case.

`git commit -am "Get replacement working with complex tokens"`

### Replacing the word with punctuation

This one should be pretty easy, I just need to add a look ahead for a variety of eligible punctuation. `(?=[\?\.\,\s\! ])` should do it.

Now the `myWords` function looks like this:

```javascript
const myWords = () => {
	return [
		{ pattern: / 11ty(?=[\?\.\,\s\! ])/gi, replace: " Eleventy" },
		{ pattern: / prob(?=[\?\.\,\s\! ])/gi, replace: " probably" },
		{ pattern: / graf(?=[\?\.\,\s\! ])/gi, replace: " paragraph" },
	];
};
```

I specifically don't want to include quotes in this But what about parenthesis? It looks like `Markdown-It` does indeed break out the chunks of text in such a way that I don't have to worry about breaking Markdown links. Should be easy enough. Just need a lookbehind. Also, I can add in new lines or tabs as characters as well.

Now it looks like this:

```javascript
const myWords = () => {
	return [
		{
			pattern: /(?<=[\t\s\S\( ])11ty(?=[\?\.\,\s\r\n\!\) ])/gi,
			replace: "Eleventy",
		},
		{
			pattern: /(?<=[\t\s\( ])prob(?=[\?\.\,\s\r\n\!\) ])/gi,
			replace: "probably",
		},
		{
			pattern: /(?<=[\t\s\( ])graf(?=[\?\.\,\s\r\n\!\) ])/gi,
			replace: "paragraph",
		},
	];
};
```

Looking good! I can test and add more words later, landing now.

- [x] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

`git commit -am "Finish day 34"`

## A few notes on touch up

Just noting on here that I touched up the above Regex which had a few bad errors I didn't want anyone to repeat. Most importantly, I removed my use of `\S`.

`git commit -am "Touch up day 34 stuff"`
