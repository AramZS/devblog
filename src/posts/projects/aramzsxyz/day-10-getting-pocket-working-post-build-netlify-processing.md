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
- [x] Minify HTML via Netlify plugin.

## Day 10

Ok, on a train, and learning all about [the Netlify CLI](https://docs.netlify.com/cli/get-started/) so I can run the [build](https://docs.netlify.com/build-plugins/create-plugins/#local-plugins) [plugin](https://docs.netlify.com/build-plugins/?_gl=1*134epdf*_gcl_au*MTQzNzMxMjc2MS4xNzI0OTA0NzcwLjUwMTc0NTAzMy4xNzMyNDY4MzMzLjE3MzI0NjgzMzM.) to minify the HTML locally.

I'm making sure [my TOML file is configured correctly](https://docs.netlify.com/configure-builds/file-based-configuration/#sample-netlify-toml-file).

Looks like it is. I can console.log to echo the configuration out and make sure.

I think it is set up correctly to use `onPostBuild` so that's good.

### Using Netlify CLI

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

### Subtree Update

Going to also [subtree push](https://www.atlassian.com/git/tutorials/git-subtree)

`git subtree push --prefix plugins/netlify-plugin-html-minify git@github.com:AramZS/netlify-plugin-html-minify.git master`

and [try and see if I can get the current owner of the html minification plugin to update theirs](https://github.com/philhawksworth/netlify-plugin-minify-html/pull/27) and make it more broadly usable!

### Things looking good!

Decided to start new and pull in the changes from other branches I needed. [And it worked](https://github.com/AramZS/aramzs.xyz/commit/bdd2033f12342d76295a3cb4876c9dd0f78644da)! Things are looking good! Build time is very fast. This is great!

So a quick review of what worked here!

- I altered the process of loading postcss to manage it through the 11ty loader. This allowed me to specify a single file to process, cutting down on the persistent set of files that were getting built to never be used.
- I moved the HTML Minification process out of the 11ty flow. By moving it to a Netlify plugin it allowed Node to drop the memory used to build the site with 11ty and avoid the memory limit I was tripping over before by initiating a new block of memory instead of continuing to expand what 11ty was working with.
- I took a look at a Nunjucks filter that was running on every page and prioritized which pages it needed to run on and which I could avoid. Since my Amplify pages forward users directly to the target site, there's no need to have a bunch of article counts no one will ever see. I removed it.
- The `filter` native Array property function is surprisingly expensive in execution time. Running it at even the reduced scale was pretty harmful to my build time. I switched it to a custom function which should consistently perform better
- The `groupByKey` function is pretty powerful and clever! But I was only using it to count up a bunch posts and generate a full count number. I could make it a lot more performant by having it skip `mediaType` posts when they were not intended to be included. Then even faster by having it skip Amplify posts.
- I could also speed up `groupByKey` significantly by switching it to using a standard `Object` instead of a `Map`. Maps are cool, and I like using them, but it turns out they take a *lot* more to process than standard objects. I wasn't really using their special features here, so I switched to a standard object.
- Finally, on the `groupByKey` front, it's important to use the right tool for the right job. I may use it for other things later, but by having it build the huge object filled with every post in the collection it was sticking a ton of data in the active memory during the build. I made a `countByKey` function that just added up the posts and stored a single number instead of the whole object for each post. This really did great things for performance as well.
- I added the 2023 Amplify posts to the ignore list via `eleventyConfig.ignores.add("src/content/amplify/2023/**");`. I don't really need them right now. [Good URLs stay alive forever](https://www.w3.org/Provider/Style/URI) though, so, even though I don't think there are a ton of my Amplify links floating around, I'd like to get them back online. One of my ideas on this front is to use a date check to decide to automatically ignore a segment of Amplify posts and push them to my `_redirects` file instead, so they'll keep doing what they are intended to do without weighing down the build time. Something to experiment with later.

There is likely more I can do to improve appearance, but it is high difficulty. Most notably, I could remove Amplify entirely from the `contentType` grouping. I really should have thought that through the first time, but now I'm pretty locked in though a bunch of places and fixing it is going to be a huge pain. I am having really good performance right know though, way better than even before I added all the Amplify posts. I think I'll save this as an option for later, if it is needed.

I'm pretty happy with all this, and the significant improvement in build time it created! I'm pretty consistently under 200s now! A huge improvement! We'll have to keep an eye on the stats here and see when we might need to improve a little more in advance this time.

Also, I noticed that there are some rendered files, like the Amplify files, that are just pretty large when they don't need to be. I could play around with improving that in the future. But for now, yay, my site works again!

Before:

![Extensions activation](/img/before-build-time.png)

After:

![Extensions activation](/img/after-build-time.png)

