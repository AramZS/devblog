---
title: Context Center Timelines - Day 4 - Making Template Elements Ready to Use for Other Templates.
description: "Setting up better versions of the timeline templates"
date: 2022-08-08 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - Context
  - Nunjucks
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

## Day 4

Ok, so first step is to separate out some of the basics of each template so that they can be reused.

`git commit -am "Setting up timeline shared Nunjucks components"`

This is the first step towards getting individual timeline item pages working, making sure I can reuse them easily and maintain them easily.

Next I need to make sure those elements have everything in place and can be generalized properly out to individual pages.

Looks like the filter isn't working as well as I'd hoped. For one thing I'd like to make it so tags naturally flow into filters. That's going to mean further changing the build of the timeline object.

First, I'll pull the Timeline object:

```javascript
let filterSet = [...timelineData.filters];
```

I might want to have filters set explicitly instead of just tags, so let's support both.

```javascript
if (mdObject.data.hasOwnProperty("filters")) {
	filterSet = filterSet.concat(mdObject.data.filters);
} else {
	filterSet = filterSet.concat(mdObject.data.tags);
}
```

This will let me set filters explicitly on a timeline item object, but otherwise default to tags.

Next, there may be some tags or filters I want to exclude without explicitly setting up the filter argument on a timeline object. Let's create a timeline-level set of exclusions for filter names.

```javascript
if (timelineData.hasOwnProperty("doNotUseFilters")) {
	filterSet = filterSet.filter((el) => {
		return !timelineData.doNotUseFilters.includes(el);
	});
}
```

Ok, that looks good. It's working the way I'd hoped and giving me a lot of options. Only one issue with the timeline pages now, it seems the sort isn't working as I'd precisely hoped. But it should, I'm using the normal date field for these posts.

For tracking when a page was last updated, I added a field - `dateAdded`. That's being used to generate a new template element that says when the page was last updated. That's good and it is working. However, for some reason one of the posts isn't falling into the date sort properly.

...

Ok, I played around with it some more and multiple posts aren't showing up properly in order and I don't know why. I am not sure what the reason was, I had assumed collections sort by date by default... but something in my site was going wrong. It does look like sorting it explicitly seems to fix the problem.

```javascript
timelines.map((timelineObj) => {
  eleventyConfig.addCollection(
  	"timeline-" + timelineObj.timeline,
  	(collection) => {
  		const collectionFiltered = collection
  			.getAll()
  			.filter(
  				(item) => item.data.timeline === timelineObj.timeline
  			);

  		collectionFiltered.sort((a, b) => {
  			if (a.date > b.date) return -1;
  			else if (a.date < b.date) return 1;
  			else return 0;
  		});

  		return collectionFiltered;
  	}
  );
});
```

Good stuff. The ordering is working now.

`git commit -am "Adding new COVID entries for testing"`
