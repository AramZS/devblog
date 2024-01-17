---
title: Day 45 - Comments as simply as possible
description: "How little server can I involve in giving myself a commenting system?"
project: Dev Blog
date: 2024-01-17 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - Comments
  - UGC
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

<s>

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

</s>

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

<s>

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

</s>

- [x] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [x] Posts should be able to support a preview header image that can also be shown on post lists.

- [x] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

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

## Day 45

I want to try a way to add comments to this blog. I want something where I have a good degree of ownership over the comments, so I took a look at [some options](https://lisakov.com/projects/open-source-comments/). Mainly, I'm hoping I don't have to host a server.

I took a look at a whole bunch of interesting options:

- [Introduction · Commento](https://docs.commento.io/)
- [Webmention.io](https://webmention.io/)
- [Linked Data Notifications](https://csarven.ca/linked-data-notifications#protocol)
- [GitHub - coralproject/talk: A better commenting experience from Vox Media](https://github.com/coralproject/talk)
- [GitHub - discourse/discourse: A platform for community discussion. Free, open, simple.](https://github.com/discourse/discourse)
- [Isso](https://github.com/posativ/isso)
- [GitHub - djyde/cusdis: lightweight, privacy-friendly alternative to Disqus.](https://github.com/djyde/cusdis)
- [GitHub - eduardoboucas/staticman: 💪 User-generated content for Git-powered websites](https://github.com/eduardoboucas/staticman)
	- [Adding Staticman Comments](https://travisdowns.github.io/blog/2020/02/05/now-with-comments.html)
	- [Adding user-generated content to a static site using Staticman](https://eduardoboucas.com/blog/2016/08/10/staticman.html)
- [Comments for static websites, using GitHub Issues.](https://pknopf.com/post/2018-10-13-comments-for-static-sites-using-github-issues/)

I'm going to try [utterances](https://utteranc.es/). It's a GitHub Issues based comment system that looks like it just needs a GitHub app and some JS.

I suppose the GitHub App could break and that would screw me, but I'd still have the comments and I could always pull them in some other way if needed. The one downside is that they aren't really static in my code for this site. But let's give it a try. Staticman seems like it is closer to what I want, but I don't want to have to care for some tiny server, which seems a requirement.

Seems to work fine. I guess... I'll try it out? Sure, why not!
