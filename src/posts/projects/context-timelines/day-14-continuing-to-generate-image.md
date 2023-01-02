---
title: Context Center Timelines - Day 14 - Generate Timeline Item Image
description: "Getting a preview image auto-generated."
date: 2022-12-30 22:59:43.10 -4
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

## Day 14

Ok, not sure what is going wrong with the image generation, but clearly something is wonky. I'm going to [try running a test function on the command line](https://stackoverflow.com/questions/30782693/run-function-in-script-from-command-line-node-js) and see what happens.

`node -e 'require("./_custom-plugins/timelinety/src/build-tools/timeline-social-image.js").testImg()'`

Ok, this has worked.

![A basic hello world](../img/test-img-gen-1.png)

Let us try to add some elements here and see if it continues to work.

Sizing is a little weird, but looking good!

![A basic hello world but now with color text and background](../img/test-img-gen-2.png)

Ok, this is looking promising!

To size the final image I need to set body styles when I create JSDOM as an object, like so:

```js
const dom = new JSDOM(`<!DOCTYPE html><head>
<link href="https://fonts.googleapis.com/css?family=Roboto+Slab|Hind+Vadodara:400,600" rel="stylesheet" type="text/css">
<style>
body {
 width: 600px;
 height: 500px;
}
</style>
</head><body></body>`);
```

I'll try adding the style in next. Hmm. Oh, I forgot that the style element needs `innerHTML`. Hmmm, no that doesn't do it. Perhaps I need to [give it a type](https://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript).

Looks like that worked. Hmm.

Ok, lets see if I can abstract the custom HTML element class to its own file.

I'll just have to pass the class the document and HTMLElement objects into the stand-alone file like so:

```js
module.exports = (document, HTMLElement) => {
	class TimelineItem extends HTMLElement {
		...
	}
	return TimelineItem;
}
```

Ok, now lets try running a test with an actual timeline object:

```js
{
  timeline: 'monkeypox',
  title: 'A looming deadline for tens of millions of Americans',
  description: 'The GOP battles over a trillion-dollar stimulus deal. Ahead of the November election, President Trump guts a landmark environmental law. And, how to avoid a devastating potential kink in the vaccine supply chain.',
  tags: [
    'timeline',
    'Monkeypox',
    'Health',
    'Medicine',
    'Stimulus',
    'Markets'
  ],
  date: '2020-06-22T16:00:00.100Z',
  categories: [ 'News' ],
  filters: [ 'USA' ],
  dateAdded: '2022-08-09T02:59:43.100Z',
  isBasedOn: 'https://www.washingtonpost.com/podcasts/post-reports/a-looming-deadline-for-tens-of-millions-americans/',
  shortdate: false,
  color: 'grey',
  content: '<p><a href="https://www.washingtonpost.com/podcasts/post-reports/a-looming-deadline-for-tens-of-millions-americans/" target="_blank">https://www.washingtonpost.com/podcasts/post-reports/a-looming-deadline-for-tens-of-millions-americans/</a></p>\n',
  slug: 'a-looming-deadline-for-tens-of-millions-of-americans'
}
```

Now we're starting to get somewhere!


![A broken version of the timeline item that doesn't quite work but is getting there](../img/test-img-gen-3.png)

`git commit -m "Basic working timeline image even if it looks terrible"`

Ok, I need to write the HTML to a document to debug it.

Oh huh, I guess I need to add metadata with the Contexter plugin settings, since I'm going to need it to add information to the images as well. Ok, shouldn't be too hard, for that plugin I can add global data.

```js
let options = {
	name: "markdown-contexter",
	extension: "md",
	cachePath: "_contexterCache",
	publicImagePath: "assets/images/contexter",
	publicPath: "timegate",
	domain: "http://localhost:8080",
	buildArchive: true,
	existingRenderer: function () {},
	...userOptions,
};

const cacheFolder = path.join(
	__dirname,
	"../../",
	`/${options.cachePath}/`,
	pageFilePath
);

options.cacheFolder = cacheFolder;
eleventyConfig.addPassthroughCopy({
	[`${options.cachePath}/images`]: options.publicImagePath,
});
eleventyConfig.addGlobalData("contexterSettings", options);
```

Hmm and instead of copy pasting the CSS, why don't I use `fs.readSync` to import it?

Hmmm, this seems to theoretically work, but I'm getting a huge cluster of CSS that isn't working because all the linebreaks are gone. I suppose I could minify it, but that seems silly, why can't I get a readFile output to maintain it's format?

I gotta remember to put my `\n`s in doublequotes too.

Hmmm, is the problem is `createTextNode`? Or is it just not possible to get all the linebreaks in there properly with how JS inserts text inside of elements? I guess I have to minify the CSS after all.
