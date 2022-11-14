---
title: Context Center Timelines - Day 13 - Generate Timeline Item Image
description: "Getting a preview image auto-generated."
date: 2022-11-13 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
  - JS
  - Images
  - SMO
  - Puppeteer
---

## Project Scope and ToDos

1. Create timeline pages where one can see the whole timeline of a particular event
2. Give timeline items type or category icons so that you can easily scan what is happening.
3. Allow the user to enter the timeline at any individually sharable link of an event and seamlessly scroll up and down

- [ ] Deliver timelines as a plugin that can be extended by other 11ty users
- [ ] Auto-create social-media-ready screenshots of a timeline item
- [ ] Integrate with Contexter to have context-full link cards in the timeline
- [ ] Leverage the Live Blog format of Schema dot org
- [ ] Allow each entry to be its own Markdown file
- [ ] Handle SASS instead of CSS
- [ ] Fast Scroller by Month and Year
- [ ] Add timelines and individual timeline items to the sitemap

## Day 13

It looks like there is no straightforward way to handle the Canvas element with JSDOM without a *lot* of hacking. When people out there are writing about trying to do this purely through Node, it appears the only real choice is using [puppeteer](https://github.com/puppeteer).

Ok. Looks like there is a package for doing it this way. [Let's try `node-html-to-image` instead](https://www.npmjs.com/package/node-html-to-image). Ugh. I'm going to basically have to redo my template if I want to do this right. But... for now I might just dump it out of JSDOM now to see if it works.

I did a little test and it looks like it works!

```js
console.log("Create Template Social Image Enters");
const dom = new JSDOM(`<!DOCTYPE html><head>
<link href="https://fonts.googleapis.com/css?family=Roboto+Slab|Hind+Vadodara:400,600" rel="stylesheet" type="text/css">
</head><body></body>`);
const window = dom.window;
const document = window.document;
const customElements = window.customElements;
const HTMLElement = window.HTMLElement;
function h(tag, attrs, ...children) {
var el = document.createElement(tag);
if (isPlainObject(attrs)) {
	for (let k in attrs) {
		if (typeof attrs[k] === "function")
			el.addEventListener(k, attrs[k]);
		else el.setAttribute(k, attrs[k]);
	}
} else if (attrs) {
	children = [attrs].concat(children);
}
children = children.filter(Boolean);
for (let child of children) el.append(child);
return el;
}

function isPlainObject(v) {
return v && typeof v === "object" && Object.prototype === v.__proto__;
}
document.body.append(h("div", {}, h("p", {}, "Hello world")));
htmlToImage({
output: "./image.png",
html: dom.serialize(),
}).then(() => console.log("The image was created successfully!"));
```

Ok, let's see if we can use this with the timeline code. Wow... doing every image at once is *a lot*. The system is freaking out, so that's not good. Also it re-triggers the build task, which... I dunno if I want that?

Ugh, that didn't work.

![A whole mess of HTML not properly rendering](../img/node-html-img-test-one.png)

`git commit -m "Another test of the image generation"`
