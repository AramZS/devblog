---
title: Context Center Timelines - Day 19 - Setting up data for JSON LD.
description: "Meta for metadata."
date: 2023-02-01 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
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
- [ ] Generate QR codes / Stickers for each timeline

## Day 19

Ok, lets start figuring out what the metadata structure is that is needed for the timeline schema.

I have a bunch of these values set already, though they may not be passed through to the template.

But I might not have all of them.

I'll start with `timelineObj` as my new template layout uses that object pretty effectively, even if I'll have to enhance it. But it looks like it doesn't have all the data I need.

I'll need to calculate a value for `coverageStartTime`. That should be easy enough, I can just reverse the calculation for `lastUpdatedPost` and make sure it doesn't fall back to zero.

There are some places where I might want to have fields in the future but keep fallbacks to standard values. For those I'll use the Nunjucks construction of `{{ X or Y }}` which will hopefully work without issue.

Then comes the hard part, I need to play out the timeline entries into the `liveBlogUpdate` array.

Some of this is pretty straightforward, but I am going to have some trailing commas that are not how they are supposed to be. Is that going to be a problem? Probably! I can use the same `last` technique I used when generating the JSON of timelines earlier.

But wait... I don't think I can compare complex objects like this?

```njk
{% if entry !== collections[timelineSlug] | sort | last %},{% endif %}
```

Welllllll, let's try next time.

`git commit -am "Setting up timeline metadata"`
