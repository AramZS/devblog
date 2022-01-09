---
title: "Day 2: Building a tool to generate context pages"
description: "I want to share lists of links, but make them readable and archived"
date: 2022-1-1 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - fetch
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

## Day 2

Ok, let's set up the request process. I want to retrieve the page so let's move forward on that as the next step.

Fetch is increasingly the way to handle HTTP requests in the browser, so it would be a good library to play with. Luckily there is a [Node Fetch library](https://www.npmjs.com/package/node-fetch) I can leverage.

If I want to use fetch v3 it looks like this is how I have to go

```javascript
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));`
```

The other thing I know from working on PressForward is that requests will often get blocked if they look too much like a bot, so it is helpful to purposefully identify yourself as a trusted bot. There's [a list of UAs that I could search](https://user-agents.net/lookup), but I know from experiance that the most successful User Agent is Facebook's, especially when I'm trying to retrieve page metadata. So let's start there.

I also want to check for errors.

Let's use the advised pattern on the module page to start with. The logic here is that a response can still be "successful" even if it comes back with an error code. Their pattern should be able to catch that.

Ok, here's my code now:

```javascript

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

const fetchUrl = async (url) => {
	try {
		const response = await fetch(url, {
			method: "get",
			header: getRequestHeaders(),
		});
	} catch (e) {
		console.error("Fetch Error", e.response.text());
	}
	checkStatus(response);
};
```

Let's add this to the module export and see if some basic requests work. Let's make a basic request that we know will respond to the GitHub API. Getting the head of this project's main commit tree should work just fine. Let's request `https://api.github.com/repos/AramZS/devblog/git/refs/heads/main`.

Ok, so what does a fetch returned object look like?

```javascript
{ size: 0,
  type: 'default',
  url: 'https://api.github.com/repos/AramZS/devblog/git/refs/heads/main',
  status: 200,
  ok: true,
  redirected: false,
  statusText: 'OK',
  headers:
   { get: [Function: get],
     forEach: [Function: forEach],
     values: [Function: values],
     entries: [Function: entries],
     append: [Function],
     delete: [Function],
     getAll: [Function],
     has: [Function],
     set: [Function],
     sort: [Function: sort],
     keys: [Function] },
  clone: [Function: clone],
  body:
   { _writeState: [ 0, 0 ],
     _readableState:
      { objectMode: false,
        highWaterMark: 16384,
        buffer: [Object],
        length: 0,
        pipes: [],
        flowing: null,
        ended: false,
        endEmitted: false,
        reading: false,
        constructed: true,
        sync: false,
        needReadable: false,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        errorEmitted: false,
        emitClose: true,
        autoDestroy: true,
        destroyed: false,
        errored: null,
        closed: false,
        closeEmitted: false,
        defaultEncoding: 'utf8',
        awaitDrainWriters: null,
        multiAwaitDrain: false,
        readingMore: false,
        dataEmitted: false,
        decoder: null,
        encoding: null },
     _events:
      { prefinish: [Function: prefinish],
        close: [Object],
        end: [Function: onend],
        finish: [Object],
        error: [Object],
        unpipe: [Function: onunpipe] },
     _eventsCount: 6,
     _maxListeners: undefined,
     _writableState:
      { objectMode: false,
        highWaterMark: 16384,
        finalCalled: false,
        needDrain: false,
        ending: false,
        ended: false,
        finished: false,
        destroyed: false,
        decodeStrings: true,
        defaultEncoding: 'utf8',
        length: 61,
        writing: true,
        corked: 0,
        sync: false,
        bufferProcessing: false,
        onwrite: [Function: bound onwrite],
        writecb: [Function: nop],
        writelen: 61,
        afterWriteTickInfo: null,
        buffered: [],
        bufferedIndex: 0,
        allBuffers: true,
        allNoop: true,
        pendingcb: 1,
        constructed: true,
        prefinished: false,
        errorEmitted: false,
        emitClose: true,
        autoDestroy: true,
        errored: null,
        closed: false,
        closeEmitted: false,
        getBuffer: [Function: getBuffer] },
     allowHalfOpen: true,
     bytesWritten: 0,
     _handle:
      { onerror: [Function: zlibOnError],
        buffer: <Buffer 1f 8b 08 00 00 00 00 00 00 03 9d 8e 3f 6b c3 30 10 47 bf 8b e6 10 d9 8e 89 6b 43 86 40 e9 9f 80 92 a1 34 05 2f e5 24 9d 2d 15 cb 12 96 62 a8 43 be 7b ... 11 more bytes>,
        cb: [Function],
        availOutBefore: 16384,
        availInBefore: 61,
        inOff: 0,
        flushFlag: 2,
        write: [Function: write],
        writeSync: [Function: writeSync],
        close: [Function: close],
        init: [Function: init],
        params: [Function: params],
        reset: [Function: reset],
        getAsyncId: [Function: getAsyncId],
        asyncReset: [Function: asyncReset],
        getProviderType: [Function: getProviderType] },
     _outBuffer: <Buffer 7b 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 55 00 00 00 00 00 00 00 c3 00 00 00 00 00 00 00 e0 bd 80 f2 e8 7f 00 00 20 b8 80 f2 e8 7f 00 00 00 00 ... 16334 more bytes>,
     _outOffset: 0,
     _chunkSize: 16384,
     _defaultFlushFlag: 2,
     _finishFlushFlag: 2,
     _defaultFullFlushFlag: 3,
     _info: undefined,
     _maxOutputLength: 4294967296,
     _level: -1,
     _strategy: 0,
     params: [Function: params],
     _closed: false,
     bytesRead: 0,
     reset: [Function],
     _flush: [Function],
     _final: [Function],
     flush: [Function],
     close: [Function],
     _destroy: [Function],
     _transform: [Function],
     _processChunk: [Function],
     _write: [Function],
     _read: [Function],
     write: [Function],
     cork: [Function],
     uncork: [Function],
     setDefaultEncoding: [Function: setDefaultEncoding],
     _writev: null,
     end: [Function],
     destroy: [Function: destroy],
     _undestroy: [Function: undestroy],
     push: [Function],
     unshift: [Function],
     isPaused: [Function],
     setEncoding: [Function],
     read: [Function],
     pipe: [Function],
     unpipe: [Function],
     on: [Function],
     addListener: [Function],
     removeListener: [Function],
     off: [Function],
     removeAllListeners: [Function],
     resume: [Function],
     pause: [Function],
     wrap: [Function],
     iterator: [Function],
     setMaxListeners: [Function: setMaxListeners],
     getMaxListeners: [Function: getMaxListeners],
     emit: [Function: emit],
     prependListener: [Function: prependListener],
     once: [Function: once],
     prependOnceListener: [Function: prependOnceListener],
     listeners: [Function: listeners],
     rawListeners: [Function: rawListeners],
     listenerCount: [Function: listenerCount],
     eventNames: [Function: eventNames] },
  bodyUsed: false,
  arrayBuffer: [Function: arrayBuffer],
  blob: [Function: blob],
  json: [Function: json],
  text: [Function: text] }
```

Ok, this is pretty standard, we can get the body as JSON or as Text by using awaited functions. So I can check for a string that I expect inside that text and that will be there no matter when I make the HTTP request.

```javascript
describe("handle basic requests", function () {
		this.timeout(5000);
		it("should resolve a basic URL", async function () {
			const result = await linkModule(
				"https://api.github.com/repos/AramZS/devblog/git/refs/heads/main"
			);
			result.status.should.equal(200);
			const textResponse = await result.text();
			console.log(textResponse);
			textResponse
				.includes(
					'"url":"https://api.github.com/repos/AramZS/devblog/git/refs/heads/main"'
				)
				.should.equal(true);
		});
	});
```

That works! This is a good test.

Ok, I want to look up how to create oEmbeds (where they're available). I've done a lot with scraping pages but I've never done oEmbed. How does it work? Let's look around.

It looks like the standard is described in a pretty basic way [here](https://oembed.com/). It looks like [the relevant code for WordPress is over here](https://github.com/WordPress/wordpress-develop/blob/5.8.1/src/wp-includes/embed.php#L25-L28). There are two popular options [oembed](https://www.npmjs.com/package/oembed) and [oembed-parser](https://www.npmjs.com/package/oembed-parser).

This is interesting. I'd always assumed oEmbeds were based off HEAD data, but it looks like sites declare an endpoint from which to retrieve them?

`oembed-parser` looks up to date and well maintained. I think I'll try pulling that in.

It looks like, should any of the links be Facebook, I'll need a Facebook API key. I want to design this to be extended to other projects, so let's set up the function that way.

And Now we have a pretty basic oEmbed functionality. Let's see what I get as a test result.

Ok, first step is to log the result. Here's what I get

```javascript
{
  type: 'photo',
  flickr_type: 'photo',
  title: 'upload',
  author_name: 'AramZS',
  author_url: 'https://www.flickr.com/photos/aramzs/',
  width: 640,
  height: 640,
  url: 'https://live.staticflickr.com/2941/33763840540_481ce97db2_z.jpg',
  web_page: 'https://www.flickr.com/photos/aramzs/33763840540/',
  thumbnail_url: 'https://live.staticflickr.com/2941/33763840540_481ce97db2_q.jpg',
  thumbnail_width: 150,
  thumbnail_height: 150,
  web_page_short_url: 'https://flic.kr/p/TrAvtJ',
  license: 'Attribution License',
  license_url: 'https://creativecommons.org/licenses/by/2.0/',
  license_id: '4',
  html: '<a data-flickr-embed="true" href="https://www.flickr.com/photos/aramzs/33763840540/" title="upload by AramZS, on Flickr"><img src="https://live.staticflickr.com/2941/33763840540_481ce97db2_z.jpg" width="640" height="640" alt="upload"></a><script async src="https://embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>',
  version: '1.0',
  cache_age: 3600,
  provider_name: 'Flickr',
  provider_url: 'https://www.flickr.com/'
}
```

Ok, I can test for that. I should really modal the response instead of making an actual HTTP request, but for now this is a good place to be. Last thing I want to test is if it can make a request to Facebook.

Hmm, trying some URLs and all I'm getting is `nulls`. That's annoying.

Ok, well, I'm hungry for dinner, so let's stop here.

`git commit -am "Getting the Link Request modules requesting and testing oembed"`
