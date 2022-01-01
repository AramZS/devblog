---
title: "Part 12: How to make a collection?"
subtitle: Getting this dev blog running
description: Day 12 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-07-05 22:59:43.10 -4
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

## Day 12

Ok, I'd like to have a custom collection so I can get a list of project names. So is there a way to add a collection API that's an entirely different collection? Something I can use instead of `tags` in other words

- [ ] Not what I want, but I should prob do this https://www.11ty.dev/docs/quicktips/tag-pages/

- [ ] This will be good to have on the bottom of these posts - https://www.11ty.dev/docs/filters/collection-items/

Feels a little hacky, but it looks like [the way to do this is to create a global object and filter the output I want into there](https://stackoverflow.com/questions/66083103/how-to-generate-a-list-of-all-collections-in-11ty).

There's another way I could potentially handle this, and that's by folder structure. I think it makes sense to try that first and see what we can do with it. First we'll move a post into this new folder structure to try and see if we can query the path usefuly.

I'll move my hello-day-1 post into `src/posts/projects/devblog`.

Now can I get a list of paths under a particular path? I'm not seeing a way actually. It seems like the sort of thing that it would make sense to be easy to do. Yet, no clear sign of how to do it.

I thought this might work, but no go:

```javascript
	eleventyConfig.addCollection('projects', function(collectionApi) {
        return collectionApi.getFilteredByGlob('src/projects/*');
    });
```

Ok, looks like I'm going to have to do something a little more complex.

`git commit -am "First attempt at setting up projects list"`

