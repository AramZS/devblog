---
title: Context Center Timelines - Day 20 - Liveblog Schema Metadata and SEO and Image fixes.
description: "Meta for metadata."
date: 2023-02-20 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
  - SEO
  - JS
  - SchemaDotOrg
  - metadata
  - Build Tasks
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
- [ ] Support a counter that can increment depending on where you are on the timeline.
- [ ] Generate QR codes / Stickers for each timeline
- [ ] /raw/md returns a raw version of a topic (in markdown)
- [ ] /raw/md includes a YAML header with relevant information
- [ ] /raw/json returns a JSON version of a topic
- [ ] /feed/ returns a latest links feed of a topic
- [ ] RSS feed of links
- [ ] RSS feed of new links per topic / timeline
- [ ] Support a header image.

## Day 20

Ok, I need to pull the raw version (markdown) of the post text in for the JSON-LD. I think I've got it working with `timelineItem.template.frontMatter.content`.

`git commit -am "Timeline JSON LD working for overall timelines."`

Now that the basics are there, let's take a larger more detailed block and we can put the new details into it via Nunjucks `extends` method.

Before I test this out I'll switch my methodology around images, only create them now where they don't already exist.

Oops, I need to resolve something when the image to-create queue is zeroed out or the build won't resolve. I can't leave the promise un-resolved.

`git commit -am "Fix timeline and timeline image generation"`

I need to have an object for single pages now.

I gotta say, as usual, Nunjucks isn't doing great with formatting. I should likely figure out a switch over to using JS to generate my templates instead of Nunjucks, at least for JSON-LD where these are JSON objects anyway.

This is pretty straightforward, except for the `isPartOf` block which needs to refer back to the timeline, not the site. I'll need to pass the `url` from the timeline obj into the template.

It works! I think I'm good on metadata for now!

Huh, wait, I am seeing an issue.

Why doesn't my `page.url` match with the URL I can access it on? There's two URLs for this?

`http://localhost/timeline/covid/new-omicron-variant-ba2121-has-taken-over-massachusetts-heres-what-you-need-know/`

and

`http://localhost/timeline/covid/new-omicron-variant-ba2121-has-taken-over-massachusetts-heres-what-you-need-know/`

Something is wonky here. Ok, let's save place before digging into it.

`git commit -am "Setting up standalone item meta"`
