---
title: Hello World Devblog - Pt. 6
subtitle: Getting this dev blog running
description: Part 6 of setting up 11ty deb blog.
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - Github Actions
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

The most upvoted solution I saw for Github Pages deployment was [the LinkedIn post by Lea Tortay](https://www.linkedin.com/pulse/eleventy-github-pages-lea-tortay/) I found earlier. While I've managed a number of other deploy approaches, I actually have never written my own Github Pages deployment process, so figuring that out was one of my goals with this project. Let's start with that.

Oh, lol the wifi was only free for the first 5 minutes I guess? Ok, I'll pay.

Hmmmmm Captive Portal problems. Time to reboot.

Had to reboot, find the captive portal URL, cycle my DHCP lease and then pay for the privlige, but on the interwebs again. Payed to get on.

Ok, implimented the Github actions file with a few small changes, I went ahead and updated `node-version` to match my latest version and switched by branch from master to main. Took care of the keys as specified. The action ran... but no joy. Maybe the problem is a lack of index page? Let's try putting one together.

Huh... it build from the file at `src/index.njk` once... and now it hasn't again. I made my defaults layout the same as my posts layout, so it should work. But after I wiped it out one time, it hasn't built again.

Is it possible to have the docs content not committed on `main` but only on `gh-pages`? That would seem to be a good solution, but let's see.

Ooops, I was fiddling with trying to build a useful gitignore file for docs and passing it through and accidentally deleted all my layouts.

Let me pull those files back in from the last good commit: `git checkout 32e6206c0680d9009a316b85e33461479058d81d src/_layouts/*`

Yup that did it. My Index file is back.

Build still isn't working. Hmmm where are the logs for this?

Ok, [in the Actions tab](https://github.com/AramZS/devblog/actions), not in settings.

Looks like it isn't pulling in Dinky properly as a submodule because [Github Pages needs the https url for the repo in .gitsubmodules](https://docs.github.com/en/pages/getting-started-with-github-pages/using-submodules-with-github-pages).

Hmmm, still not working.

Ah, the issue is that the default configuration of Jekyll github pages pulls in submodules, but [the default configuration of the checkout action doesn't](https://github.com/actions/checkout). I just need to add that property to the yml file.

Oh, and fix my `.editorconfig` to work better with yml files.

`git commit -am "Get submodules working for github actions hopefully"`

Good news, a new error!

```bash
Run peaceiris/actions-gh-pages@v3
[INFO] Usage https://github.com/peaceiris/actions-gh-pages#readme
Dump inputs
Setup auth token
  Error: Action failed with "not found deploy key or tokens"
```

Oops, but the secret in a custom environment instead of the `github-pages` [environment](https://github.com/AramZS/devblog/settings/environments).

Hmmm... deploy was a success this time, but no-go on seeing any pages? Looks like it just deleted everything but the nojekyll file? I should prob look a little deeper into what is going on with these GitHub actions.

Ooooh. I should make a markdown code to expand my little typing shortcuts!

[ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

`git commit -am "Have I got the secret now?"`

