---
title: Context Center Timelines - Day 18 - Setting up JSON LD.
description: "Getting a preview image auto-generated."
date: 2023-01-13 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
  - JS
  - SchemaDotOrg
  - metadata
  - Build Tasks
---

## Project Scope and ToDos

1. Create timeline pages where one can see the whole timeline of a particular event
2. Give timeline items type or category icons so that you can easily scan what is happening.
3. Allow the user to enter the timeline at any individually sharable link of an event and seamlessly scroll up and down

- [ ] Deliver timelines as a plugin that can be extended by other 11ty users
- [x] Auto-create social-media-ready screenshots of a timeline item
- [x] Integrate with Contexter to have context-full link cards in the timeline
- [ ] Leverage the Live Blog format of Schema dot org
- [x] Allow each entry to be its own Markdown file
- [ ] Handle SASS instead of CSS
- [ ] Fast Scroller by Month and Year
- [ ] Add timelines and individual timeline items to the sitemap
- [ ] Generate images more efficiently.

## Day 18

What I'd like to do is implement the correct SEO tags. I've now put in the Social Media Optimization tags.

`git commit -am "Add socials and fix links. Still don't have the keyvalues working for individual timeline items"`

But it has been very annoying to have the images build constantly during watch. I bet I can fix that.

Let's try setting a breaker to stop the `.after` from running after the first time.

```js
	let ranOnce = false;
	eleventyConfig.on("eleventy.after", async () => {
		if (ranOnce) {
			return;
		}
		console.log(`Image array of ${timelineImages.length} ready to process`);
		let processFinished = imageTool.queueImagesProcess(timelineImages);
		ranOnce = false;
		return processFinished.then(() =>
			console.log("Image generation process complete")
		);
	});
```

This means establishing an a structured data article schema using JSON-LD.

We want news articles [I think](https://support.google.com/webmasters/thread/95258798/for-liveblogposting-markup-it-need-be-together-with-newsarticle-or-can-be-alone?hl=en)? Or [articles](https://schema.org/Article) as a format.

https://developers.google.com/search/docs/appearance/structured-data/article

I think it makes sense to render [these timelines as `LiveBlogPostings`](https://schema.org/LiveBlogPosting)? It isn't traditionally the case for longer term content, however, we should give it a try. We can always make it optional later, perhaps only some timelines get [the Liveblog treatment](https://moz.com/blog/live-blog-posting-schema). These are composed of [liveBlogUpdates](https://schema.org/liveBlogUpdate). We can see [an example of how this works with one of the articles that the Moz blog linked](https://validator.schema.org/#url=https%3A%2F%2Fwww.washingtonpost.com%2Fnation%2F2022%2F01%2F07%2Fcovid-omicron-variant-live-updates%2F).

Ok, I fixed the image generation process so it won't constantly re-run in watch mode. I think this is a good start, but maybe I shouldn't even build the images if they are already built.

I'll set up the framework of the JSON-LD block I have in the main blog and then work from there now that I've unblocked myself on this issue.

`git commit -am "Set up JSON LD block for further development"`
