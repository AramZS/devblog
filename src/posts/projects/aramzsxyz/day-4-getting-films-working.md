---
title: XYZ Site - Day 4 - Parsing Letterboxd data exports
description: "I like collecting color combinations for future projects but I want to make sure they are a11y AAA contrasts for accessible readability."
date: 2024-05-12 10:59:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - TMDB
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

## Day 4

One of the things I wanted to accomplish here is have this site host my reviews and ratings from Letterboxd. I've pulled a data export from them and it has given me a bunch of CSVs.

I pulled in the `reviews.csv` file without any issues. A film I reviewed and rated will show up in multiple CSVs however. So I need to import them in an order where the most information comes first. Reviews first, then `ratings.csv` and then, if I want to pull them in, `watched.csv` which may include some films that I didn't review or rate but still watched.

However, this appears to have crashed the build process. I rolled it back. I've made some changes and run an import again and it seems to be working. Last time I did `watched` first, but that won't work. I'll start with `ratings`.

An important note is that I need to have Markdown files include *some* content, even if it is an empty string. Otherwise, the build process will crash. Doing that fixes the mysterious `Cannot read properties of undefined (reading 'includes') (via TypeError)` error I was getting during the Eleventy build process.

Hmmm, it doesn't seem like that has worked. There must be an error in another file.

I'll adjust my glob ignore for local development until I identify the file.

Looks like there is something in the 'b's. Let's go deeper:

```js
  // Dev Time Build Ignores
  if (process.env.IS_LOCAL === "true"){
    eleventyConfig.ignores.add("src/content/amplify/2023**");
    eleventyConfig.ignores.add("src/content/amplify/2024-01**");
    eleventyConfig.ignores.add("src/content/amplify/2024-02**");
    eleventyConfig.ignores.add("src/content/amplify/2024-03**");
    eleventyConfig.ignores.add("src/content/resources/film/[c-z]**");
    eleventyConfig.ignores.add("src/content/resources/film/b[j-z]**");
    eleventyConfig.ignores.add("src/content/resources/film/t**");
  }
```

Ok, let's go forward to bp. That works. We'll have to move forward again!

Oh, there's a TV show in here that the TMDB API doesn't like. As a result it doesn't have any of the usual metadata, especially tags. That seems to have been what caused the problem.

Looks like there are a few of those I can find by searching for

```
rating: false
title:
```

I think I can just add tags to fix this as well? Yeah, that does seem to work. I'll also add something in the film-making script to avoid this problem.

`git commit -am "bugfix: Don't write film files with no tags"`

Looks like it is building now!

But hmmm, it looks like the date sort isn't working for the `film-and-tv` page.

Ah, I didn't pick the `data` object to get the key for sorting from. I can fix that.

`git commit -am "End the movies data file and use md files only."`
