---
title: Hello World Devblog - Pt. 27
description: "More devblog"
project: Dev Blog
date: 2021-10-04 22:59:43.10 -4
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

- [x] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [ ] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [ ] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [ ] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [ ] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [ ] Social Icons

- [ ] SEO/Social/JSON-LD HEAD data

## Day 27

### Footer size

I want to add a link to the repo for the blog. Hmm, the footer's `small` element is getting its style overwritten. I'll decrease the size, but it looks like the line-height isn't applying the way I'd like. Didn't this happen before? Oh yeah, on [Day 22](./hello-day-22.md). It had something to do with the `display` type in the CSS right? Yup. Ok, so let's just switch to `display: block`.

### Social Icons

Ok, let's create some social icons! I've pulled down some of the icons I want to use in SVG format and to create clear reusable modules here I've given each social icon its own NJK file and creating a `social-block` NJK file.

Good stuff, now I just have to size and align the social media icon containers, that will size the SVGs inside.

I'll use `text-align: center` on the containing block to get the icons centered underneath my byline on the homepage.

- [x] Social Icons

`git commit -am "Fix footer and set homepage social icons"`

### Social/SEO Block

Ok, let's set up some social header data. Let's refer back to [my post on social meta tags for Jekyll](https://aramzs.github.io/jekyll/social-media/2015/11/11/be-social-with-jekyll.html), as I suspect it will be useful to reuse here.

First I'll set up a partial file `social-header.njk`. Like with my Jekyll site I have a `site` object that contains basic information I can keep in the mix as a default.

I'll need to add a `description` to my site object, but that's easy enough.

Oh and I need to have my `og:url` work without an extra trailing slash, so I'll add an if statement - {%raw %}`{{site.site_url}}{% if page.url %}/{{ page.url }}{% endif %}`{% endraw %}

Huh... I still have a trailing slash.

Oh interesting, the homepage `page.url` is just `/` so I don't need an if statement I guess?

Yup, that works!

But I don't have a truncate function here, so I'll have to [make my own filter](https://mozilla.github.io/nunjucks/api#custom-filters) to handle truncating a string.

Oh wait, no, [there is a preexisting filter](https://mozilla.github.io/nunjucks/templating.html#truncate).

Ok the filters I was using in Jekyll don't port over exactly. It looks like I can replace `strip_html | strip_newlines` with `| striptags(false)`.

Apparently I can't put line breaks into the templates the same way I can with Jekyll, so I'll have to collapse the various line-breaks and make it slightly less readable.

Ok, easy enough, I got everything figured out. Let's get the rest of the tags in.

Oh, right, I can't use `excerpt`, I'm using the more... uhh... descriptive 'description' property. Let's switch that. And I can't forget to strip out `page.` for individual posts.

Hmmm... [no built-in last-modified](https://github.com/11ty/eleventy/issues/869), so I guess I'll handle it the same way, it will be in place when I manually add it to the post metadata, otherwise it will get skipped.

I'll switch my `section` to be the `project` property in my posts. Cool, make sure to add an if check and we're good there.

The rest of my old post deals with featured images, which I haven't figured out yet, so I figure I'll handle that next time.

`git commit -am "Set up initial social sharing tags"`
