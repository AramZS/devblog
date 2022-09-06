---
title: Context Center Timelines - Day 7 - Detour to dealing with image retrieval breaking my build process
description: "Something weird is happening in promises."
date: 2022-09-04 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - Context
  - Nunjucks
  - WiP
  - JS
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

## Day 7

Ok, there are two parts to figuring out how the individual URLs work. The first is to have the individual URLs available to copy from the timeline itself.

First lets get back to a running local env. Looks like `timeline-item`'s data cascade at the template level is having some issues. Says `timeline` is missing from the following functions:

```js
applyThis: {
    timelineCheck: function(siteContext){
        if (siteContext){
            console.log("Global check", siteContext.globalTimelines, 'for timeline', siteContext?.timeline, ' and global object is ', siteContext)
        }
    },
},
timelineData: function(siteContext){
    if (siteContext?.timeline && siteContext?.globalTimelines.hasOwnProperty(siteContext.timeline)){
        return siteContext.globalTimelines[timeline]
    }
},
```

Hmmm, even removing that I'm still having the build process fail. Looks like there is another problem. Maybe a problem with the archive page retrieval process.

Yeah, looks like it is throwing an error as part of the HTTP response check.

Last thing in the log is this function:

```js
const checkStatus = (response) => {
	if (response.ok) {
		// response.status >= 200 && response.status < 300
		return response;
	} else {
		console.log("HTTP response internals", response.internals);
		throw new HTTPResponseError(response);
	}
};
```

There should be plenty of places where this gets caught, but it doesn't seem to be catched properly. Instead it is crashing the build. Ok so I don't see any useful information. It looks like there's a problem there but I don't know what it is. Let's get more information and pass it through that function. We'll need the URL to understand what's going on. I'll rewrite the status check in order to emit the URL into the log.

Ok, interesting. It looks like the problem is specifically with retrieving a PNG file. Ok, I fixed the problem with fetchUrl not being caught a while back, but I only did it with pages. I missed catching the error with images. That must be where the problem is here. Ok, let's see if this is a fix.

```js
const getImageAndWriteLocally = async (url, imageCacheFile) => {
	try {
		const responseImage = await fetchUrl(url);
		if (responseImage) {
			const buffer = await responseImage.buffer();
			fs.writeFileSync(imageCacheFile, buffer);
			return imageCacheFile;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
};
```

That doesn't seem to have done it. It is still the same error causing the problem, but it isn't properly resolving. I should be able to return `false` in the catch statement and be done with this as my error handling?

It looks like I have identified the right function. When I add more logging to downstream error handling it doesn't show up. So the system is indeed breaking at this function. I need to reconfigure the try to capture only the specific `await` function that is having a problem I guess. I'd hoped returning a `false` would be fine, but it seems the Error is still bubbling up.

Let me get closer to the metal and try returning an actual promise.

```js
const getImageAndWriteLocally = (url, imageCacheFile) => {
	return new Promise((resolve, reject) => {
		fetchUrl(url)
			.then((responseImage) => {
				if (responseImage) {
					responseImage.buffer().then((buffer) => {
						fs.writeFileSync(imageCacheFile, buffer);
						resolve(imageCacheFile);
					});
				} else {
					resolve(false);
				}
			})
			.catch((error) => {
				console.log("Image write failed ", error);
				resolve(false);
			});
```

Ok, now it is giving me better information. But still not working.

`git commit -am "Build process is breaking for something to do with image retrieval."`
