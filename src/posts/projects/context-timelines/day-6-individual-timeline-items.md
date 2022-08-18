---
title: Context Center Timelines - Day 6 - Combining Timeline data with individual Timeline items
description: "I need to combine data from one Eleventy collection with another, but without creating an additional collection."
date: 2022-08-17 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - Context
  - Nunjucks
  - WiP
  - JS
  - Data Cascade
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

## Day 6

Now that I've extracted the shared components betweeen the overall timeline page and the potential individual item pages I need to set up the indiviual timeline pages.

I'll need to set up a way to query the other pages so that they can be populated into the individual timeline pages, but that means getting the overall timeline object, and all its info, into the individual timeline pages. I'll have to do this when setting up the collection. But the collection is pre-created by the JSON at the level of each folder. I'll need to figure out a way to either not do that or to enhance the collection.

I tried setting up a new collection, but the existing collection formed by the setup of folders inside `src` is still activating. I could move it outside of the src folder, but I don't like that idea and it doesn't make a lot of sense. I could use `eleventyExcludeFromCollections: true` to remove it from the collections system and add it in manually, but I don't like that approach at all.

As far as I can tell, there's [no way](https://www.11ty.dev/docs/collections/#advanced-custom-filtering-and-sorting) to 'enhance' a preexisting collection?

Ok, I tried a few ways around it and I think the best approach here is to instead add the timelines' data to the global site configuration object. I can then pull it during the build process executed at the template level for eleventyComputer data. For better or worse this is a function that is only available at later versions of Eleventy so this will lock the plugin to those versions.

```js
eleventyConfig.addGlobalData(
	"globalTimelines",
	timelines.reduce((previousValue, currentValue) => {
		//console.log("reduce", previousValue, currentValue);
		previousValue[currentValue.timeline] = currentValue;
		return previousValue;
	}, {})
);
```

`git commit -am "Setting up a new timeline and getting the data from individual timelines on the global object"`

