---
title: Hello World Devblog - Pt. 26
description: "More devblog"
project: Dev Blog
date: 2021-09-26 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - CSS
  - WiP
  - Aggregation
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

## Day 26

Wait... what am I using the `subtitle` metadata for? Maybe that should go under the title on post pages? Yeah let's do that.

### Short Browsers

Also, there's a chance the user can really make the browser short if they do it may cause the footer elements to overlap, so let's try and get rid of that.

Using `@media (min-width: variables.$large-mobile) and [height argument]` I'll hide specific fixed elements in my makeshift sidebar based on window height. By using `and (max-height: 850px)` I can restrict fixed elements to appear only when there is room for them.

I'll hide the table of contents when the window is 850px or smaller with `@media (min-width: variables.$large-mobile) and (max-height: 850px)` and hide the taglist and footer at shorter heights so if the window is very short, we'll only have the title.

Actually... I'd prefer not to totally hide the Table of Contents, but have it return to place above the content if the browser is too short. While I'll keep the CSS Media Query `and` rule for the tags and footer as is, I can switch the `#toc-container` rule to be ` and (min-height: 962px)`

But wait... the element is not going to scroll when it gets too high. Hmmm. Let's try a containing element... hmm no that's not it by itself. Oh, let's set a max-height on the content itself. Hmm, it makes it a little narrow. Let's try and attach that scrollbar somewhere else.

Ok, I'll use the container div I set up when I was playing with getting `max-height` working and set my overflow CSS on that. Oh yeah, that looks much better.

`git commit -m "Fix height and positioning for short browser windows"`

### Autolinks for Git Commits?

Ok, I [found some interesting ideas for traversing the Github API](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w) to get the actual commit links that I can auto apply to links here. Finding the strings will be it's own interesting task but for now I am experimenting with the API with the following requests:

- [Get the repo HEAD on the `main` branch](https://api.github.com/repos/AramZS/devblog/git/refs/heads/main).
- [Get commit by hash at HEAD](https://api.github.com/repos/AramZS/devblog/git/commits/22240416f821b3aafe4e47f3d95fc23ec3021d58)
- [Get commit by parent hash of HEAD commit](https://api.github.com/repos/AramZS/devblog/git/commits/3907d1444d79208d41995dfc41db5e85d7de94f3)
- [Get commit tree](https://api.github.com/repos/AramZS/devblog/git/trees/3cd2735001a8c60d995d49391f9b45b6ce530e6d)
- [Look at commits by push event](https://api.github.com/repos/AramZS/devblog/events)
- [Get latest commits via Atom feed](https://github.com/AramZS/devblog/commits/main.atom)

None are exactly right, but I might be able to walk backwards through parent commits if I start at the HEAD. I think I'll also want to cache commits so I don't have to walk the tree of commits on every build.



### Blogroll and Links

Ok, I know I said I'd lock scope, but this one last expansion! I want to have useful links on the homepage and a blogroll as well. Easy enough to do right? I'm going to add them
