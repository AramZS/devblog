---
title: Hello World Devblog - Pt. 39
description: "More devblog"
project: Dev Blog
date: 2021-11-25 22:59:43.10 -4
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

## Day 39

Look at this! Every checkmark I want to check off is checked off! Now all I have left to do is close off the last few things that are broken!

### Fix anchors

My anchor link generator is being broken by double-quote marks.

I'll change the configuration for `markdown-it-anchor` as follows:

```javascript
.use(require("markdown-it-anchor"), {
			slugify: (s) => slugify(s.toLowerCase().replace(/"/g, "")),
		})
```

And yeah, that works!

### Making Code Blocks More Readable

So I'm going to make a few changes to the codeblocks in general here to make them more consumable.

First, it looks like the wisdom of the crowds is leaning towards wrapping code lines. So I'm going to add some CSSto do that:

```css
code[class*="language-"], pre[class*="language-"] {
	white-space:pre-wrap;
}
```

Next, I use 4-space tabs and that can make my code blocks pretty roomy. Let's resize those tabs by adding a new property to the same css rule. Instead I can shrink it down to `1em` with `tab-size: 1em;`. This won't change spaces in codeblocks like YAML, but it helps with most of the rest I think.

There's one problem that I don't think I can solve with CSS? Some of my early code blocks take the tab level of their files so they have a bunch of extra tabs that aren't needed and make them less readable. Is there a way to fix this? I can't think of one, so I'll just try and remember to collapse my code blocks to start at zero tabs.

Finally, for the very long code blocks, they *badly* need skip links, both for accessibility and good UI reasons.

I guess... this needs to be another markdown-it plugin? That is where the code-blocks are made. Ok!

`git commit -am "Fix some basic readability issues"`

### Add skip links to code blocks

Ok, I'm not going to make the same mistake I did before of starting in my `.eleventy` file. Let's open up a new custom plugin folder.

