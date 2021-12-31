---
title: "Part 25: Tweaking TOC Styles"
subtitle: Getting this dev blog running
description: "More devblog"
project: Dev Blog
date: 2021-09-26 22:59:43.10 -4
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

- [ ] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [ ] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [ ] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [ ] Add a technical reading log to the homepage

- [ ] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [ ] Add byline to post pages

- [ ] Have table of contents attach to sidebar bottom on mobile

- [ ] Support dark mode

- [ ] Social Icons

- [ ] SEO/Social/JSON-LD HEAD data

## Day 25

Ok, wow, looking back on my last "day's" notes and it has been a while. Almost a month. I got very busy!

I did a quick review of some of my tasks and checked them off. Getting closer to catching up with my ever-broadining scope!

After some examination of what is in the project thus far and what I've added and completed... I think this is the time to declare a lock on this project. I've added two more items to complete and the 7 primary features I required from this project are done. Now, once I check off all the items of the remaining To Dos I think it'll be time to shift my focus back to Backreads... or to another project.

Ok! That's settled then!

The tag pages do appear to have working pagination with my last changes, though they need some design work, so it seems like now is a good time to do some CSS work!

I'll pull most of the preexisting classes that were on the elements from the theme I took the HTML from and add one of my own for disabled links, that'll be good to reuse. I'll also need to make sure to add an override for the hover state.

```sass
.disabled-link
    color: grey
    text-decoration: none
    &:hover
        text-decoration: none
        color: grey
```

I next need to set the pagination links to align with the article block. I'll give it a left padding of `25px` to match the UL indentation on tag pages. Now I need to make it clearer what the links are and what they do.

It's sort of old school, but I'll layer some basic colors and a drop shadow. Why not?

- [x] Tags pages with Pagination

`git commit -m "Style pagination"`

Ok, I'm going to add a sass file and a few per-file overrides to support a dark theme.

- [x] Support dark mode

`git commit -am "Set up dark mode styles"`

Ok, I'm going to move the post description to be below the table of contents and that way I can set a fixed position for the ToC on wider screens and not worry about the `header` area overlapping with the fixed contents position. And to make sure it doesn't overlap with the footer I'll give it a max-height and set it to scroll if there is too much content.

`git commit -am "Set fixed table of contents"`

Ok, pretty good for a short day's work!
