---
title: XYZ Site - Day 15 - Publish to ATProto.
description: "Put my blog posts in the atmosphere"
date: 2026-01-08 17:59:43.10 -4
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

## Day 15

[Looks cool](https://octet-stream.net/b/scb/2026-01-05-this-blog-is-on-atproto.html?__readwiseLocation=). Let's [try it like some others have](https://ufos.microcosm.blue/collection/?nsid=site.standard.document). Going to try to post blog entries to my PDS.

1 - let's do some testing.

`brew install goat`

`goat account login -u chronotope.aramzs.xyz -p <app password here>`

Verify resolution:

`goat resolve wyden.senate.gov` works.

`goat bsky post "A quick test"` works. I get back:

```bash
at://did:plc:t5xmf33p5kqgkbznx22p7d7g/app.bsky.feed.post/3mbpifihvqm2q	bafyreih7zufh4rezvg6h766djnptbaizm2thiuxx4chkzql7wmvdcskcwm
view post at: https://bsky.app/profile/did:plc:t5xmf33p5kqgkbznx22p7d7g/post/3mbpifihvqm2q
```

Can I then retrieve it?

```bash
goat get at://did:plc:t5xmf33p5kqgkbznx22p7d7g/app.bsky.feed.post/3mbpifihvqm2q
{
  "$type": "app.bsky.feed.post",
  "createdAt": "2026-01-05T22:29:16.86Z",
  "text": "A quick test"
}
```

Yup!

Let's [publish a test on Leaflet.pub](https://chronotope.leaflet.pub/3mbpjrfwqm22y) to see [what it looks like on my PDS](https://pdsls.dev/at://did:plc:t5xmf33p5kqgkbznx22p7d7g/pub.leaflet.document/3mbpjrfwqm22y#record):

```yaml
tags: "test"
$type: "pub.leaflet.document"
pages:
  - id: "019b729c-2664-7ddb-9229-31341239825f"
    $type: "pub.leaflet.pages.linearDocument"
	blocks:
	  - $type: "pub.leaflet.pages.linearDocument#block"
		block:
		  $type: "pub.leaflet.blocks.text"
		  facets:
		  plaintext: "This is a test on Leaflet to see how the record looks. "
title: "A quick test post on Leaflet"
author: "did:plc:t5xmf33p5kqgkbznx22p7d7g"
postRef:
  cid: "bafyreic44p5jnfa2eq2zdq6pwnrdi2e4nzhiv3ebd2lhmbo2oxcdszm364"
  uri: "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/app.bsky.feed.post/3mbpjrkknys2y"
  commit:
	cid: "bafyreif3xtgrmgqrdoizotxpyo2ryiqfqwwak6c2lm2jxwrx3xz4icmajy"
	rev: "3mbpjrknvxl26"
  validationStatus: "valid"
description: "Giving this a try"
publication: "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/pub.leaflet.publication/3makguj34cs2t"
publishedAt: "2026-01-05T22:53:50.696Z"
```

or in JSON

```json
{
  "$type": "app.bsky.feed.post",
  "createdAt": "2026-01-05T22:53:55.543Z",
  "embed": {
    "$type": "app.bsky.embed.external",
    "external": {
      "description": "Giving this a try",
      "thumb": {
        "$type": "blob",
        "ref": {
          "$link": "bafkreiblxmhoozultlvi5lx6j3lcvcyfqfiructung6fnkrl4yklacqg5e"
        },
        "mimeType": "image/webp",
        "size": 19322
      },
      "title": "A quick test post on Leaflet",
      "uri": "https://chronotope.leaflet.pub/3mbpjrfwqm22y"
    }
  },
  "facets": [],
  "text": ""
}
```

Looks like it hasn't been implimented in leaflet yet? Ok, let's try [Thomas's top blog example](https://pdsls.dev/at://did:plc:txurc6ueald5d7462bpvzdby/site.standard.document/3mbnqpz3ziw2v#record):

`goat record get at://did:plc:txurc6ueald5d7462bpvzdby/site.standard.publication/3mbnlfyowxg2v`

and we get a response that describes the publication:

```json
{
  "$type": "site.standard.publication",
  "description": "Keeping up appearances as a professional software developer who has meaningful things to say about computers, programming, and the industry.",
  "name": "Serious Computer Business",
  "url": "https://octet-stream.net/b/scb"
}
```

And a post: `goat record get at://did:plc:txurc6ueald5d7462bpvzdby/site.standard.document/3mbnqpz3ziw2v`

```json
{
  "$type": "site.standard.document",
  "path": "/2026-01-03-including-rust-in-an-xcode-project-with-pointer-auth-arm64e.html",
  "publishedAt": "2026-01-03T06:46:21Z",
  "site": "at://did:plc:txurc6ueald5d7462bpvzdby/site.standard.publication/3mbnlfyowxg2v",
  "title": "Including Rust in an Xcode project with Pointer Authentication (arm64e)"
}
```

Ok, let's try to make one for this publication? First we'll make a JSON file.

```json
{
	"$type": "site.standard.publication",
	"description": "This is my outpost for documenting and live blogging my work on various side projects. Occasionally it is also the place I write about stuff I learned or useful information. Sometimes it can also be a place for rough writing that is dev-adjacent but doesn't really make sense for my main blog. \n\nTechnology won't save the world, but you can.",
	"name": "Fight With Tools: A Dev Blog",
	"url": "https://fightwithtools.dev"
}
```

Huh. How do I do a linebreak? `\n\n` according to BlueSky.

Huh.

```bash
goat record create fightwithtools-publication.json
error: API request failed (HTTP 400): InvalidRequest: Lexicon not found: lex:site.standard.publication
```

Let's get the Lexicons

```bash
goat lex pull site.standard.publication
goat lex pull site.standard.document
```

Ooops they seem to fail lint:

```bash
goat lex lint
 🟡 lexicons/site/standard/document.json
    [missing-primary-description]: primary type missing a description
    [unlimited-string]: no max length
    [unlimited-string]: no max length
 🟡 lexicons/site/standard/publication.json
    [missing-primary-description]: primary type missing a description
error: linting issues detected
```

It seems this is blocking me from publishing.

Ah, [I got some advice](https://bsky.app/profile/brookie.blog/post/3mbpw3wzu7k2o), and it turns out for the first entry of a lexicon on my PDS I have to not verify the Lexicon.

`goat record create fightwithtools-publication.json --no-validate`
