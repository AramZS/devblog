---
title: Context Center Timelines - Day 17 - Image Generation Backoff.
description: "Getting a preview image auto-generated."
date: 2023-01-08 22:59:43.10 -4
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
  - Promises
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

## Day 17

After the experimentation with the other error, I don't think it is causing the failure I'm seeing. It seems like even with an array of images it may be crashing anyway. I want to try this out in isolation.

By going into the log function in my version of Eleventy in the node_modules folder (`node_modules/@11ty/elevent/src/EleventyErrorHandler.js`) I added more general logging to see the issue better:

```js
log(e, type = "log", prefix = ">", chalkColor = "", forceToConsole = false) {
  let ref = e;
	console.log('Error Thrown', e)
  while (ref) {
    let nextRef = ref.originalError;
    if (!nextRef && EleventyErrorUtil.hasEmbeddedError(ref.message)) {
      nextRef = EleventyErrorUtil.deconvertErrorToObject(ref);
    }
```

Let's get the actual image objects I want to use and write them locally.

```js
	eleventyConfig.on("eleventy.after", () => {
		console.log(`Image array of ${timelineImages.length} ready to process`);
		const fs = require("fs");
		fs.writeFileSync(
			"images.json",
			JSON.stringify(timelineImages, null, 1)
		);
		console.log(timelineImages);
		return true;
		htmlToImage({
			html: imageTool.handlebarsTemplate(),
			content: timelineImages,
			puppeteerArgs: { timeout: 0 },
		})
			.then(() => console.log("The images were created successfully!"))
			.catch((error) => {
				console.log("The images were not created successfully!", error);
			});
	});
```

Once I've got this file, I can go ahead, take it, and move it into a standalone project. I can use Glitch to experiment with this.

Ok, looks like I can't use Puppeteer on Glitch for some reason. I'll do this locally. Glitch provides Git urls, so I can just download it right from that site using Git. [Here's the Glitch project](https://glitch.com/edit/#!/better-recondite-umbrella) and I can just run the local file without the server: `node -e 'require("./image-generator.js")()'`.

Hmmm, well, in isolation it seems to freeze at around 129 items and then stop there. I should likely back off, or perhaps split up the array of images and handle them, maybe 50 at a time.

Let's [pull together some code to chunk up the array](https://stackoverflow.com/questions/8495687/split-array-into-chunks).

Once it is chunked up, I wonder if I can get it to run in parallel? Or should I get it to run in sequence. Let's try parallel first.

Huh. It says it completed, but no go, only 129 of over 400 items it is supposed to generate.

I can try using `await` in the forEach loop? No, that is still causing a timeout. What if I try decreasing the size of the sub arrays. Nope, that didn't work.

Let's instead try chaining the array more directly into a Promise sequence.

Wait... there are only 62 posts and I'm duplicating, so there should be 124 images. That's weird... why did it act like were over 400 elements?

Huh, it looks like there was a problem with the image output names not being properly escaped via slugify. Let's make sure the fix for that is in place.

Hmm ok, I also need to remove quotes and some other symbols. Ok, better file names now. This seems like it is working, but I'm not seeing every single file created. Let me check to see if somehow I'm overwriting a file that already exists.

Ah, I need to `shift` the first element off the front of the array.

Oh and I need to return the Promise so it can be handled. Ok, this is working in the standalone project now. Let's bring it back over.

`git commit -am "Get image generation more sequenced, less in parallel. And it is working"`

My working dynamically generated Promise chain looks like this:

```js
function generateSomeImages(imageSet) {
	return new Promise((resolve, reject) => {
		console.log(`Image sub array of ${imageSet.length} ready to process`);
		imageSet.forEach((imgObject) => {
			if (fs.existsSync(imgObject.output)) {
				//console.log("File already exists", imgObject.output);
			}
		});
		htmlToImage({
			html: handlebarsTemplate(),
			content: imageSet,
			puppeteerArgs: { timeout: 0 },
		})
			.then(() => {
				console.log("The images were created successfully!");
				resolve(true);
			})
			.catch((error) => {
				console.log("The images were not created successfully!", error);
				reject(error);
			});
	});
}


const queueImagesProcess = (timelineImages) => {
	console.log(`Image array of ${timelineImages.length} ready to process`);
	//console.log(timelineImages);
	let chunks = chunkUpArray(timelineImages);
	let firstChunk = chunks.shift();
	try {
		let finalPromise = new Promise((resolve, reject) => {
			let finalStep = Promise.resolve();
			let promiseChain = chunks.reduce(
				(prev, cur) =>
					prev.then(() => {
						return generateSomeImages(cur);
					}),
				generateSomeImages(firstChunk)
			);
			return promiseChain
				.then(() => {
					console.log("Chain complete");
					resolve(true);
				})
				.catch((e) => {
					console.log("Promise catch error in-chain ", e);
					reject(false);
				});
		});
		return finalPromise;
	} catch (e) {
		console.log("Promise resolution failed", e);
		return false;
	}
};
```

I found this after I found my solution, which itself [was adapted](https://stackoverflow.com/questions/21372320/how-to-chain-execution-of-array-of-functions-when-every-function-returns-deferre), but [this appears to be a pretty decent walk-through of the thinking behind using `reduce` to accomplish this](https://decembersoft.com/posts/promises-in-serial-with-array-reduce/).

And the last step is to set it up in the HEAD tag of the template!

`git commit -am "Add social image to timeline page headers"`
