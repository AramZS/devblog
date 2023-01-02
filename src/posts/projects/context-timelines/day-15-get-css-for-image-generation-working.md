---
title: Context Center Timelines - Day 15 - Get CSS for Image Generation Working
description: "Getting a preview image auto-generated."
date: 2023-01-01 22:59:43.10 -4
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

## Day 15

Looks like there are quite a few options for getting CSS minified in the way I'm thinking, but when filtering for recently updated, not with a lot of issues, commonly used, and with a clear intent to be used inside standard Node work, not some larger system, I've narrowed it down to one candidate - [csso](https://www.npmjs.com/package/csso).

Let's install and try that.

Wait though... what happens when an eleventy plugin has a dependency? I should be fine once it is packaged up and I install it with an actual install command, right? Ok, lets put that to one side.

Ok, now we're getting somewhere!

I need to import the user stylesheet as well and the layout isn't fully working, but it is definitely a *lot* closer.

![A broken version of the timeline item that doesn't quite work but is getting there - it has style applied now!](../img/test-img-gen-4.png).

To get it all the way there I'll need an image specific stylesheet to pull in. I've done it so it is always `odd` in terms of its placement configuration so I don't have to worry about two different styles.

I will need to make two images it looks like, [one for Facebook](https://developers.facebook.com/docs/sharing/webmasters/images/) at `1200 x 630` and one with a 2:1 aspect ratio (so lets do `1200 x 600`) [for Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image).

[Now that I know that there is a queued writing system](https://github.com/11ty/eleventy/pull/2633) in Eleventy using `graceful-fs`, I'll use that instead of standard `fs` here.

I know that if the link is there by itself, it'll have a particular pattern I can check the `content` property for with a ReExp check:

```js
let rexExpCheck = new RegExp(
  `<p><a href="${dataObj.isBasedOn}" target="_blank">${dataObj.isBasedOn}</a></p>\n`
);
```

Wait actually, I think it might build the share card beforehand? Let's try.

I also should try to vertically center the box during image generation.

Ok, yeah, it does! Nice!

`git commit -am "Set up image build function"`

Hmmm, it looks like the image builder backs up and crashes.

I can also see that there is a problem with some of the timegate URLs that are based on URLs. Looks like I'm getting some filepaths like `timegate/https://activitystrea.ms//index.html`.

And we'll fix the positioning in the CSS.

`git commit -am "Get image positioning right." `

Ok, now to figure out how to generate these images during build.