Now, because of my investigation on [Day 36](https://fightwithtools.dev/posts/projects/devblog/hello-day-36/) I know that there is a `code_block` rule that is absolutely the one I'm going to need to deal with. And, because I need to manipulate the token tree *around* the code block, I know that I'm going to have to use `ruler` and not `renderer`.

Ok, so first I'm going to figure out what token types exist:

```javascript
console.log('Token Types', state.tokens.reduce((prevV, currV) => {
	return prevV.add(currV.type)
},new Set()))
```

Result:

```javascript
[
  'ordered_list_open',
  'list_item_open',
  'paragraph_open',
  'inline',
  'paragraph_close',
  'list_item_close',
  'ordered_list_close',
  'bullet_list_open',
  'bullet_list_close',
  'html_block',
  'heading_open',
  'heading_close',
  'blockquote_open',
  'blockquote_close',
  'fence'
]
```

Ok, so nothing clearly shows my codeblocks. So, let's try a different strategy. What about looking for my markdown codeblock indicator the three backticks?

```javascript
for (let i = 0; i < tokens.length; i++) {
	if (/```/.test(tokens[i].content)){
		console.log(tokens[i])
	}
}
```

Nope...

Ok, let's look for `<code>`?

```javascript
for (let i = 0; i < tokens.length; i++) {
	if (/\<code\>/.test(tokens[i].content)){
		console.log(tokens[i])
	}
}
```

Ok, that sort of worked! This is good!

```javascript
Token {
  type: 'fence',
  tag: 'code',
  attrs: null,
  map: [ 161, 168 ],
  nesting: 0,
  level: 0,
  children: null,
  content: 'for (let i = 0; i < tokens.length; i++) {\n' +
    '\tif (/```/.test(tokens[i].content)){\n' +
    '\t\tconsole.log(tokens[i])\n' +
    '\t}\n' +
    '}\n',
  markup: '```',
  info: 'javascript',
  meta: null,
  block: true,
  hidden: false
}
```

Interesting. Maybe this could eventually be a way to fix some of the bad tabbing? I think this is a little out of scope, so I'll put that aside for now. This is a good place to start!

What does this token tree look like? Maybe I can look around it.

```javascript
for (let i = 0; i < tokens.length; i++) {
	if (tokens[i].type == "fence" && tokens[i].tag == "code"){
		console.log(tokens[i-1], tokens[i], tokens[i+1])
	}
}
```

Ok, I guess there isn't anything relevant? All are surrounded by `paragraph_close` and `paragraph_open`. So I'll need to construct the skip links around the token basically from scratch. Likely I'll need to create new paragraphs?

Though to make the skip link work effectively I think I'll need to add an ID to the following `paragraph_open` token that looks like this:

```javascript
Token {
  type: 'paragraph_open',
  tag: 'p',
  attrs: [ [ 'data-wordfix', 'true' ] ],
  map: [ 113, 114 ],
  nesting: 1,
  level: 0,
  children: null,
  content: '',
  markup: '',
  info: '',
  meta: null,
  block: true,
  hidden: false
}
```

`git commit -am "Saving part way through day 39"`

I'll also need some way to name the skip links. I've been thinking about this and I think I should be able to just increment a count on `state.env` since Markdown It processing occurs synchronously, right? I can pull the `fileSlug` off the page object just to be sure the anchor links are unique enough.

Ok, so I'm going to create the skip link name:

```javascript
if (!env.state.page.hasOwnProperty('skipCount')){
	env.state.page.skipCount = 0;
}
const skipCount = env.state.page.skipCount + 1
env.state.page.skipCount = skipCount;
const skipName = `code-skip-${skipCount}`
```

And I'm going to apply the skip name to the following paragraph. But, what if the next block isn't a paragraph? I guess we got to check for that.

```javascript
const foundGraf = false
let nextI = 0;
while (!foundGraf) {
	if (tokens[i+(++nextI)].type === "paragraph_open"){
		foundGraf = true;
		break;
	}
}
```

Ok, didn't quite work. I guess there could be an end of the article or a non-paragraph token? Let's take that into account.

```javascript
while (!foundGraf) {
	if (tokens[i+(++nextI)] && tokens[i+nextI].hasOwnProperty('type') && tokens[i+nextI].type === "paragraph_open"){
		foundGraf = true;
		addSkipGrafID(tokens[i+nextI], skipName)
		break;
	} else if (!tokens[i+nextI]){
		// do something
		// I guess we're at the end?
		foundGraf = true;
		break
	}
}
```



Ok so this applies the needed ID! I now need to build the paragraph block above the code block and place te skip link. Good to refer to [the complex Markdown It chain I recorded on Day 34](https://fightwithtools.dev/posts/projects/devblog/hello-day-34/#a-more-complex-markdown-it-token).

I'm really unclear how the nesting property is supposed to work? I guess we will just try it and see!

```javascript
const createSkipLink = (TokenConstructor, skipName) => {
	const p_open = new TokenConstructor("paragraph_open", "p", 1);
	setAttr(p_open, "class", "skip-link-graf");
	p_open.children = []
	const link_open = new TokenConstructor("link_open", "a", 2);
	setAttr(link_open, "href", `#${skipName}`);
	setAttr(link_open, "id", `skip-to-${skipName}`);
	setAttr(link_open, "class", "skip-link");
	p_open.children.push(link_open);
	const link_text = new TokenConstructor("text", "", 3);
	link_text.content = "Skip code block &#9660;"
	p_open.children.push(link_text);
	const link_close = new TokenConstructor("link_close", "a", 2);
	p_open.children.push(link_close);
	const p_close = new TokenConstructor("paragraph_close", "p", -1);
	return { p_open, p_close };
};
```

Once I have my tokens, I can splce them into the token tree!

```javascript
console.log('Create skip link')
const { p_open, p_close } = createSkipLink(state.Token, skipName)
tokens.splice(i, 0, p_close)
tokens.splice(i, 0, p_open)
```

Ok, apparently doing this drives the build process into an infinite loop? That's not great. What do I do now?

Ok, found the nesting info:

> Level change (number in {-1, 0, 1} set), where:
> - 1 means the tag is opening
> - 0 means the tag is self-closing
> - -1 means the tag is closing

Got it. Well, fixing that doesn't seem to have fixed anything, still looping.

Let's [read some docs I guess](https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md)!

Well [it looks like](https://markdown-it.github.io/) I'm not supposed to put children on the paragraph token. In fact, it looks like it is supposed to be flat.

Ok tried:

```javascript
const createSkipLink = (TokenConstructor, skipName) => {
	const p_open = new TokenConstructor("paragraph_open", "p", 1);
	setAttr(p_open, "class", "skip-link-graf");
	p_open.level = 0
	// p_open.children = []
	const link_open = new TokenConstructor("link_open", "a", 1);
	setAttr(link_open, "href", `#${skipName}`);
	setAttr(link_open, "id", `skip-to-${skipName}`);
	setAttr(link_open, "class", "skip-link");
	link_open.level = 1
	// p_open.children.push(link_open);
	const link_text = new TokenConstructor("text", "", 0);
	link_text.content = "Skip code block &#9660;"
	link_text.level = 2
	// p_open.children.push(link_text);
	const link_close = new TokenConstructor("link_close", "a", -1);
	link_close.level = 1
	// p_open.children.push(link_close);
	const p_close = new TokenConstructor("paragraph_close", "p", -1);
	return { p_open, link_open, link_text, link_close, p_close };
};
```

Still looping.

Ok, it is not my token making process, it's what happens when I splice the tokens into the chain.

Ok... so how *do* I add new tokens?

Ok, did some searching and [maybe there are functions to handle this](https://docs.joshuatz.com/cheatsheets/node-and-npm/markdown-it/) on the `state` object?

Let's see what keys are available on the `state` object.

```javascript
[ 'src', 'env', 'tokens', 'inlineMode', 'md' ]
```

Ok, not useful.

Ok, maybe it is an issue with a particular token? My approach [looks](https://github.com/valeriangalliat/markdown-it-anchor/issues/100) like it should work. Let's see what we can add without the loop happening.

Oh, duh, ok the for loop is hitting the same item over and over again as new items are added above it. I'm dumb. I can [take the approach from the linkify plugin](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js#L39) and just reverse it.

Oh, only now my little renderer hack for adding `_blank` targets to all the links is adding targets to the skip links which is bad. I can use the `meta` property of the tokens to note that these links are skip links and they should not be treated to `_blank` targeting.

Ok, looking good. It's working!

`git commit -am "Adding skip links to code blocks"`

Ok. So now I just need to give it some better styling!

Looking good enough for now! I may want to play with it a bit but this looks like a good place to stop.

`git commit -am "Finish day 39"`
