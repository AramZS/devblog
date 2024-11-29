---
title: XYZ Site - Day 10 - Next step to rebuild Pocket exporting by optimizing for Netlify.
description: "Previously I had exported a nice simple JSON file I could turn into files, but that site broke, so trying Readwise instead"
date: 2024-11-28 17:59:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - CSV
  - CSVs
  - async
  - JSON
  - Pocket
  - Netlify
---

## Project Scope and ToDos

1. Create a versatile blog site
2. Create a framework that makes it easy to add external data to the site

- [ ] Give the site the capacity to replicate the logging and rating I do on Serialized and Letterboxd.
- [x] Be able to pull down RSS feeds from other sites and create forward links to my other sites
- [x] Create forward links to sites I want to post about.
- [ ] Create a way to pull in my Goodreads data and display it on the site
- [ ] Create a way to automate pulls from other data sources
- [x] Combine easy inputs like text lists and JSON data files with markdown files that I can build on top of.
- [x] Add a TMDB credit to footer in base.njk
- [x] Make sure tags do not repeat in the displayed tag list.
- [x] Get my Kindle Quotes into the site
- [ ] YouTube Channel Recommendations
- [ ] Minify HTML via Netlify plugin.

## Day 10

Ok, on a train, and learning all about [the Netlify CLI](https://docs.netlify.com/cli/get-started/) so I can run the [build](https://docs.netlify.com/build-plugins/create-plugins/#local-plugins) [plugin](https://docs.netlify.com/build-plugins/?_gl=1*134epdf*_gcl_au*MTQzNzMxMjc2MS4xNzI0OTA0NzcwLjUwMTc0NTAzMy4xNzMyNDY4MzMzLjE3MzI0NjgzMzM.) to minify the HTML locally.

I'm making sure [my TOML file is configured correctly](https://docs.netlify.com/configure-builds/file-based-configuration/#sample-netlify-toml-file).

Looks like it is. I can console.log to echo the configuration out and make sure.

I think it is set up correctly to use `onPostBuild` so that's good.

I'm installing Netlify's CLI local to the project. So to authenticate in (which I need to do for some reason) I have to use `npx netlify link`.

I logged in last night, but it looks like I need to push `npx netlify status` to get it warmed up or something. Then I can use `npx netlify build`. That gets it running locally!

Looks like these [options](https://github.com/kangax/html-minifier) to give me a similar HTML minification to what I had before:

```bash
{
  collapseWhitespace: true,
  collapseInlineTagWhitespace: false,
  conservativeCollapse: true,
  preserveLineBreaks: false,
  removeComments: true,
  useShortDoctype: true
}
```

I think this is looking pretty good. Let's try and push it out.

`git commit -am "Setting up logging and, hopefully, the right configuration for my Netlify plugin"`

Looks like it works!

I'm actually not sure how much extra time this saves, but I think by running it separate from the build, it should really decrease the amount of stuff that has to be held in memory. All that said, it looks like I've cut down around 10m from my production build time. Def a good sign.

I think the right thing to do, now that I have all these improvements, is merge them into main and then try and merge my Amplify changes in.

Going to also [subtree push](https://www.atlassian.com/git/tutorials/git-subtree)

`git subtree push --prefix plugins/netlify-plugin-html-minify git@github.com:AramZS/netlify-plugin-html-minify.git master`

and [try and see if I can get the current owner of the html minification plugin to update theirs](https://github.com/philhawksworth/netlify-plugin-minify-html/pull/27) and make it more broadly usable!

Decided to start new and pull in the changes from other branches I needed. [And it worked](https://github.com/AramZS/aramzs.xyz/commit/bdd2033f12342d76295a3cb4876c9dd0f78644da)! Things are looking good! Build time is very fast. This is great!
