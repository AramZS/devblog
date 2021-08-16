---
title: Hello World Devblog - Pt. 21
subtitle: Getting this dev blog running
description: "More devblog"
project: Dev Blog
date: 2021-08-03 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - Github Actions
  - WiP
  - GPC
---


1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [x] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [ ] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [ ] Show the latest post below the site intro on the homepage.

- [ ] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with l[inks to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [ ] Create Next Day/Previous Day links on each post

- [ ] Tags should be in the sidebar of articles and link to tag pages

- [ ] Create a skiplink for the todo section (or would this be better served with the ToC plugin?)

## Day 21

Hmm I still want to paginate my tags pages. I originally thought that I could just add to the number of `size` in the YAML front matter. But of course that doesn't work, the template doesn't have knowledge of anything other than the list of tags at that point.

So we need to pass in a set of tags with the actual posts mapped per-tag. There doesn't seem to be a built in way to do this, so I need to adjust the `tagList` collection. I need to make it return an object where each tag is a top-level property that points to an array of posts.

Previously I had:

```javascript
collection.getAll().forEach((item) => {
	(item.data.tags || []).forEach((tag) => tagSet.add(tag));
```

But now lets switch it around.

```javascript
function filterTagList(tags) {
	return (tags || []).filter(
		(tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
	);
}

collection.getAll().forEach((item) => {
			filterTagList(item.data.tags).forEach((tag) => {
				if (tagSet.hasOwnProperty(tag)) {
					tagSet[tag].push(item);
				} else {
					tagSet[tag] = new Set();
					tagSet[tag].push(item);
				}
			});
		});
		return tagSet;
```

Hmmm, not the most efficient, we're doing the same line of code twice. Let's simplify.

```javascript
filterTagList(item.data.tags).forEach((tag) => {
  if (!tagSet.hasOwnProperty(tag)) {
  	tagSet[tag] = new Set();
  }
  tagSet[tag].push(item);
});
```

Ok, let's see if this works. Should be good, but how do I get the actual items? I'll have to change the template. Hmm, it looks like there isn't really a way to access the key in the YAML arguments. I'll have to add that too somehow?

Note the use of Set here, to keep posts unique.

Oops forgot that `Set` uses `add` not `push` for adding to the set.

Hmm. Better.

Now I'll have to adjust the pagination permalink it looks like to resolve this error:

```bash
Problem writing Eleventy templates: (more in DEBUG output)
> Having trouble rendering njk template ./src/tags-pages.njk

`TemplateContentRenderError` was thrown
> (./src/tags-pages.njk)
  Error: slugify: string argument expected

`Template render error` was thrown:
    Template render error: (./src/tags-pages.njk)
      Error: slugify: string argument expected
```

Oh, right, I can't access `Set`s with `[0]`. I don't think 11ty anticipates Sets anyway, so I should likely take the time to convert the Sets of posts into Arrays.

Ok, easy enough, let's use the spread operator, that's what it is for right?

```javascript
		Object.keys(tagSet).forEach((key) => {
			// console.log(key);        // the name of the current key.
			// console.log(myObj[key]); // the value of the current key.
			tagSet[key] = [...tagSet[key]];
		});
		console.log(
			"tagset",
			tagSet[Object.keys(tagSet)[0]][0].data.verticalTag
		);
```

Ok, I'm getting the right information here in the console.log statement. It would seem that this is set up properly as a collection, but something about how it is being handled into the tags-pages isn't working.

I'm going to take a look around and see how it works. There's [a basic tag page post on the 11ty.dev site](https://www.11ty.dev/docs/quicktips/tag-pages/), but it doesn't allow for pagination of the tag pages in the way I was hoping.

Ok. So I think that, [judging from the page on Pagination Navigation](https://www.11ty.dev/docs/pagination/nav/), I have to pass an array, not an object. Let's change the transformation into a set into a transformation from an object to an array.

Nope, that doesn't do it. And checking the docs it makes it clear that [we can indeed paginate an object](https://www.11ty.dev/docs/pagination/#paging-an-object).

Hmmm. So I think maybe this just isn't working the way I would have hoped. [It looks like I'm not the only person to want to do this](https://github.com/11ty/eleventy/issues/332). [Judging by the pagination code](https://github.com/11ty/eleventy/blob/master/src/Plugins/Pagination.js) this is indeed the best way to do what I want to do, which seems, sort of a shame. [Others have taken a similar approach as well it looks like](https://github.com/dafiulh/vredeburg/blob/master/src/tag.njk).

I like how the [vredeburg](https://vredeburg.netlify.app/) these handles it. Very solid objects that make pagination easy and page links available. I should be able to adapt it easy. Switching over the code seems like it should be easy enough. The pagination seems to have applied, but the `eleventyComputed` doesn't seem to be working. Oh, a good time to commit!
