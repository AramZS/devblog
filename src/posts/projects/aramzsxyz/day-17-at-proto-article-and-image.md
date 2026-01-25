---
title: XYZ Site - Day 17 - Publish an image and article to ATProto.
description: "Put my blog posts in the atmosphere"
date: 2026-01-25 14:01:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - Social Media
  - Web Share API
---

## Project Scope and ToDos

1. Create a versatile blog site
2. Create a framework that makes it easy to add external data to the site

- [ ] Give the site the capacity to replicate the logging and rating I do on Serialized and Letterboxd.
- [x] Be able to pull down RSS feeds from other sites and create forward links to my other sites
- [x] Create forward links to sites I want to post about.
- [ ] Create a way to pull in my Goodreads data and display it on the site
- [ ] Create a way to automate pulls from other data sources
- [x] Combine easy inputs like text lists and JSON data files with markdown files that I can build on top of.
- [x] Add a TMDB credit to footer in base.njk
- [x] Make sure tags do not repeat in the displayed tag list.
- [x] Get my Kindle Quotes into the site
- [ ] YouTube Channel Recommendations
- [x] Minify HTML via Netlify plugin.
- [ ] Log played games

## Day 17

Let's start today by uploading a [blob](https://atproto.com/specs/blob) for the image.

`goat blob upload public/img/posts/1443px-Typical-orb-web-photo.jpg`

That seems to have uploaded it. I get back the response:

```bash
{
  "$type": "blob",
  "ref": {
    "$link": "bafkreig2247wcpqjkqy2ukjh4gjyqhpl32kg3pva4x55npjmuh4joeware"
  },
  "mimeType": "image/jpeg",
  "size": 347901
}
```

Ok, so here's the formed document so far:

```json
{
	"$type": "site.standard.document",
	"publishedAt": "2024-06-08T10:00:00.000Z",
	"site": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.publication/3mbrgnnqzrr2q",
	"path": "/essays/the-internet-is-a-series-of-webs/",
	"title": "The Internet is a Series of Webs",
	"description": "The fate of the open web is inextricable from the other ways our world is in crisis. What can we do about it?",
	"coverImage": {
		"$type": "blob",
		"ref": {
			"$link": "bafkreig2247wcpqjkqy2ukjh4gjyqhpl32kg3pva4x55npjmuh4joeware"
		},
		"mimeType": "image/jpeg",
		"size": 347901
  	},
	"textContent": "",
	"bskyPostRef": "https://bsky.app/profile/chronotope.aramzs.xyz/post/3kulbtuuixs27",
	"tags": ["IndieWeb", "Tech", "The Long Next"],
	"updatedAt":"2024-06-08T10:30:00.000Z"

}
```

I think this is a full post now? I just add the full text content from here. Plaintext representation of the documents contents. Should not contain markdown or other formatting.

[What is out there for site.standard.document](https://ufos.microcosm.blue/collection/?nsid=site.standard.document)?

I see some folks are using a Markdown type, even if it doesn't have an NSID:

```json
"content": {
    "$type": "site.standard.content.markdown",
    "text": "<markdown here>",
    "version": "1.0"
  },
```

I'm not sure that is the right hierarchy? Should it be `site.standard.document.content.markdown`? I see [others are going that direction](https://stevedylan.dev/posts/standard-site-the-publishing-gateway/). Well, might as well use what is out there.

I'll write a little script to pull the markdown into a single line:

```bash
#!/bin/bash

# Check if file argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <markdown-file>"
    exit 1
fi

# Check if file exists
if [ ! -f "$1" ]; then
    echo "Error: File '$1' not found"
    exit 1
fi

# Convert markdown to single line with \n for linebreaks and escape double-quotes
awk '{gsub(/"/, "\\\""); printf "%s\\n", $0}' "$1" | sed 's/\\n$//'
```

Final document is:

```json
{
	"$type": "site.standard.document",
	"publishedAt": "2024-06-08T10:00:00.000Z",
	"site": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.publication/3mbrgnnqzrr2q",
	"path": "/essays/the-internet-is-a-series-of-webs/",
	"title": "The Internet is a Series of Webs",
	"description": "The fate of the open web is inextricable from the other ways our world is in crisis. What can we do about it?",
	"coverImage": {
		"$type": "blob",
		"ref": {
			"$link": "bafkreig2247wcpqjkqy2ukjh4gjyqhpl32kg3pva4x55npjmuh4joeware"
		},
		"mimeType": "image/jpeg",
		"size": 347901
  	},
	"textContent": "<textContent>",
	"content": {
		"$type": "site.standard.content.markdown",
		"text": "<markdown here>",
		"version": "1.0"
	},
	"bskyPostRef": "https://bsky.app/profile/chronotope.aramzs.xyz/post/3kulbtuuixs27",
	"tags": ["IndieWeb", "Tech", "The Long Next", "series:The Wild Web"],
	"updatedAt":"2024-06-08T10:30:00.000Z"

}
```

`bskyPostRef` can't be a string apparently as the post did not validate in goat. I was able to find a reason using [atproto.tools](https://atproto.tools/lexicons). So now I know [from the definition](https://github.com/bluesky-social/atproto/blob/main/lexicons/com/atproto/repo/strongRef.json) that I need:

```json
"bskyPostRef": {
		"$type": "com.atproto.repo.strongRef",
		"uri": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/app.bsky.feed.post/3kulbtuuixs27",
		"cid": "bafyreigh7yods3ndrmqeq55cjisda6wi34swt7s6kkduwcotkgq5g5y2oe"
	}
```

Since this will be my first document record, I have to push without the validation.

`goat record create fightwithtools-publication.json --no-validate`

and I get back:

`at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.document/3mdbvp5q2kz2l	bafyreiedky4yjivfcm5df5ygqy7vkt3q3qdvzppcg7mcq4osyefjaizyd4`

And hey, [looks like it worked](https://pdsls.dev/at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.document/3mdbvp5q2kz2l)!

For the curious my final json doc was:

```json
{
	"$type": "site.standard.document",
	"publishedAt": "2024-06-08T10:00:00.000Z",
	"site": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.publication/3mbrgnnqzrr2q",
	"path": "/essays/the-internet-is-a-series-of-webs/",
	"title": "The Internet is a Series of Webs",
	"description": "The fate of the open web is inextricable from the other ways our world is in crisis. What can we do about it?",
	"coverImage": {
		"$type": "blob",
		"ref": {
			"$link": "bafkreig2247wcpqjkqy2ukjh4gjyqhpl32kg3pva4x55npjmuh4joeware"
		},
		"mimeType": "image/jpeg",
		"size": 347901
  	},
	"textContent": "<textContent>",
	"content": {
		"$type": "site.standard.content.markdown",
		"text": "<markdown here>",
		"version": "1.0"
	},
	"bskyPostRef": {
		"$type": "com.atproto.repo.strongRef",
		"uri": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/app.bsky.feed.post/3kulbtuuixs27",
		"cid": "bafyreigh7yods3ndrmqeq55cjisda6wi34swt7s6kkduwcotkgq5g5y2oe"
	},
	"tags": ["IndieWeb", "Tech", "The Long Next", "series:The Wild Web"],
	"updatedAt":"2024-06-08T10:30:00.000Z"

}
```
