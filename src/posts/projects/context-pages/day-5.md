---
title: "Day 5: Simple Wayback Machine Archiving"
description: "I want to share lists of links, but make them readable and archived"
date: 2022-1-11 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - archiving
  - Internet Archive
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
---

## Project Scope and ToDos

1. Take a link and turn it into an oEmbed/Open Graph style share card
2. Take a link and archive it in the most reliable way
3. When the link is a tweet, display the tweet but also the whole tweet thread.
4. When the link is a tweet, archive the tweets, and display them if the live ones are not available.
5. Capture any embedded retweets in the thread. Capture their thread if one exists
6. Capture any links in the Tweet
7. Create the process as an abstract function that returns the data in a savable way

- [ ] Archive links on Archive.org and save the resulting archival links
- [ ] Create link IDs that can be used to cache related content
- [ ] Integrate it into the site to be able to make context pages here.
- [ ] Check if a link is still available at build time and rebuild the block with links to an archived link

## Day 5

Ok, the Archive.is stuff isn't working for no clear reason. Let's step back and try Archive.org. I want to first standardize to a single set of finalized meta values. I built a function to find the right values moving down priorities from `metadata` to OpenGraph to JSON-LD, with JSON-LD (where there) being the most likely to have accurate metadata.

Ok, let's look at Web Arcvhive documentation

- https://blog.archive.org/2017/01/25/see-something-save-something/
- https://github.com/ArchiveTeam
- https://wiki.archiveteam.org/index.php/Dev/Source_Code
- https://github.com/ArchiveTeam/seesaw-kit
- https://github.com/ArchiveTeam/grab-site
- https://help.archive.org/hc/en-us/articles/360017788831-How-to-upload-files-to-create-a-new-item-page-
- https://help.archive.org/hc/en-us/articles/360060767911-Example-of-good-metadata-for-items
- https://en.wikipedia.org/wiki/Help:Using_the_Wayback_Machine

It can definitely get complicated depending on how complex we want our archiving process to be. But let's start with [a very basic version](https://en.wikipedia.org/wiki/Help:Using_the_Wayback_Machine#To_save_a_live_page). It looks like I should just be able to send a request and start the archiving process off? Let's try setting up a basic fetch.

Hmm there's a bunch of repeated code I'll need to implement for fetch. Let's pull it out into its own file. Now I can basically use it in place and also reuse it for my link archiver functions:

```js
// Using suggestion from the docs - https://www.npmjs.com/package/node-fetch#loading-and-configuring-the-module

const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

const ua =
	"facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

const getRequestHeaders = () => {
	return {
		cookie: "",
		"Accept-Language": "en-US,en;q=0.8",
		"User-Agent": ua,
	};
};

class HTTPResponseError extends Error {
	constructor(response, ...args) {
		super(
			`HTTP Error Response: ${response.status} ${response.statusText}`,
			...args
		);
		this.response = response;
	}
}

const checkStatus = (response) => {
	if (response.ok) {
		// response.status >= 200 && response.status < 300
		return response;
	} else {
		throw new HTTPResponseError(response);
	}
};

const fetchUrl = async (url, options = false, ua = true) => {
	let response = false;
	let finalOptions = options
		? options
		: {
				method: "get",
		  };
	if (ua) {
		finalOptions.header = ua === true ? ua : getRequestHeaders();
	}
	try {
		response = await fetch(url, finalOptions);
	} catch (e) {
		if (e.hasOwnProperty("response")) {
			console.error("Fetch Error in response", e.response.text());
		} else if (e.code == "ENOTFOUND") {
			console.error("URL Does Not Exist", e);
		}
		return false;
	}
	response = checkStatus(response);
	return response;
};

module.exports = fetchUrl;
```

Ok, that works! I am getting a 200 back, implying that it is being archived. Yeah, [when I check the archive page for me test link it is working](https://web.archive.org/web/*/http://blog.aramzs.me/)!

`git commit -am "Set up for further archiving and abstract fetch tools. Send links to Wayback Machine"`
