---
title: Hello World Devblog - Pt. 6
subtitle: Getting this dev blog running
description: Part 6 of setting up 11ty deb blog.
tags:
  - Starters
  - 11ty
  - Node
  - Sass
---


1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [ ] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/master/src/BuildTOC.js) mby?

- [ ] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

- [ ] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is how Jekyll accomplishes this, but is there a way to push that into the build process for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

# Day 6

Ok, here we go on day 6. Today I write code on a Delta flight.

I've resolved some of the very basic blockers that were absolute need-to-haves from a design perspective. There is more work to be done on the design side (obviously, I still don't have a home page) but I think I need to answer questions about the GitHub Pages deployment process before I go any further. I know I can make an 11ty blog that satisfies me now, but can I do so while also satisfying the ease of deployment and management that comes with Jekyll-style Github Pages deployment? Luckily the internet is free today, so I can find out at no added cost to my flight.

The most upvoted solution I saw for Github Pages deployment was [the LinkedIn post](https://www.linkedin.com/pulse/eleventy-github-pages-lea-tortay/) I found earlier. While I've managed a number of other deploy approaches, I actually have never written my own Github Pages deployment process, so figuring that out was one of my goals with this project. Let's start with that.

Oh, lol the wifi was only free for the first 5 minutes I guess? Ok, I'll pay.

Hmmmmm Captive Portal problems. Time to reboot.

