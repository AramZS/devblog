---
title: Context Center Timelines - Day 22 - Test it to death
description: "Let's try the timeline plugin using a new site."
date: 2023-08-13 22:59:43.10 -4
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

## Day 22

Ok, I want to try and [set up a new site](https://github.com/AramZS/politicians-center) with the Timelinety plugin. I've been able to get it mostly working, but there is a lot of extra setup. I want to see if I can make time-to-start shorter by incorporating more initial templates in the plugin itself.

Right now, the user who wants to create a site with Timelinety has to do so by creating at least 4 pages outside of the actual timeline items.

The question is, can I add additional input directories to the Eleventy config?

Oh, [looks like... no](https://github.com/11ty/eleventy/issues/2353). I can add the files maybe? Can I get inputs and outputs for Eleventy in the plugin? [I think so](https://github.com/11ty/eleventy/discussions/2483)!

Ok, so I can set it up to copy over the setup files. I think this will work:

```js
if (pluginConfig.addBaseFiles) {
	eleventyConfig.on("eleventy.before", () => {
		let copyFileTo = path.normalize(path.join(process.cwd(), "src"));
		if (typeof pluginConfig.addBaseFiles == "string") {
			copyFileTo = pluginConfig.addBaseFiles;
		} else {
			copyFileTo = path.normalize(
				path.join(process.cwd(), eleventyConfig.dir.input)
			);
		}
		const copyFromPath = path.normalize(
			path.join(__dirname, "src/pages")
		);
		[
			"timeline.md",
			"timelines.md",
			"timeline-endpoints.md",
			"timeline-pages.md",
		].forEach((file) => {
			const timelineMDFile = path.join(copyFromPath, file);
			const targetMDFile = path.join(copyFileTo, file);

			if (!fs.existsSync(targetMDFile)) {
				console.log(
					`Eleventy copy from ${timelineMDFile} to ${targetMDFile}`
				);
				console.log("File does not already exist, copy it over");
				fs.copyFileSync(
					timelineMDFile,
					targetMDFile,
					fs.constants.COPYFILE_EXCL
				);
			}
		});
	});
}
```

I think I want to make sure the file copy happens before the build. I can use `eleventyConfig.on('eleventy.before', () => ());` for that.

Ok, that copies it over. Does it work with the build timing? Yes, it does! [Awesome](https://github.com/AramZS/politicians-center/commit/fe6cd0f2b2a15e0c10e91ff006e7b583d71ee361).

Ok. Now I need to make sure that I actually have the minimum timeline CSS files.

Ok, the stuff in `template-timeline.sass` is good to do without.

I don't need my `reset.sass`.

Ok, looks like it is working.

I think things look like they are working, but there is a problem with the JSON response from Timelinety. It isn't working when there is no content value for a Timeline entry. I'll need to add another filter I think. Oh no, I need a different thing, [I need a false state](https://github.com/AramZS/politicians-center/commit/93af4bcd2184e662f59b46e9a7b5bde8e7b6c9c5).

Ok, I think this is ready to be a package now. [Let's set up a repo](https://github.com/AramZS/timelinety).

We add the `.npmignore` file. Then we can publish it.

[It is out as a package](https://www.npmjs.com/package/timelinety)!

Ok, let's try switching to using this package in the new site.

It mostly seems to work. The one downside is that I can't use `extends` the way I had hoped. I end up having to use {%raw%}{% extends "../../node_modules/timelinety/src/layouts/timeline-wrapper.njk" %}{% endraw %}. `extends` doesn't use the 11ty layout alias systems so I can't use it exactly as I had hoped. But other than that, it works!
