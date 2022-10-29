---
title: Context Center Timelines - Day 10 - Setting up individual timeline items starter pages.
description: "Initial individual pages for expansion."
date: 2022-10-28 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
---

## Project Scope and ToDos

1. Create timeline pages where one can see the whole timeline of a particular event
2. Give timeline items type or category icons so that you can easily scan what is happening.
3. Allow the user to enter the timeline at any individually sharable link of an event and seamlessly scroll up and down

- [ ] Deliver timelines as a plugin that can be extended by other 11ty users
- [ ] Auto-create social-media-ready screenshots of a timeline item
- [ ] Integrate with Contexter to have context-full link cards in the timeline
- [ ] Leverage the Live Blog format of Schema dot org
- [ ] Allow each entry to be its own Markdown file
- [ ] Handle SASS instead of CSS
- [ ] Fast Scroller by Month and Year

## Day 10

Ok, I want to set it up the entry page. I've got the whole page looking like an empty timeline, but I need the individual item filled in.

To do that, I'll need to pull the entry off of the global object. To make it so I can reuse my templates, I'll need to cast the entry into the right object.

I seem to be able to set it up during the Eleventy Computed phase, but placing it on the `entry` object just lets it get overwritten down the line apparently.

Let's try using the `console` filter to see what the object is on the page.

Hmmm it isn't getting overwritten in the template, it's getting overwritten during the eleventyComputed phase by... I think my own changes? I'll have to break the link between the objects. I can cast it to a string and back. Then set the `entry` object at the template level instead.

It looks like this might work? But now I'm getting a new error `Cannot read property 'posts' of undefined` but I don't know where a `posts` property could be coming from.

Huh, looks like it is my debug tool getting empty values. What's happening to my new object.

I can fix that, but when I echo the new object I'm building, I'm getting the overwritten object still. What is happening?

It looks like somehow the object is being overwritten globally. My timeline is no itself broken along with the individual item. But what could be doing that? Why is it only the title?

Ok, let's just create a new object instead of trying to overwrite the built in properties. That seems to work, but I'm still missing some fields.

It means I'm going to have to do some weird extra stuff where I set variables for use in the various reusable template parts. Ok, plenty to do, especially around the `content` property, which acts pretty oddly.

But it does look like it is working!

`git commit -am "Getting standalone timeline item pages working and using variables more actively throughout"`
