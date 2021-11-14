---
title: Hello World Devblog - Pt. 30
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

- [ ] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [ ] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [x] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [x] Social Icons

- [x] SEO/Social/JSON-LD HEAD data

## Day 30

Ok, day 30. Pretty big benchmark and it looks like I'm getting close to being done.

Let's check a small one off the list first and hide the empties.

- [x] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

### Adding Things I Learned to the Project Page

I am going to want to create some boxes if I want to set up Things I Learned on the project pages. That's going to mean collapsing some boxes too.

Ok, I'm on a new computer and for some reason the Sass file for the project template is not rebuilding. What's going on here?

Oh, something weird must be going on because for some reason on this computer (which is an old laptop I've tried to reclaim some usefulness via setting it up with Ubuntu) is not passing the `process.env.DOMAIN` variable. Oops... forgot to set up my `.env` file with `IS_LOCAL=true`. Ok, everything is working now!

Ok, everything is loading now and I did some styling with Flexbox for a fast and easy two column layout.

```scss
 #postcontent
        .content-lists-container
            display: flex
            justify-content: center
            @media print, screen and (max-width: 630px)
                display: block
            .content-list
                padding: 0 10px
                min-width: 38%
                &:nth-child(2)
                    margin-left: 10px
                    padding-left: 10px
                    border-left: 1px solid black
                @media print, screen and (max-width: 630px)
                    padding: 0
                    &:nth-child(2)
                        border-left: 0
                        margin-left: 0
                        padding: 0
```

Looks good!

- [x] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

`git commit -am "Style work for  day 30"`

I put in a dummy post for things I learned just to make sure everything worked and it did. Don't forget, I need a `h2` level header in every post. I'll remove it now.

`git commit -am "Finish off day 30"`
