---
title: XYZ Site - Day 18 - What does an ATProto update look like.
description: "Getting my blog posts set up in the atmosphere"
date: 2026-01-25 14:01:43.10 -4
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

## Day 18

Ok, that worked, what does an article update look like?

I made an edit to my one post on Leaflet. Looks like it just adjusts the record in place, which is nice. Updates are pretty easy then.

Ok, so then how to integrate this with my publishing flow? Let's [take a look at a basic authenticated flow from BlueSky](https://github.com/bluesky-social/cookbook/blob/main/ts-bot/index.ts). Looks like [there is also some ways to reference standard types for standard.site](https://tangled.org/mary.my.id/atcute/tree/trunk/packages/definitions/standard-site). This uses [the atcute package](https://tangled.org/mary.my.id/atcute/tree/trunk/packages/definitions/atproto), which seems to be well respected.

There seems to be [an interesting example of comments out there](https://micahcantor.com/blog/bluesky-comment-section.html), but that doesn't post anything.

There's also [an interesting exploration of upserting records](https://marvins-guide.leaflet.pub/3mckm76mfws2h).

A [good basic example here as well](https://tangled.org/baileytownsend.dev/upsert-example/blob/main/upsertFullExample.js).

To make this flexible, we should make it as it's own extension for static sites. Let's try to make a basic version.

First, I want to get used to tangled, [so I'll set the repo up on there](https://tangled.org/did:plc:t5xmf33p5kqgkbznx22p7d7g/marksky-pub).

I'm pretty sure my PDS host would be `https://bsky.social` right?

I can start with the [example](https://tangled.org/baileytownsend.dev/upsert-example/blob/main/upsertFullExample.js). I'll reorg it a little into the pieces I need as a start.

Ok, a nice place to pick up later from.
