---
title: XYZ Site - Day 16 - Publish an article to ATProto.
description: "Put my blog posts in the atmosphere"
date: 2026-01-18 23:01:43.10 -4
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

## Day 16

Ok, I was able to get the site information published!

Next up is pushing a blog post with the format.

`goat account login -u chronotope.aramzs.xyz -p <app password>`

So now we craft a JSON in the correct format for a post. We'll start with [one of my essays](https://aramzs.xyz/essays/the-internet-is-a-series-of-webs/).

If I want to link [my main BlueSky post](https://bsky.app/profile/chronotope.aramzs.xyz/post/3kulbtuuixs27), I need to use a `com.atproto.repo.strongRef` apparently. This is [a standard lexicon](https://github.com/bluesky-social/atproto/blob/main/lexicons/com/atproto/repo/strongRef.json) type.

I can pull it down with `goat lex pull com.atproto.repo.strongRef`.

There doesn't [seem to be a an example of that](https://ufos.microcosm.blue/collection/?nsid=store.lexicon.com.atproto.repo.strongRef)? I guess that makes sense if it isn't an actual object. But [the docs](https://atp.readthedocs.io/en/latest/atproto/atproto_client.models.com.atproto.repo.strong_ref.html) indicate it can just be a string of either a URI or a CID. I could use the URL to the post, but let's do the CID? How does one get the CID? I see it in the metadata on [PDSL](https://pdsls.dev/at://did:plc:t5xmf33p5kqgkbznx22p7d7g/app.bsky.feed.post/3kulbtuuixs27#record). But it isn't in the document or on the goat data. What is a CID anyway? Well [I guess I'll look it up](https://atproto.wiki/en/wiki/reference/identifiers/cid). Not so useful. Looks [like there is a spec though](https://github.com/multiformats/cid).

Seems complicated. I'll just do the URL for now.

Interesting that `accept: [image/*]` is the value for `coverImage`. I don't know what that means? Let's see if we can find some examples. Let's see if we can [find](https://ufos.microcosm.blue/collection/?nsid=site.standard.document) some examples. [Here's a fully formatted one](https://pdsls.dev/at://did:plc:v46ojbiop5ebs5h7gaomixcc/site.standard.document/3mcqr6f5jdg23).

```json
{
  "path": "/a/3mcqr6f5jdg23-hi-from-brookie",
  "site": "at://did:plc:v46ojbiop5ebs5h7gaomixcc/site.standard.publication/3mcqr4rrb7x22",
  "$type": "site.standard.document",
  "title": "Hi from Brookie",
  "content": {
    "$type": "app.offprint.content",
    "items": [
      {
        "$type": "app.offprint.block.imageGrid",
        "images": [
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreihub3ikzctbstjy5e34g4hw2ux7tbryd7cpcqg7fbosaxlicapggu"
              },
              "mimeType": "image/png",
              "size": 13270
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          },
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreib5zrxr33anmw6gxjr5232uo3y324xpizzv7c7433jugllobvulxu"
              },
              "mimeType": "image/png",
              "size": 13325
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          },
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreifyqhedylyfocp3wmn4kcv4fe6b2n7cdpmfs2x2ljvdby64gvirjm"
              },
              "mimeType": "image/png",
              "size": 13358
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          },
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreig2xm6piu7lzclljzyiahowvflajsylasqjtnl26m4mqz7gpwqgwu"
              },
              "mimeType": "image/png",
              "size": 13322
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          }
        ],
        "gridRows": 2,
        "aspectRatio": "mosaic"
      },
      {
        "$type": "app.offprint.block.imageDiff",
        "images": [
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreihub3ikzctbstjy5e34g4hw2ux7tbryd7cpcqg7fbosaxlicapggu"
              },
              "mimeType": "image/png",
              "size": 13270
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          },
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreifyqhedylyfocp3wmn4kcv4fe6b2n7cdpmfs2x2ljvdby64gvirjm"
              },
              "mimeType": "image/png",
              "size": 13358
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          }
        ],
        "labels": [
          "Before",
          "After"
        ],
        "alignment": "center"
      },
      {
        "$type": "app.offprint.block.imageCarousel",
        "images": [
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreihub3ikzctbstjy5e34g4hw2ux7tbryd7cpcqg7fbosaxlicapggu"
              },
              "mimeType": "image/png",
              "size": 13270
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          },
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreib5zrxr33anmw6gxjr5232uo3y324xpizzv7c7433jugllobvulxu"
              },
              "mimeType": "image/png",
              "size": 13325
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          },
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreifyqhedylyfocp3wmn4kcv4fe6b2n7cdpmfs2x2ljvdby64gvirjm"
              },
              "mimeType": "image/png",
              "size": 13358
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          },
          {
            "image": {
              "$type": "blob",
              "ref": {
                "$link": "bafkreig2xm6piu7lzclljzyiahowvflajsylasqjtnl26m4mqz7gpwqgwu"
              },
              "mimeType": "image/png",
              "size": 13322
            },
            "aspectRatio": {
              "width": 480,
              "height": 480
            }
          }
        ],
        "autoplay": false,
        "interval": 3000
      },
      {
        "$type": "app.offprint.block.text",
        "plaintext": "I really like all the image things :) "
      },
      {
        "$type": "app.offprint.block.text",
        "facets": [
          {
            "index": {
              "byteEnd": 8,
              "byteStart": 0
            },
            "features": [
              {
                "did": "did:plc:eob75vcjtmbaef2tn4evc4sl",
                "$type": "app.offprint.richtext.facet#mention",
                "handle": "aka.dad"
              }
            ]
          },
          {
            "index": {
              "byteEnd": 22,
              "byteStart": 9
            },
            "features": [
              {
                "did": "did:plc:pgjkomf37an4czloay5zeth6",
                "$type": "app.offprint.richtext.facet#mention",
                "handle": "offprint.app"
              }
            ]
          },
          {
            "index": {
              "byteEnd": 36,
              "byteStart": 23
            },
            "features": [
              {
                "did": "did:plc:v46ojbiop5ebs5h7gaomixcc",
                "$type": "app.offprint.richtext.facet#mention",
                "handle": "brookie.blog"
              }
            ]
          },
          {
            "index": {
              "byteEnd": 47,
              "byteStart": 37
            },
            "features": [
              {
                "did": "did:plc:revjuqmkvrw6fnkxppqtszpv",
                "$type": "app.offprint.richtext.facet#mention",
                "handle": "pckt.blog"
              }
            ]
          }
        ],
        "plaintext": "@aka.dad @offprint.app @brookie.blog @pckt.blog "
      },
      {
        "$type": "app.offprint.block.text",
        "plaintext": ""
      },
      {
        "$type": "app.offprint.block.callout",
        "emoji": "💡",
        "plaintext": "Good Job Miguel ! "
      },
      {
        "$type": "app.offprint.block.text",
        "plaintext": ""
      },
      {
        "$type": "app.offprint.block.text",
        "plaintext": ""
      }
    ]
  },
  "coverImage": {
    "$type": "blob",
    "ref": {
      "$link": "bafkreif6sve2kjuioifion3apv277sggym4jxhlgrkuyqqxdck7cy7x6c4"
    },
    "mimeType": "image/png",
    "size": 8455
  },
  "description": "brookie from pckt",
  "publishedAt": "2026-01-18T21:08:15-07:00",
  "textContent": "I really like all the image things :) \n@aka.dad @offprint.app @brookie.blog @pckt.blog \n\n💡 Good Job Miguel !"
}
```

It looks like the intended format for that field is:

```json
  "coverImage": {
    "$type": "blob",
    "ref": {
      "$link": "bafkreif6sve2kjuioifion3apv277sggym4jxhlgrkuyqqxdck7cy7x6c4"
    },
    "mimeType": "image/png",
    "size": 8455
  },
```

The indication here is that you'd push a blob of image data to the PDS it looks like? Let's [find the documentation](https://atproto.com/specs/blob). Ok, interesting. Something to figure out later, it is getting late now.

Ok, so here's the formed document so far:

```json
{
	"$type": "site.standard.document",
	"publishedAt": "2024-06-08T10:00:00.000Z",
	"site": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/site.standard.publication/3mbrgnnqzrr2q",
	"path": "/essays/the-internet-is-a-series-of-webs/",
	"title": "The Internet is a Series of Webs",
	"description": "The fate of the open web is inextricable from the other ways our world is in crisis. What can we do about it?",
	"textContent": "",
	"bskyPostRef": "https://bsky.app/profile/chronotope.aramzs.xyz/post/3kulbtuuixs27",
	"tags": ["IndieWeb", "Tech", "The Long Next"],
	"updatedAt":"2024-06-08T10:30:00.000Z"

}
```

Getting there!
