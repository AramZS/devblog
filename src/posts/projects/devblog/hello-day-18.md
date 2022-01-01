---
title: "Part 18: Tag Pages"
subtitle: Getting this dev blog running
description: "Ok, I'm still disappointed with markdown-it. So let's take on a different task today. I'm going to take on showing the latest post and the tags pages, if I can pull off both."
project: Dev Blog
date: 2021-07-30 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - GitHub Actions
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

## Day 18

Ok, I'm still disappointed with markdown-it. So let's take on a different task today. I'm going to take on showing the latest post and the tags pages, if I can pull off both.

For the home page, it looks like [I can pull a good example](https://stackoverflow.com/questions/64337175/get-latest-post-to-show-on-home-page-with-eleventy). It is dependent on [a filter](https://github.com/11ty/eleventy-base-blog/blob/1be6346bde9ebe4afc23d7feaf0370817ad90f15/.eleventy.js#L31) though. Oh this idea, to truncate an array with a filter, is really cool. I wish I hard realized it existed before I set up the limit number on the collection. But I'll pull it over. That said, I prefer to name it what it actually does and call it `slice`. Ok, now I can have a single post on the homepage. But I don't really want the whole thing. Time to use the "description" metadata key and value. I'll need it for SEO anyway, so good to have something else on the site that uses the value. I want to have a good separator in place to differentiate the post content. I can add an `hr`, but it will need some custom styling.

I'll use my index-specific Sass here.

```css
    .front-post
        hr
            margin-bottom: 6px
        h3
            margin-top: 2px
```

Ok, on to the tag pages.

I'll start by duplicating the projects page. Now the question is how to get a list of collections.

There doesn't seem to be a native way, but [I can build on the techniques that the 11ty site itself uses](https://github.com/11ty/eleventy-base-blog/blob/1be6346bde9ebe4afc23d7feaf0370817ad90f15/.eleventy.js#L47).

Ok, what does that create exactly? According to `console.log`:

```javascript
[
  'projects',
  'Starters',
  '11ty',
  'Node',
  'Sass',
  'WiP',
  'Github Actions'
]
```

Ok and from there I can base the new page off [the example from the eleventy site](https://www.11ty.dev/docs/pagination/#paging-a-collection). It worked! Now I have a set of pages.

I can use my postList shortcode here to get a list of posts. Just have to update it so the posts are linked.

This is a good start, next step is paginating these tag pages!

`git commit -am "Setting up homepage post and tag pages"`
