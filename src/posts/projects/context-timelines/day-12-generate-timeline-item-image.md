---
title: Context Center Timelines - Day 12 - Generate Timeline Item Image
description: "Getting a preview image auto-generated."
date: 2022-11-01 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
  - JS
  - Images
  - SMO
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

## Day 12

Ok, so I want to create social-media-ready screenshots of timeline items. This feels like something I can do with some preexisting library pretty quickly and leverage the Javascript I wrote in my last session to build the DOM element. Today I feel like I want to just complete a task.

So, let's search around and see what we can pull.

So it looks like the two main libraries that people reference are the older but less recently updated library [dom-to-image](https://github.com/tsayen/dom-to-image) and the more recently updated [html-to-image](https://github.com/bubkoo/html-to-image). They both seem pretty similar. dom-to-image is more widely used even if it isn't more recently updated. I feel bad using a library that is ripping off another one... if it is? Ah, I see they do give credit to the original. The original author no longer seems to be active on GitHub at all. Ok, I'm going to go with the newer one.

I'm going to duplicate my old code from my previous session for now. I want to keep it dry, but that'll mean setting up a JS build task, and that's for later, assuming I get this to work.

To move towards that, I think I'll want to use [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) with my custom element.

Now I need to apply the CSS from the stylesheet that isn't included in the element using that.

To create this at the build step, I'll need a virtual DOM I think? Let's pull down [JSDOM](https://github.com/jsdom/jsdom). It looks that [JSDOM does indeed have customElements to use](https://dev.to/ficusjs/unit-testing-web-components-with-ava-and-jsdom-2ofp).

Ok, set that up, set my style element up. How do I attach a Shadow DOM from outside the element?

It looks like as long as I define the Shadow DOM as open with `this.attachShadow({ mode: "open" });` in my custom element setup, I can attach to it like `itemDOMObj.shadowRoot.appendChild(styleElement())`;

Ok, I think I have the right custom element, and I can use the library to create the right dataUrl. Then, I think, I can use `fs` to write that as an image file for my site.

Ok, now how do I create the file during my build step?

The problem is that a bunch of my data is built on to the object at the point the template is made. Can I pull my function into there? Perhaps I can pass it in as a filter? But the object is not ready really there either. And I can't use the `set` keyword to set deep object properties.

Looks like Nunjucks folks have [developed a technique for this](https://github.com/mozilla/nunjucks/issues/313). I'll use that.

Ok, looks like that is sending the right object and it is getting set up into the right DOM element. Only... it's not writing a file.

Found the error!

```
Test Social image build failed for reason:  ReferenceError: HTMLCanvasElement is not defined
    at /Users/zuckerscharffa/Dev/context-center/node_modules/html-to-image/lib/clone-node.js:75:33
    at step (/Users/zuckerscharffa/Dev/context-center/node_modules/html-to-image/lib/clone-node.js:33:23)
    at Object.next (/Users/zuckerscharffa/Dev/context-center/node_modules/html-to-image/lib/clone-node.js:14:53)
    at /Users/zuckerscharffa/Dev/context-center/node_modules/html-to-image/lib/clone-node.js:8:71
    at new Promise (<anonymous>)
    at __awaiter (/Users/zuckerscharffa/Dev/context-center/node_modules/html-to-image/lib/clone-node.js:4:12)
    at cloneSingleNode (/Users/zuckerscharffa/Dev/context-center/node_modules/html-to-image/lib/clone-node.js:73:12)
    at /Users/zuckerscharffa/Dev/context-center/node_modules/html-to-image/lib/clone-node.js:171:58
```

So it [looks](https://github.com/plotly/plotly.js/issues/3239) [like](https://stackoverflow.com/questions/71719298/node-js-application-leveraging-jsdom-and-node-canvas-trying-to-drawimage-from) `HTMLCanvasElement` [isn't](https://stackoverflow.com/questions/71884870/react-testing-library-cant-acquire-context-from-the-given-item) in JSDOM? Uh oh. [I might be able to use this](https://www.npmjs.com/package/canvas)?

Hmmm. Guess this is not so simple. I'll save the rest for another day.

`git commit -am "Step one of setting up automatic image generation"`
