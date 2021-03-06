---
title: "Part 15: Mobile Style Tweaks"
subtitle: Getting this dev blog running
description: Day 15 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-07-24 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - CSS
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

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [ ] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

## Day 15

Ok, let's add a little styling to handle mobile devices. Looking at the sizes the changes happen and also when the lines tend to start to break, I think I want a custom break point for the frontpage grid.

I'll put `$mobile-width: 890px` at the top of my stylesheet and set the width there. Then I can reuse it on per-unit queries like:

```css
        @media (max-width: $mobile-width)
            display: block
```

Ok, I want to set a link to the home page on every page. I started with a query to check for `/posts` and `/projects` in the base template. But I don't like how it looks if it is below the main content of the header. Let's switch up the design.

Ok, that's looking better. But I want the title of the page to span longer then it does now.

```css
@media print, screen and (max-width: $large-mobile)
    header
        padding-right: 260px
```

Hm. That's not working.

I'll come back to it in a second. I want to get a breadcrumb path working, but there's no way to split the URL at the build process, at least not one that I can see that's built in. I guess the answer is a filter I can run the URL through.

To manipulate chunks of the URL I am going to have to turn the URL into an array and manipulate it, along with handling the domain env variable.

```javascript
	eleventyConfig.addFilter("relproject", function (url) {
		var urlArray = url.split('/')
		var urlFiltered = urlArray.filter(e => e.length > 0)
		urlFiltered.pop() // Remove post path
		urlFiltered.shift() // Remove `posts/`
		return process.env.DOMAIN + '/' + urlFiltered.join('/')
	  })
```

Now I can use it in a template tag like this:

{% raw %}
```liquid
<a id="project-link" href="{{ page.url | relproject }}">{{project}}</a>
```
{% endraw %}

Ok, back to SaaS. What's going on there?

Oops, forgot to give it a `px` for the unit type.

Ok. That works now.

`git commit -am "Set up changes to styles and add some additional elements to the design"`
