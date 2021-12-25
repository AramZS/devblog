---
title: Hello World Devblog - Pt. 38
description: "More devblog"
project: Dev Blog
date: 2021-11-22 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - WiP
  - Markdown-It
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
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

- [x] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

<s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

</s>

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [x] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [x] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [x] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [x] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [x] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [x] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [x] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [x] Social Icons

- [x] SEO/Social/JSON-LD HEAD data

## Day 38

Ok, as I listed in [Issue 7](https://github.com/AramZS/devblog/issues/7) there are a few URL paths in my site that I don't want to see 404ing.

I thought this would be a pretty straightforward but it turned out to be harder than I thought, so instead of letting it go undocumented I figured I'd write it up.

### Filling in "Fake" Tags

Ok so I want a paginated list of all things tagged "posts" in a place other than the previously created `tag` structure. I can reuse the `tag` layout. But I'll need a new data structure to handle it.

I'm going to create a `postsPages` collection to fill `/posts/`.

I'll need to grab the `posts` collection with `collection.getFilteredByTag("posts")`.

Then I'll need to sort the collection into page-ready objects the same way I had done for `deepTagList`.

The first step is I'll define the form of the page object as a function.

```javascript
const makePageObject = (tagName, slug, number, posts, first, last) => {
  return {
	tagName: tagName,
	slug: slug ? slug : slugify(tagName.toLowerCase()),
	number: number,
	posts: posts,
	first: first,
	last: last,
  }
}
```
This is the object that I can handle via the 11ty [paginate](https://www.11ty.dev/docs/pagination/) process.

Next I want to get the posts per each page object. I want 10 per page and I'll again be using a similar process to the `deepTagList` in order to do so.

First a function to take a single array and turn it into an array of arrays, each containing the contents of my 10-post long page. I took this function straight from a Stack Overflow response.

```javascript

const paginate = (arr, size) => {
	return arr.reduce((acc, val, i) => {
		let idx = Math.floor(i / size);
		let page = acc[idx] || (acc[idx] = []);
		page.push(val);

		return acc;
	}, []);
};

```

Now I have the tools to make the collection.

```javascript

getPostClusters = (allPosts, tagName, slug) => {
  aSet = new Set();
  let postArray = allPosts.reverse();
  aSet = [...postArray];
  postArray = paginate(aSet, 10);
  let paginatedPostArray = [];
  postArray.forEach((p, i) => {
  	paginatedPostArray.push({
  		tagName,
  		slug: slug ? slug : slugify(tagName.toLowerCase()),
  		number: i + 1,
  		posts: p,
  		first: i === 0,
  		last: i === postArray.length - 1,
  	});
  });
  // console.log(paginatedPostArray)
  return paginatedPostArray;
};

eleventyConfig.addCollection("postsPages", (collection) => {
	return getPostClusters(collection.getFilteredByTag("posts"), "Posts");
});
```

I can use the exact same process to build a collection for projects.

```javascript
eleventyConfig.addCollection("projectsPages",(collection) => {
	return getPostClusters(
		collection.getFilteredByTag("projects"),
		"Projects"
	);
});
```

With these new collections I can build corresponding pages in 11ty.

Posts:

{% raw %}
```njk
---
layout: tags
templateName: tag
eleventyExcludeFromCollections: true
pagination:
    data: collections.postsPages
    size: 1
    alias: paged
permalink: "posts/{% if paged.number > 1 %}{{ paged.number }}/{% endif %}index.html"
eleventyComputed:
    title: "All Posts{% if paged.number > 1 %} | Page {{paged.number}}{% endif %}"
    description: "Posts"
---
```
{% endraw %}

Projects:

{% raw %}
```njk
---
layout: tags
templateName: tag
eleventyExcludeFromCollections: true
pagination:
    data: collections.deepProjectPostsList
    size: 1
    alias: paged
permalink: "posts/projects/{{ paged.slug }}/{% if paged.number > 1 %}{{ paged.number }}/{% endif %}index.html"
eleventyComputed:
    title: "Posts from Project: {{ paged.tagName }}{% if paged.number > 1 %} | Page {{paged.number}}{% endif %}"
    description: "Project Posts tagged with {{ paged.tagName }}"
---
```
{% endraw %}

Now for the last step I need to generate pages to fill `posts/projects/projectName` pages.

Now I can query posts into collections by their project property. I can use my `projects` collection and filter posts based on matches.

Now, this is my second try. The first time I did this I screwed up because of two reasons. I forgot that it needed to be a flat array (that is one array of posts).

The other hard thing for me to wrap my mind around is that I don't need to separate each project into its own array or project.

So first I need to get the posts, separated out by projects.

It seems like the global data object isn't set up in `.eleventy.js`. So I'll need to import the object for use in this project with `const projectSet = require("./src/_data/projects");`

Then I can use it to filter my posts by their project property.

```javascript
let deepProjectPostList = [];
// Run this for each of the projects in the `project` collection I build in my data file.
projectSet.forEach((project) => {
	// Step into an individual project and only run this process for projects that have posts, otherwise we'll throw errors during the build process.
	if (project.count > 0) {
		// This gets all posts with the project tag, those that fall under the `src/posts/projects` folder.
		let allProjectPosts = collection.getFilteredByTag("projects");
		// Now I'm going to use the filter function to return only those posts that match the project I've stepped into.
		let allPosts = allProjectPosts.filter((post) => {
			if (post.data.project == project.projectName) {
				return true;
			} else {
				return false;
			}
		});
		// Now I have an array of all the posts that are in this particular project, based on their project property. This isn't being called at the post level, and it is a new array anyway, so I seem to be safe to reverse it.
		allPosts.reverse();
		// I take the set of all the project posts and turn it into page clusters.
		const postClusters = getPostClusters(
			allPosts,
			project.projectName,
			project.slug
		);
		// And I can put those clusters into an array.
		deepProjectPostList.push(
			getPostClusters(allPosts, project.projectName, project.slug)
		);
	}
});
```

So now I have an array of pages. This is good, but too deep.

```javascript
[ // deepProjectPostList
	[ // Level of a project
		[ // a "page" of 10 posts

		]
	]
]
```

That's way too deep. Like I said earlier, my initial mistake was leaving this as is. I forgot that it needs to be one layer deep to work with how 11ty does pagination.

```javascript
let pagedDeepProjectList = [];
deepProjectPostList.forEach((projectCluster) => {
	// Inside each projectCluster array is a set of "pages" each with this object.
	/**
	 * 	tagName,
		slug: slug ? slug : slugify(tagName.toLowerCase()),
		number: i + 1,
		posts: p,
		first: i === 0,
		last: i === postArray.length - 1,
	*/
	pagedDeepProjectList.push(...projectCluster);
});
```

So I can use the spread operator here! Makes it much easier. This takes the array of arrays and pulls out the inner array and delivers it into the single level array I intend to use.

The end result is a much simpler array that can work with the page functionality.

Now I have an array of objects that look like this:

```javascript
[
	{
	 	tagName,
		slug: slug,
		number: 1,
		posts: postsObject,
		first: true,
		last: false,
	}
	...
]
```

`git commit -am "Trying to figure out the project pages"`

See I forgot that I control the permalink structure not through the structures in the array, but the objects. So I can now take this array and use it to generate any number of paged collections at `/posts/projects/projectSlug/`. So now I can use this new collection with this `md` file:

{% raw %}
```njk
---
layout: tags
templateName: tag
eleventyExcludeFromCollections: true
pagination:
    data: collections.deepProjectPostsList
    size: 1
    alias: paged
permalink: "posts/projects/{{ paged.slug }}/{% if paged.number > 1 %}{{ paged.number }}/{% endif %}index.html"
eleventyComputed:
    title: "Posts from Project: {{ paged.tagName }}{% if paged.number > 1 %} | Page {{paged.number}}{% endif %}"
    description: "Project Posts tagged with {{ paged.tagName }}"
---
```
{% endraw %}

`git commit -am "Trying to figure out the project pages"`

And this should resolve Issue 7!

`git commit -am "Finish off day 38 and resolve #7"`
