---
title: Hello World Devblog - Pt. 7
subtitle: Getting this dev blog running
description: Part 7 of setting up 11ty deb blog.
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

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

# Day 7

Ok, after struggling with the plane wifi and spending some time talking to my row-mate about us both being web engineers, I didn't get quite as much as I had planned done on the plane. So we're back with an empty build branch.

Time to get back to it. I think the first thing is to check the various GitHub actions. I'd hoped they'd work right out of the box but no-go (maybe?). The LinkedIn post was helpful, but the fact that the author's project is no longer public makes it a pain to make sure I'm following directions properly.

First is [setup-node](https://github.com/actions/setup-node). And some immediate things pop out at me. First I'd set up with Node 15 locally. But it looks like this action is only able to use up to and including Node 14. So, let's use nvm and rebuild the node_modules and package-lock.json files with Node 14. Deleting them both, changing the value in `.nvmrc` and rebooting my terminal.

Oh, NVM doesn't automatically use the latest node version huh? Ok, I'll specify the version to match the action on Github. Downloading and installing it now.

`npm install`

Ok. Everything still works, so that is good!

But what could be the issue, it must be me gitignoring the docs folder, I guess it has to commit the folder? I still don't want the docs folder on my main branch if I can avoid it. What if I just remove the docs gitignore during the build process?

`git commit -am "Update build process and attempt to commit the docs folder in the build process"`

