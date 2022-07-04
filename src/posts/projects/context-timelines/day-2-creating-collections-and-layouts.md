---
title: Context Center Timelines - Day 2 - Layouts and Collections
description: "Setting up context-rich timeline collections and layouts"
date: 2022-05-13 22:59:43.10 -4
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

## Bringing over the Template for the Timeline


So I think it won't be so easy to directly port over the code, even if I transform the EJS to Nunjucks. What's worth doing is seeing if I can transform the data approach so it matches the different structure of content I'm trying to do.

I think I can use the Project structures I have in my devblog as a starting point.

I was really hoping that a plugin could come in and establish some template file, but [it looks like that can't be done with a simple template alias](https://github.com/11ty/eleventy/blob/e386ec5f70e08254284e76a41dcbc591762282c8/src/TemplateLayoutPathResolver.js#L79). Instead I'm going to have to set up some way to handle it as a path relative to the site's `_layouts` folder. That's pretty awkward. But I do think I can make it work, especially if I pass in the depth I'll have to traverse the file structure up.

```javascript
	const dirs = __dirname.split(process.cwd());
	const pluginLayoutPath = path.join(
		pluginConfig.layoutFolderDepth,
		dirs[1],
		"src",
		"layouts"
	);
```

Yeah, that is not the easiest, but it does look like it works. Definitely not as intended by Eleventy core, but hey, it works. This gets the template system to traverse up from _layouts in my core site by a `layoutFolderDepth` value of `../../`. It then travels into the plugin parent folder, the plugin, then--internal to the plugin--`src/layouts` where my layout folders are.

Once that file path is in place I can use layout aliases that lead to template files local to my plugin folder, like so:

```javascript
	eleventyConfig.addLayoutAlias(
		"timeline",
		path.join(pluginLayoutPath, "timeline.njk")
	);
	eleventyConfig.addLayoutAlias(
		"timeline-item",
		path.join(pluginLayoutPath, "timeline-item.njk")
	);
```

Nice, that looks good! Now I can just pass in my timelines collection and start building some pages!

Next up, getting those templates actually working.

`git commit -am "Setting up Context Timeline templates and collections"`
