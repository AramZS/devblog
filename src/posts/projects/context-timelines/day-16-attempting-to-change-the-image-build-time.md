---
title: Context Center Timelines - Day 16 - Attempting to change the build time for images.
description: "Getting a preview image auto-generated."
date: 2023-01-02 22:59:43.10 -4
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
  - CSS
  - Handlebars
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

## Day 16

The image build is just too heavy to do as is, even if it works.

It looks like I can pass an array into the library and build all the images at once? This might solve my problem with too many puppeteer instances launching (looks like [I'm not the only one to have this issue](https://github.com/frinyvonnick/node-html-to-image/issues/80)). But it looks like it expects me to pass in a `content` property and use a Handlebars template. Well, that's good, I already have a Handlebars template I can pull in.

I just need to pass in the object for `content`.

I'll do another test function to handle this.

Hmmm, there are a few things that need to be cleaned up let's see.

Ok, I've resolved most of the errors, but I'm still getting one.

```bash
 ✘  ~/Dev/context-center   timeline ●  node -e 'require("./_custom-plugins/timelinety/src/build-tools/timeline-social-image.js").testHandlebarImg()'
Create Template Social Image Enters
TypeError: (lookupProperty(...) || (depth0 && lookupProperty(...)) || alias4).call is not a function
    at Object.eval [as main] (eval at createFunctionContext (/Users/zuckerscharffa/Dev/context-center/node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js:262:23), <anonymous>:35:128)
    at main (/Users/zuckerscharffa/Dev/context-center/node_modules/handlebars/dist/cjs/handlebars/runtime.js:208:32)
    at ret (/Users/zuckerscharffa/Dev/context-center/node_modules/handlebars/dist/cjs/handlebars/runtime.js:212:12)
    at ret (/Users/zuckerscharffa/Dev/context-center/node_modules/handlebars/dist/cjs/handlebars/compiler/compiler.js:519:21)
    at /Users/zuckerscharffa/Dev/context-center/node_modules/node-html-to-image/dist/screenshot.js:50:44
    at step (/Users/zuckerscharffa/Dev/context-center/node_modules/node-html-to-image/dist/screenshot.js:33:23)
    at Object.next (/Users/zuckerscharffa/Dev/context-center/node_modules/node-html-to-image/dist/screenshot.js:14:53)
    at /Users/zuckerscharffa/Dev/context-center/node_modules/node-html-to-image/dist/screenshot.js:8:71
    at new Promise (<anonymous>)
    at __awaiter (/Users/zuckerscharffa/Dev/context-center/node_modules/node-html-to-image/dist/screenshot.js:4:12)
```

Ok, let's start slowly adding chunks of Handlebar code to see what triggers the error.

Ok, it looks like the core problem is `or` use in my template? Is there a different version of Handlebars at use in the `node-html-to-image` process?

What happens if we change the `or`s to instead be `if`s.

Ok, that seems to have fixed the issue, though it is still showing some rendering errors. I am not sure why Handlebars is working differently here. The Handlebars version [we're seeing in the node library is 4.5.3](https://github.com/frinyvonnick/node-html-to-image/blob/master/package.json#L11) and [in Eleventy we're using 4.7.7](https://github.com/11ty/eleventy/blob/v1.x/package.json#L110).

Hmm, it looks like the techniques I used for Nunjucks doesn't translate to Handlebars. I'll have to swap it over to Handlebars techniques instead. Annoying. Ugh, I've been doing Nunjucks for so long I've forgotten my Handlebars.

Ok, I've gotten a corrected template working now, but it isn't quite the same, I'll have to fix the style since I don't have custom HTML components anymore.

I'll need to set up Handlebars to generate a test rendered page, even with the fixes it still isn't working like I'd hoped.

Ok, a few differences in the layout are there that I'll need to adjust for, but shouldn't be too bad.

Ok, got it working again!

![A working version of the timeline image](../img/test-img-gen-5.png)

`git commit -am "Set up a handlebars template for social image generation"`

Ok, it looks like by putting an Array variable outside of the filter function, using it inside the filter function, and then using the Eleventy `after` event I can have it run against all the images at once:

```js
eleventyConfig.on("eleventy.after", () => {
	console.log("Image object ready to process", timelineImages);
	htmlToImage({
		html: imageTool.handlebarsTemplate(),
		content: timelineImages,
	}).then(() => console.log("The images were created successfully!"));
});
```

This does seem to work, but I'm still getting an error:

```bash
Error: Timeout hit: 30000
    at /Users/zuckerscharffa/Dev/context-center/node_modules/puppeteer-cluster/dist/util.js:69:23
    at Generator.next (<anonymous>)
    at fulfilled (/Users/zuckerscharffa/Dev/context-center/node_modules/puppeteer-cluster/dist/util.js:5:58)
    at runNextTicks (internal/process/task_queues.js:60:5)
    at processTimers (internal/timers.js:497:9)
  Eleventy:TemplatePassthrough Copying individual
```

This appears to be Puppeteer timing out when I build the images? Let's [see if I can pass it the args](https://pptr.dev/api/puppeteer.launchoptions.timeout/) in order to avoid that timeout.

I'm getting an unrelated error from JSDOM... I guess I don't really need that anymore though? Let's remove it. Wow that will be a lot of work that it turned out I didn't need to do. Yeah, that works!

Ok, I've got less errors now, but it is still crashing. The images seem to be building out, but it crashes out and I think it is still the timeout?

`git commit -m "Adding fixes for the template generation of the preview image"`

Ok, I don't seem to be getting the same error. Perhaps this is a error about a particular post? I don't know, but the timeout error does seem to be gone.

I'm trying to eliminate other errors, and it does look as if Eleventy is tripping over my error in the markdown-contexter around processing after `pContext` there.

It appears that the timeout error is at

```js
setTimeout(() => {
	console.log(
		"Request timed out for ",
		cacheFile
	);
	reject("Timeout error");
}, 6000);
```

So it looks like a try/catch around my array of promises with `Promise.all` resolution doesn't seem to be working.

Ok, replacing `reject("Timeout error")` with `reject(new Error("Archiving request timeout error"));` at least tells me what the error is. But it is saying it is unhandled, and I'm not sure why that is the case. It should be handled. Maybe I just remove the reject?

`git commit -am "Adding better logging for markdown contexter"`
