---
title: Hello World Devblog - Pt. 16
subtitle: Getting this dev blog running
description: Part 16 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-07-25 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - Github Actions
  - WiP
---


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

## Day 16

Ok, so I'd like to continue using my shortcuts like `b/c` or `prob`. Seems like the way to go there is to set it up as a markdown-it shortcode. I'd like to try my hand at that.

We can take a look at [Markdown-it's documentation](https://github.com/markdown-it/markdown-it#api) for help here.

Oh, README says this is the wrong place to look at for plugins. Ok.

[Info for plugin developers](https://github.com/markdown-it/markdown-it/tree/master/docs)... ok, two links in here.

Ok... I'm not sure how useful these are. The douments are nice for understanding the philosophy involved. But not great to kick me off. Ok, [let's take recommendation 2](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md#general-considerations-for-plugins) and look at some existing plugins. It sounds like I might possibly conflict with other plugins, so I prob should use an inline or block rule. That's useful.

Oh, this looks useful and like a good idea, [anchor links on my headers](https://www.npmjs.com/package/markdown-it-anchor).

Let's try and pull it in along with a slugify method that can make for clear URLs.

It recommends I use `'@sindresorhus/slugify'` or `string` to handle the slugify process. The 2nd is basic, but the first doesn't work well with how I structured this project. (It requires being called from a module, and my project isn't set up that way.) So, I'll use `slugify` which I have used in other projects in the past.

Ok, that worked!

`git commit -am "Add anchors to headers"`

Oh, there are some good looking markdown-it plugins here. I'm going to install [the footnote one](https://www.npmjs.com/package/@gerhobbelt/markdown-it-footnote) as well. Oh that didn't work. I'll try [the base one instead](https://github.com/markdown-it/markdown-it-footnote) in a little bit.

Ok... What's a basic looking plugin I can look at easily as an example? The [Wikilinks plugin](https://github.com/kwvanderlinde/markdown-it-wikilinks/blob/master/index.js) looks good.

Ok so... no particular described format and I don't feel like digging through the markdown-it code to figure out how these plugins are supposed to work. Not the most developer friendly library I guess.

Ok, to facilitate a similar structure, I'll take the Wikilinks plugin and place it in my own folder under `_custom-plugins`. I'm not going to be taking in options right now, so I can remove that stuff from the plugin.

The plugin looks like it is very dependent on a modules called `markdown-it-regexp`. So let's [check out how that works](https://github.com/rlidwka/markdown-it-regexp). It [looks like it handles regex rules and does the work of registering those rules](https://github.com/rlidwka/markdown-it-regexp/blob/master/lib/index.js#L61) with the Markdown-it rules manager called `ruler`. It seems to take two arguments, a regex pattern and a function to run on that regex pattern. All this seems relatively straightforward, which makes me feel a lot better about using a library that doesn't seem to have had any activity since 2016.

I have to admit, I'm not super thrilled with Markdown-it. [Normally I use](https://glitch.com/edit/#!/thespin?path=markdown-to-col.js%3A1%3A0) [Showdown](https://www.npmjs.com/package/showdown) for Markdown parsing, but a lot of the Eleventy docs push Markdown-it. I guess I'll stick with it for now, but I'm not sure I'd recommend it or use it in a future project.

Ok, let's strip it down to the basics.

First my regex, I want to replace my use of `prob` with `probably`. So easy enough, gotta surround it with spaces. `/\sprob\s/` is a start. But it looks from the example that I should also have a capture group. Ok so instead I'll make it `/\s(prob)\s/,` Let's assume I'll eventually have a bunch of patterns, so I need to check to see that the pattern is giving me back one of a set of specific patterns. Then I can apply my specific transform.

Hmmm it should work now, but I'm not seeing any results. I tried adding a console.log, but still nothing.

Oh, oops, the pattern I'm using from the Wikilinks plugin, [means I have to execute it as a function first](https://github.com/kwvanderlinde/markdown-it-wikilinks#usage).

Hmmmm. Still no go. Is the plugin even initiating? Let's put a console.log outside of the return statement and see.

Ok, the console.log outside of the return fired (once I exited watch mode and restarted it, I guess plugins don't get reloaded during `watch` mode?). But it isn't treating my text?

Ok, [the sample code](https://jsfiddle.net/yd2gLxev/) given in the Readme of `markdown-it-regexp` doesn't work. It's just failing silently. This isn't a good sign. But there seem to be more modern plugins using it fine? Ok, the issue seems to be with how the jsfiddle is setup. When I set it up in a Glitch site, it seems to work just fine.

Ok, now I am even more annoyed that this isn't working. It should, by all rights. All I can think is that it must have something to do with the specific way eleventy implements Markdown-It?

I tried returning the `Plugin` function from `markdown-it-regexp`. No go there either. Frustrating. Just none of this stuff is executing. I'm starting to think that maybe this is a lost cause. It isn't working and I'm wondering if I should [switch to trying out another option](https://www.npmjs.com/package/markdown-it-regex). Nothing but silent failures. Nothing is working.

Ok, trying to use [markdown-it-regex](https://www.npmjs.com/package/markdown-it-regex). But it won't work either. I keep getting `plugin.apply is not a function`. Which makes me think the problem with the last plugin might be showing up here, where the way the markdown-it tool is being applied by eleventy isn't normal or at least isn't what some of these plugin authors expect.

Ok, nothing working here. Time to switch approaches. [This walkthrough looks like it might be promising](https://docs.joshuatz.com/cheatsheets/node-and-npm/markdown-it/).

`git commit -am "Day 16 - I fail to write a Markdown-it plugin"`
