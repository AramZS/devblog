---
title: Hello World Devblog - Pt. 31
description: "More devblog"
project: Dev Blog
date: 2021-11-12 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - WiP
  - SEO
  - SMO
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

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [ ] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [ ] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

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

## Day 31

Looking good!

### Setting up previous and next project post pages.

Ok, today we're going to try next and previous pages. Apparently there are [universal filters built in to 11ty that we can use to find previous and next posts](https://www.11ty.dev/docs/filters/collection-items/). Let's give it a try.

Ok, the default set up is for a general posts collection, but what I need is the project collection. But first I'm going to make sure it works in the standard configuration. I can pull the styling in from the work I did on tag pages.

`git commit -am "Basic post pagination"`

Ok, figuring out the collection time.

Judging from my work back on days 10 and 11 I don't think there's a really good way to do so just within the Nunjucks template. I guess I'll need a custom shortcode. I can use the `projectList` shortcode again and see if I can't pull some useful code out of the `getPreviousCollectionItem` function [built into 11ty](https://github.com/11ty/eleventy/blob/36713b3af81b08530fac532ceef24f5dde8acb36/src/defaultConfig.js#L25).

Ok, so I want to use the same function that is being referred to in 11ty. I'll pull it in

`const getCollectionItem = require("@11ty/eleventy/src/Filters/GetCollectionItem");`

Ok, unlike before, this should be a filter if I want to duplicate the functionality in 11ty core.

#### Create the Filter tag

I gotta remember that the `page` object is very specific. I had to log it to remember how the object worked.

```javascript
{
  date: 2021-06-16T03:59:43.100Z,
  inputPath: './src/posts/projects/devblog/hello-day-4.md',
  fileSlug: 'hello-day-4',
  filePathStem: '/posts/projects/devblog/hello-day-4',
  url: '/posts/projects/devblog/hello-day-4/',
  outputPath: 'docs/posts/projects/devblog/hello-day-4/index.html'
}
```

So no project property. The project proprty of the post is escaped into its own variable in the page template

So now the template calls the filter like:

{% raw %}
```njk
	{% set previousPost = collections.posts | getPreviousProjectItem(page, project) %}
	{% set nextPost = collections.posts | getNextProjectItem(page, project) %}
```
{% endraw %}

Ok so now I have passed into the function the posts collection, the page object and the project name. Now to set up a function to walk through the posts collection and find the right post that is a project post and this project's post in particular.

```javascript
eleventyConfig.addFilter(
		"getPreviousProjectItem",
		function (collection, page, project){
			let index = -1;
			let found = false;
			if (project){
				let lastPost;
				while (found === false) {
					lastPost = getCollectionItem(collection, page, index)
					if (lastPost.data.hasOwnProperty("project") && lastPost.data.project == project){
						found = true;
					} else {
						index = index-1;
					}
				}
				return lastPost;
			} else {
				return false;
			}

		}
	);
```

Ok, I want to simplify it. But also, I am seeing one issue. Gotta check that the post exists, otherwise the first and last page will crash. Ok, let's fix that first.

```javascript
	eleventyConfig.addFilter(
		"getNextProjectItem",
		function (collection, page, project){
			let index = 1;
			let found = false;
			if (project){
				let lastPost;
				while (found === false) {
					lastPost = getCollectionItem(collection, page, index)
					if (lastPost && lastPost.data.hasOwnProperty("project") && lastPost.data.project == project){
						found = true;
					} else {
						if (!lastPost){
							return false;
						}
						index = index+1;
					}
				}
				return lastPost;
			} else {
				return false;
			}
		}
	);
```

#### Simplify the While loop

Ok, let's pull out the function, make it repeatable.

```javascript
	function getNProjectItem(collection, page, projectName, index, operation){
		let found = false;
		if (projectName){
			let lastPost;
			while (found === false) {
				lastPost = getCollectionItem(collection, page, index)
				if (lastPost && lastPost.data.hasOwnProperty("project") && lastPost.data.project == projectName){
					found = true;
				} else {
					if (!lastPost){
						return false;
					}
					index = operation(index);
				}
			}
			return lastPost;
		} else {
			return false;
		}
	}
```
Now my filter call looks like this.

```javascript
	eleventyConfig.addFilter(
		"getPreviousProjectItem",
		function (collection, page, project){
			let index = -1;
			return getNProjectItem(collection, page, project, index, function(i){return i-1};
```

Ok, there's one other thing I need. I need to exclude the "Things I Learned" posts.

I have the check for them now, the `wrapup` property.

That means the check now looks like this:

```javascript
if (
	lastPost &&
	lastPost.data.hasOwnProperty("project") &&
	lastPost.data.project == projectName &&
	!lastPost.data.hasOwnProperty('wrapup')
){
```

Ok it's looking good!

`git commit -am "Setting up in-post pagination for projects"`

Ok, clean up time. Oh and I should make sure this is only for project work days, so an `if` check for that in the template.

{% raw %}
```liquid
    {% if project and not wrapup %}
        {% set previousPost = collections.posts | getPreviousProjectItem(page, project) %}
        {% set nextPost = collections.posts | getNextProjectItem(page, project) %}
        <div class="pagination">
            <a href="{% if previousPost %}{{ previousPost.url }}{% else %}javascript:void(0){% endif %}" class="pagination-link {% if previousPost %}cursor-pointer {% else %} cursor-default disabled-link{% endif %}">Previous Project Days</a>

            <a href="{% if nextPost %}{{ nextPost.url }}{% else %}javascript:void(0){% endif %}" class="pagination-link {% if nextPost %}cursor-pointer {% else %} disabled-link cursor-default{% endif %}">Next Project Day</a>
        </div>
    {% endif %}
```
{% endraw %}

Ok, looking good. One more thing to check off the list!

- [x] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

`git commit -am "Finish off day 31"`
