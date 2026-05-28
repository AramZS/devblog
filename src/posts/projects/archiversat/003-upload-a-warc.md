---
title: Getting a WARC blob online to use.
description: "Make archives decentralized"
date: 2026-05-24 21:30:43.10 -4
tags:
  - ATProto
  - ATmosphere
  - WARC
  - WARCs
  - BlueSky
  - decentralization
  - archives
  - archiving
  - WiP
---
## Project Scope and ToDos

1. Log in to ATProto
2. Post archives to a PDS.

- [x] Remember my login.
- [ ] List records
- [ ] Upload a warcz or warc blob
- [ ] List records with links to uploaded blobs.
- [ ] Load the archive viewer to allow the user to review their own archives.

## Day 3

I want to do a test run putting a WARC file on my PDS. To do that, I'll need to actually put together a Lexicon. To start, let's sketch out the basics. I'm going to use [site.standard.document](https://standard.site/) for inspiration.

```json
{
  "id": "at.archiving.session",
  "lexicon": 1,
  "defs": {
    "main": {
      "description": "A document record representing an archiving session recorded as a WARC or WARCZ.",
      "key": "tid",
      "record": {
        "properties": {
          "bskyPostRef": {
            "description": "Strong reference to a Bluesky post. Useful to keep track of comments off-platform. Optional.",
            "ref": "com.atproto.repo.strongRef",
            "type": "ref"
          },
          "coverImage": {
            "accept": [
              "image/*"
            ],
            "description": "Image to used for thumbnail or cover image. Less than 1MB is size.",
            "maxSize": 1000000,
            "type": "blob"
          },
          "description": {
            "description": "A brief description or excerpt from the archive.",
            "maxGraphemes": 3000,
            "maxLength": 30000,
            "type": "string"
          },
          "links": {
            "description": "Array of values describing relationships between this document and external resources",
            "refs": [],
            "type": "union"
          },
          "archiveDateCreatedAt": {
            "description": "Timestamp of the when the archive was created by accessing the original resources.",
            "format": "datetime",
            "type": "string"
          },
          "sameAs": {
            "description": "Points to the records (at://) or published web page urls (https://) that represent the original documents that this archive covers. Avoid trailing slashes.",
            "items": {
              "maxGraphemes": 128,
              "maxLength": 1280,
  			  "format": "uri",
			  "type": "string"
            },
            "type": "array"
          },
          "tags": {
            "description": "Array of strings used to tag or categorize the archive. Avoid prepending tags with hashtags.",
            "items": {
              "maxGraphemes": 128,
              "maxLength": 1280,
              "type": "string"
            },
            "type": "array"
          },
          "title": {
            "description": "Title of the archive.",
            "maxGraphemes": 500,
            "maxLength": 5000,
            "type": "string"
          },
          "uploadedAt": {
            "description": "Timestamp of the original upload",
            "format": "datetime",
            "type": "string"
          }
        },
        "required": [
          "archiveDateCreatedAt",
          "title",
          "sameAs"
        ],
        "type": "object"
      },
      "type": "record"
    }
  }
}

```

This is a start, but I need to set up the property for the uploaded archive file. That means I'll need the mime-type. [For WARC files it will be](https://en.wikipedia.org/wiki/WARC_(file_format)) `application/warc`. For the compressed files [it looks like the right value](https://specs.webrecorder.net/wacz/1.1.1/#zip-format-file-extension) is `application/wacz`.

I'll also need to set a maximum file size that respects the PDS maximum file size. [That is 50mb](https://docs.bsky.app/docs/advanced-guides/rate-limits). That's pretty small. I may want to set up a way to have a session associated in a series of files, that would be another lexicon though. Let's go one at a time. I'll add the property:

```json
"archiveFile": {
	"accept": [
		"application/warc",
		"application/wacz"
	],
	"description": "Blob that stores the warc or wacz archive on your PDS. Less than 50MB in size.",
	"maxSize": 52428800,
	"type": "blob"
},
```

Looking around, it looks like people also store files at `warc.gz`.

So I'll add the `application/warc+gzip` mime type.

`git commit -am "Adding archiving session lexicon and the document.standard.site lexicon for reference"`

Ok, I've got a basic record. Let's try publishing:

`goat account login -u chronotope.aramzs.xyz -p <app password here>`

Now I can upload a basic blob from [Markpub.at](https://markpub.at) as an archive as a file:

`goat blob upload ./static/markpubat.wacz`

That gives me back an ID:

```json
{
  "$type": "blob",
  "ref": {
    "$link": "bafkreidzuafvc4jctjvmsgls7rm6ugskdpv3i45ag46ynr3p52tdhc24e4"
  },
  "mimeType": "application/zip",
  "size": 1564464
}
```

Now I can use that to build the record I want. I should add zip as a valid mime type that will work as well.

So I went ahead and used [ATProto.tools](https://atproto.tools/lexicons) Lexicon validator to check my lexicon works (it does) and then validate the following record:

```json
{
	"$type": "at.archiving.session",
	"archiveFile": {
		"$type": "blob",
		"ref": {
		"$link": "bafkreidzuafvc4jctjvmsgls7rm6ugskdpv3i45ag46ynr3p52tdhc24e4"
		},
		"mimeType": "application/zip",
		"size": 1564464
  	},
	"description": "Homepage for ATProto Lexicon for Markdown",
	"sameAs": ["https://markpub.at"],
	"tags": [
		"ATmosphere",
		"ATProto",
		"Decentralization",
    "Code"
	],
	"title": "Markpub.at",
	"uploadedAt": "2026-05-24T21:30:00.000Z",
  	"archiveDateCreatedAt": "2026-05-24T21:00:00.000Z"
}
```

I haven't published a Lexicon yet, but let's just get that record up there:

`goat record create ./static/markpub-archive.json --no-validate`

Results in:

`at://did:plc:t5xmf33p5kqgkbznx22p7d7g/at.archiving.session/3mmncuczxxi2p        bafyreicgr6a24h4xodl62cxrn4eoipgu7oux75x5daos7dey2ay4smrsx4`

Great, [it's up there](https://pdsls.dev/at://did:plc:t5xmf33p5kqgkbznx22p7d7g/at.archiving.session/3mmncuczxxi2p)!

`git commit -am "Setting up lexicon and test file to publish"`
