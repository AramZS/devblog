---
title: Context Center Timelines - Day 3 - Integrate Contexter and add data to the timeline page.
description: "Setting up context-rich timeline collections and layouts now with archiving and more metadata"
date: 2022-07-25 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - Context
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

## Day 3

Ok, after playing around with the CSS for a bit I think I've got the basic layout working. Now I need to get the metadata passed on to the page. First I should take the JSON file and merge it in to the timeline object I'm creating.

I've been passing this data in through the MD file, but I should be able to handle it in the NJK file with a `js` header.

Previously I've been setting up self executing functions, however, it looks like I no longer need to do that. And if I pass these functions inside the `eleventyComputed` object I'll get access to the global data.

I was able to verify it using a custom function that I passed into there. It looks like this.

```javascript
{
    eleventyComputed: {
        applyThis: {
            timelineCheck: function(siteContext){
                if (siteContext){
                    console.log(siteContext.timeline, "Global check")
                }
            },
        },
        title: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.title

            return '';
        },
        description: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.description

            return '';
        },
        tags: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.tags

            return [];
        },
        categories: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.categories

            return '';
        },
        filters: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.filters

            return [];
        },
        date: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.date

            return "Last Modified";
        },
        header: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.header

            return [];
        },
        color: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.color

            return 'grey';
        },
        shortdate: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.shortdate

            return false;
        },
    }
}
```

Great! I also want the ability to support the `links` field for timeline objects, to give me the ability to set links on the timeline. That means passing more complex objects into the YAML head data. How do I do that? I tried passing in an actual object but that doesn't work.

It wasn't obvious to me, but apparently how you handle deeper YAML objects is by passing a blank indented hyphen and indenting the properties beneath that. If you want to pass an object into an object, this is how:

```yaml
links:
  -
    href: "https://www.bostonglobe.com/2022/05/13/metro/new-omicron-variant-ba2121-has-taken-over-massachusetts-heres-what-you-need-know/",
    linkText: "A new Omicron variant, BA.2.12.1, has taken over in Massachusetts. Here’s what you need to know.",
    extraText: "BA.2.12.1 has exploded"
```

Notably this structure needs to be all spaces, no tabs. Two spaces before the first hyphen and 4 before each of the properties.

I also want to get it working with my contexter plugin, so I'm going to set up some extra styles to get a start at integrating it and then get the layout type integrated.

`git commit -am "Timeline improvements plus contexter integration."`
