---
title: "Part 11: Nunjucks and Shortcodes"
subtitle: Figuring out how to use shortcodes
description: Day 8 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-07-05 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - Nunjucks
  - Shortcodes
  - WiP
---

## Project Scope and ToDos

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

- [ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

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

## Day 11

Ok, still not getting Macros working exactly the way I wanted. It would be really useful to have 11ty throw actual errors as part of this, but when I tried to set my own version of the Nunjucks Environment I kept hitting against undocumented settings that 11ty apparently sets up. This is getting way off the main thing I was trying to build. I could dive deeper in, but this site still isn't live and I would like to get it to that point first. So, for now, I'm going to just drop it.

But before I do, I do think this is a major problem and would be useful for eleventy to fix. So, let's check issues one last time, and check if there is something for me to file.

It looks like [there is an issue in the right space](https://github.com/11ty/eleventy/issues/895), but the suggested solution on the issue doesn't work. If I [follow through the tickets](https://github.com/pdehaan/11ty-blog-ideas/issues/7) a little more I can [see another suggested solution](https://github.com/pdehaan/11ty-nunjucks-config/blob/master/.eleventy.js). But it doesn't solve the issue with the raw tags no longer working either.

### Difficulties with Nunjucks Library Setup

I don't understand. [This](https://github.com/11ty/eleventy/blob/master/src/Engines/Nunjucks.js#L128) *should* work. I even checked to make sure my version of Nunjucks is the same! I even tried removing one of the files, but now my Nunjucks execution is failing on a different chunk of JS in the `js` front matter block in `rss2-feed.njk`.

So let's add my voice.

`git commit -am "Bookmarking attempt to set custom NJK library."`

A quick bookmark of the current state of the site to help the Eleventy folks with debugging my issue!

And now [a write up](https://github.com/11ty/eleventy/issues/1879)!

Ok, let's move on!

### Shortcodes

I'm going to give up on Macros for now and instead I'll [use a Shortcode](https://www.11ty.dev/docs/languages/nunjucks/#single-shortcode).

Ok, honestly this is a **ton** easier. I should have just gone this direction in the first place.

```javascript
	eleventyConfig.addShortcode("postList", function(collectionName, collectionOfPosts) {
		let postList = collectionOfPosts.map((post) => {
			return `<li>${post.data.title}</li>`
		})
		return `<p>${collectionName}</p>
		<ul>
			<!-- Collection: ${collectionName} -->
			${postList.join('\n')}
		</ul>
		`;
	});
```

and then I can call it easily with 11ty data like this:

{% raw %}
`{% postList "WiP", collections["WiP"] %}`
{% endraw %}

`git commit -am "Set up a shortcode for postlist"`

Ok, now I want to be able to pass the post type I want to list in the Markdown file.

New markdown front matter to make that work:

```yaml
---
layout: index
eleventyExcludeFromCollections: true
internalPageTypes: [ 'home' ]
postLists: [
	{name: "WiP", collection: "WiP", order: "date" },
	{name: "Posts", collection: "posts", order: "reverse" }
	]
---
```

and I'll alter the shortcode to use the new arguments.

```javascript
	eleventyConfig.addShortcode("postList", function(collectionName, collectionOfPosts, order) {
		if (!!!order){
			order = "reverse"
		}
		if (order === "reverse"){
			collectionOfPosts.reverse()
		}
		let postList = collectionOfPosts.map((post) => {
			return `<li>${post.data.title}</li>`
		})
		return `<p>${collectionName}</p>
		<ul>
			<!-- Collection: ${collectionName} -->
			${postList.join('\n')}
		</ul>
		`;
	});
```

and now my `index.njk` file is reusable for any vertical file I wish to reuse it with.

{% raw %}
```liquid
{% extends "base.njk" %}

{% block postcontent %}
	<!-- post list: -->
	{%- for postType in postLists %}
		{% postList postType.name,
		collections[postType.collection],
		postType.order %}
	{%- endfor %}
{% endblock %}
```
{% endraw %}


`git commit -am "Got shortcode + vertical layout template working"`
