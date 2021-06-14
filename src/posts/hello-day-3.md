---
title: Hello World Devblog - Pt. 2
subtitle: Getting this dev blog running
description: Part 2 of setting up 11ty deb blog.
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

[ ] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

[ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

[ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/master/src/BuildTOC.js) mby?

[ ] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

[ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

[ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

## Day 3

Ok, so I'm at day 3 and everything is working at a basic level. I need an index/entry page and some ways to present posts in lists. I also am not a huge fan of the `site/posts/post-name` structure.

[ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

There's also an open question of Why Nunjucks? I'm not the biggest fan of Nunjucks, outside of the 11ty community that seems to be heavily invested into it, not many people seem to be using it. Documentation is (as we've already seen) sorta iffy and its relatively low adoption makes it harder to get questions answered.

I also haven't quite gotten syntax highlighting to work for `njk` files in VS Code, which is *very* frustrating and often turns me off from using something.

I could, at this point, switch to Mustache, which I'm [already pretty familiar](https://glitch.com/edit/#!/thespin?path=server.js) with. Mustache also has the advantage of having template tags that are more similar to Jekyll and more familiar to Javascript users. But, unless I hit a real bad obstacle I don't think I will, for two reasons. First, the point of this is to learn something new! Second, when I last tried 11ty to basically generate a few quick pages from a common template, it had terrible trouble rendering with Mustache, even with the instructions from their site. I've got other things to complicate first, can save that for later. If I get everything working, I might come back to this issue.

Ok, [got Nunjucks syntax highlighting to properly work](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks) for now!

Stepping back it looks like the rendered site in the `docs` folder is generally looking ok. There's one issue, my passthrough of assets includes an `assets/css` folder with an entirely useless sass file that would be public-facing. So I'm going to have to do subdirectories of assets instead. Should be easy enough.

Huh... it doesn't clean up the now defunct `css` folder. Is there a build tool to clean things up?

[Looks like it doesn't ship with 11ty](https://github.com/11ty/eleventy/issues/19). But there [are other solutions that people have done](https://github.com/11ty/eleventy/issues/744).

I like [the solution that defines the site configuration earlier](https://github.com/11ty/eleventy/issues/744#issuecomment-800323968), it seems generally useful. I'll give it a try.

That works! Deleting the whole folder and building it all new seems super inefficient, but there doesn't seem to be another way to handle things.

One other throught now occurs. I saw that the dinky template uses some sort of build version number passed by github on build to cachebreak. I'm not sure how that works or if it can work the same way for 11ty. Perhaps I need to pass a datetime stamp for each build instead? Something to figure out later.

[ ] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is how Jekyll accomplishes this, but is there a way to push that into the build process for 11ty?


