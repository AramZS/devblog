---
title: Hello World Devblog - Pt. 24
subtitle: Getting this dev blog running
description: "More devblog"
project: Dev Blog
date: 2021-08-29 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
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

- [ ] Show the latest post below the site intro on the homepage.

- [ ] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [ ] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [ ] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

## Day 24

I'm going to pause on trying to debug the nunjucks stuff not working as expected. I have no idea why content is appearing in the wrong block and I see no previous examples of this problem. It makes me more sure than ever that I likely screwed something up with an open tag *somewhere* but I have no idea where and the tooling isn't showing me like it should. Let's just try and get tag pages' content done first, even if that content is showing up in the wrong area.

I think I need to get better insight into how this object is showing on the page. I want to dump it on the page and examine it. Nunjucks [seems to have](https://github.com/mozilla/nunjucks/issues/94#issuecomment-241729768) {% raw %}`{{ object | dump | safe}}`{% endraw %} but it isn't working with a more complicated eleventy-generated object. Let's give a custom debug filter a try. [Looks like some good ideas in the eleventy issues.](https://github.com/11ty/eleventy/issues/266#issuecomment-716176366)

Ok, [used the comment with a clean echo](https://github.com/11ty/eleventy/issues/266#issuecomment-841304247).

```javascript
eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
});
```

But when it has a posts object, you end up with all the posts and their content in the middle of the object, which is no good.

I'm just going to remove the posts part of the object, but I want to make sure that doesn't impact the overall object, which might be used elsewhere, so I'm going to clone it. I have to use `Object.assign` for this, because `JSON.stringify` can't deal with circular references. I may also want to [try `log`](https://www.11ty.dev/docs/filters/log/) if this doesn't work.

```javascript
	eleventyConfig.addFilter("console", function (value) {
		let objToEcho;
		if (value.posts) {
			objToEcho = Object.assign({}, value);
			delete objToEcho.posts;
		} else {
			objToEcho = value;
		}
		const str = util.inspect(objToEcho);
		return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`;
	});
```

Ok, this is useful, so there's three objects to concern oneself with. `paged` is the object I created with the contents of this page. `page` is specific metadata about the page, and `pagination` gives me the information about the previous and next pages, along with information about the collection itself. I can look at them all with this:

{% raw %}
```liquid
        Pages dump:
        {{ paged | console | safe }}
        {{ page | console | safe }}
        {{ pagination | console | safe }}
```
{{% endraw %}}

Ok, that works, the code I used from the other theme gets me most of the way there, but I'll have to alter the style to make it work properly for me.

Ok. Now that I know what's going on, I feel a little more comfortable asking... wtf is going on with the pagination content not falling into the given block? It has to be something wrong with my `base.njk` file. But I don't know what. Let's walk it through.

Ok, first I'm going to switch all spacing to spaces. Then I'm going to clean up my messy if/else in defining the `html` tag as that's difficult to read or manage.

Does Nunjucks support `elif` as an "else if" expression as I thought on [Day 9](/posts/projects/devblog/hello-day-9/)? It doesn't appear in Nunjucks docs, but I would assume it does. Removing it doesn't fix my problem, but it isn't really needed, so let's remove it anyway.

It is sort of irritating to have a section before my content when I don't need it, so let's remove the precontent section HTML tag from the base template and add it in the areas I use it instead.

Still nothing.

I'll try a blank page.

Still nothing. Maybe I'm crazy, but unless the rendering engine is broken by HTML comments, something at the rendering engine level is broken.

Ok... [this is some eleventy stuff apparently. It just doesn't work as anticipated](https://github.com/11ty/eleventy/issues/834#issuecomment-569474008). I guess it is just rendering everything in the `content` tag.

Yup, that is what it is... the warning there isn't very clear but yup, can't mix and match. So no njk templates that use blocks in the base site, anywhere I want to have Nunjuck inherence I'll need to use a markdown file in my site folder and manage the actual templates using `_layouts`.

Ok, that works, time to commit and quit for the night.

`git commit -am "Finishing off day 23, TOC working, pagination is not."`
