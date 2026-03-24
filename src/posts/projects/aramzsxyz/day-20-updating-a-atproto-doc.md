---
title: XYZ Site - Day 20 - Publish a Lexicon and Update a Markdown Post in ATProto
description: "Getting a test blog post in my PDS with a new Lexicon, newly published"
date: 2026-03-23 21:01:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - Social Media
  - ATProto
  - ATmosphere
  - decentralization
  - Markdown
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

## Day 20

I ended up getting into the question of how to put markdown from a post in the ATmosphere and in a Standard.Site document. [As a result I built my own little Lexicon to support markdown in ATProt](https://markpub.at/). Hopefully, people will like it and use it!

To test it out, let's try putting my own test post in that Lexicon and also update my old post.

I'm on a different computer, so we'll start by getting the record:

`goat get at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.document/3mdbvp5q2kz2l > ~/path/scrap/3mdbvp5q2kz2l.json`

Great, now I need to swap out my `"$type": "site.standard.content.markdown",` object (which doesn't exist and could be overwritten) with my newly created object. I haven't published the lexicon yet, this will be its first test.

The resulting file contents is:

```json
{
  "$type": "site.standard.document",
  "bskyPostRef": {
    "$type": "com.atproto.repo.strongRef",
    "cid": "bafyreigh7yods3ndrmqeq55cjisda6wi34swt7s6kkduwcotkgq5g5y2oe",
    "uri": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/app.bsky.feed.post/3kulbtuuixs27"
  },
  "content": {
	"$type": "at.markpub.markdown",
	"text": {
		"$type": "at.markpub.text",
		"flavor": "commonmark",
		"renderingRules": "markdown-it",
		"markdown": "[...]"
	},
    "version": "1.0"
  },
  "coverImage": {
    "$type": "blob",
    "ref": {
      "$link": "bafkreig2247wcpqjkqy2ukjh4gjyqhpl32kg3pva4x55npjmuh4joeware"
    },
    "mimeType": "image/jpeg",
    "size": 347901
  },
  "description": "The fate of the open web is inextricable from the other ways our world is in crisis. What can we do about it?",
  "path": "/essays/the-internet-is-a-series-of-webs/",
  "publishedAt": "2024-06-08T10:00:00.000Z",
  "site": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.publication/3mbrgnnqzrr2q",
  "tags": [
    "IndieWeb",
    "Tech",
    "The Long Next",
    "series:The Wild Web"
  ],
  "textContent": "[...]",
  "title": "The Internet is a Series of Webs",
  "updatedAt": "2024-06-08T10:30:00.000Z"
}

```

Ok, basic update to the JSON time. I was able to validate it [with tools.slices.network](https://tools.slices.network/lexicon-validator) and it looks ready to go.

`goat record update 3mdbvp5q2kz2l.json --rkey 3mdbvp5q2kz2l --no-validate`

And hey, it works!

### Publishing the Lexicon

So now I'm going to [publish this lexicon](https://atproto.com/guides/publishing-lexicons)! Let's give it a try. I'm also looking at [the guide here](https://lexicon.garden/help/adding-lexicons). First I need to put it into the right folder so goat can pick it up.

Hmm `goat lex publish text.json` inside the correct folder doesn't work. I got:

`WARN skipping NSID pattern which did not resolve group=at.markpub.`

I think I screwed up the redirects file I sent to Netlify. I also need to [create the TXT records for the NSID](https://atproto.com/specs/lexicon#lexicon-publication-and-resolution). Let's try that again.

Ok, it doesn't like that I don't have a max-length on my strings, but it doesn't require it! Looks like I got all my main lexicons out! I am trying to get the facets out too, but it looks like there is an issue.

I tried manually transforming one to match more closely the `app.bsky.richtext.facet` lexicon:

```json
{
	"lexicon": 1,
	"id": "at.markpub.facets.baseBlocks",
	"defs": {
		"byteSlice": {
			"description": "Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode codepoints for string slice indexing; in these languages, convert to byte arrays before working with facets.",
			"properties": {
				"byteEnd": {
					"minimum": 0,
					"type": "integer"
				},
				"byteStart": {
					"minimum": 0,
					"type": "integer"
				}
			},
			"required": [
				"byteStart",
				"byteEnd"
			],
			"type": "object"
		},
		"horizontalRule": {
			"description": "Place an `&lt;hr&gt;` element at the provided byte index.",
			"type": "object",
			"properties": {
				"required": []
			}
		},
		"yaml-front-matter": {
			"description": "Identify a block of front matter at the top of the Markdown block. It is expected that this has a byteStart and byteEnd.",
			"type": "object",
			"properties": {
				"required": []
			}
		},
		"raw": {
			"description": "Place raw text at the provided byte index. This is a powerful escape hatch for anything that can't be achieved with the other facet features, but use it with caution as it can easily break things if used incorrectly. Do not expect systems to render it.",
			"type": "object",
			"properties": {
				"required": []
			}
		},
		"main": {
			"type": "object",
			"description": "A base block facet that can be used for a variety of purposes. It is expected to have a byteStart and byteEnd to specify the range of text it applies to, but otherwise has no required properties.",
			"properties": {
				"features": {
					"items": {
						"refs": [
							"#raw",
							"#horizontalRule",
							"#yaml-front-matter"
						],
						"type": "union"
					},
					"type": "array"
				}
			},
			"index": {
				"ref": "#byteSlice",
				"type": "ref"
			},
			"required": [
				"index",
				"features"
			]
		}
	}
}
```

But it still didn't work! Hmmm, I'll have to check in about what to do next, but with the main lexicons published for putting Markdown on a PDS, I'm good to go for next steps. I'll try for getting the facets published later.

[You can see for yourself that the new Lexicons are published to the markpub.at PDS](https://pdsls.dev/at://did:plc:kfxbexqtvw76572grhv2f3on/com.atproto.lexicon.schema)!
