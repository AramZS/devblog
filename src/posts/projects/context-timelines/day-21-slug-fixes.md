---
title: Context Center Timelines - Day 21 - Slug Fixes.
description: "One slug to rule them, one url path to bind them, one permalink to find them all and in the darkness bind them."
date: 2023-02-20 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
  - SEO
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

## Day 21

Ok, so it looks like it is just the skiplink slug that is inconsistent with the rest of the site. But just in case, I'm going to do my own slug function and run all the timeline stuff through that. I can separate it out into a file and import it everywhere I need it and as a template filter.

`git commit -am "Fixing to a consistent slugging process"`

