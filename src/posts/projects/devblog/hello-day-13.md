---
title: "Part 13: Building new Eleventy Taxonomies"
subtitle: Getting this dev blog running
description: Day 13 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-07-22 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
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

## Day 13

Ok, I'm trying to create a taxonomy that queries projects so I can list posts by their parent project. I tried to do it with `addGlobalData` but that's apparently a future feature of 11ty. So I'm headed back from DC now on the Acela (it's been a long time since the last time that was true) so it's coooooooooooooooode time.

The main thing to note here is I want to be able to get:

1. A list of "projects"
2. A list of posts under each Project.

### Global Data and new Taxonomies

So instead I'm going to use the global data folder `_data` and move my operation over there.

```javascript
// In src/_data/projects.js
const { readdirSync } = require('fs');

const getDirectories = source =>
readdirSync(source, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

console.log(getDirectories('src/posts/projects/'));

module.exports = getDirectories('src/posts/projects/');
```

And now I have a global data object I can iterate over. Sweet!

{% raw %}
```liquid
		{%- for project in projects %}
			<li class="capitalize-first">{{project}}</li>
		{%- endfor %}
```
{% endraw %}

Ok, now that I have the list of projects. I need to do something with them. Basically these should link to project pages that work like category pages in WordPress.

But before I get to that, every time I go through a tunnel my local environment dies because it is loading a remote URL for my Prism styles. Let's fix that. I'm going to copy it locally and set up a passthrough.

Ok, and while I'm here, let me add proper categories for the home page.

Oh wait, that didn't work. It doesn't have the capacity to handle empty collections. I thought I'd get an empty array, but apparently not. Ok, I'll write some checks in to my shortcode.

`git commit -m "Setting up home page structure with local prism css"`

Ok. That worked. Time to read about [building Pages from Data with 11ty](https://www.11ty.dev/docs/pages-from-data/).

### Implementing Tag Data for New Templates

Ok so, let's build it out at `project-pages.njk`.

{% raw %}
```liquid
---
pagination:
    data: projects
    size: 1
    alias: project
permalink: "projects/{{ project | slug }}/"
title: "Project: {{ project | slug }}"
---

{% block postcontent %}
	<h3 class="capitalize-first">{{project}}</h3>

	<!-- post list: -->
{% endblock %}
```
{% endraw %}

Alright, the page is getting built, but the title meta isn't populated. How to fix?

Ok, [it doesn't appear to be clearly documented, but I need to use](https://github.com/11ty/eleventy/issues/1061#issuecomment-606217361) `eleventyComputed`

So I replace the `title` property as follows:

{% raw %}
```liquid
---
pagination:
    data: projects
    size: 1
    alias: project
permalink: "projects/{{ project | slug }}/"
eleventyComputed:
  title: "Project: {{ project.title }}"
---
```
{% endraw %}

Ok, I'm getting the title now. But I want to filter the list of project posts by the project metadata.

This is more complicated.

But ok, here's what I ended up doing

### Folder Based Tags

First, I needed to make the project global data object even more complicated. It now needs a Title, a slug and a `projectName`.

To fill out that projectName I need to stop putting the project data in the blog post and instead put it in the
[directory's data file](https://www.11ty.dev/docs/data-template-dir/).

Then I need to pull the content of that data file into my new global object's `projectName` like so:

```javascript
const { readdirSync } = require('fs');
const path = require('path')

const getDirectories = source =>
readdirSync(source, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

const directorySet = getDirectories('src/posts/projects/').map(
	(projectDir) => {
		return {
			title: projectDir.charAt(0).toUpperCase() + projectDir.slice(1),
			slug: projectDir,
			projectName: require(path.resolve(`./src/posts/projects/${projectDir}/${projectDir}.json`)).project
		}
	}
);
```

Now the pages that I'm generating for individual projects can filter by that value:

{% raw %}
```liquid
	<ul>
		{%- for post in collections.projects -%}
			{% if post.data.project == project.projectName %}
				<li>
					<a href="{{ post.url }}">{{ post.data.title }}</a>
				</li>
			{% endif %}
		{%- endfor -%}
	</ul>
```
{% endraw %}

Ok, it works!

`git commit -am "Project pages"`

Ok, I'm going to add a description for the overall project and make it available the same way. Looks good.

I want to show tags in the sidebar/footer but the current layout isn't great. I'll have to add CSS to handle it.

Ok, train ride is over!

`git commit -am "Finishing project pages"`
