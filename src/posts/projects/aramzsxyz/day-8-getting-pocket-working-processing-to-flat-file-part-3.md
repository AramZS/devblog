---
title: XYZ Site - Day 7 - Next step to rebuild Pocket exporting.
description: "Previously I had exported a nice simple JSON file I could turn into files, but that site broke, so trying Readwise instead"
date: 2024-11-26 17:59:43.10 -4
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

## Day 8

Ok, I'm pulling the link object into my markdown writer and it is looking good. It is retaining the right naming conventions.

I'm going to use Sort - Oldest to see if it will match up with my old file titles. It looks like it might be rewriting over existing files. I don't want that. I'll try passing in the neverOverwrite property I assigned to my JSON-to-flat-file creator. I also want to try and figure out how to bring in cover images for social for this. I should be able to pull them out of the pocket object.

`git commit -am "Pocket API now writing files. Looking good thus far."`

Ok, it's looking good. I had to adjust how images are rendered to check if they have https in the string and not try to prepend my img path if they do.

Now I'm pre-setting some of the set up to crawl the whole API and get every article I'm missing. I want to use the `since` param in the config I pass to only get new articles after this, so I'll set up for that too.

```js

const walkPocketAPI = async () => {
  // let resultObj = await processPocketExport(0);
  let offset = 0;
  let total = 0;
  // let resultSet = [];

  do {
    let resultObj = await processPocketExport(offset);
    // resultSet = resultSet.concat(resultObj.resultSet);
    total = resultObj.total;
    offset += resultObj.resultSet.length;
  } while (total > 0);

  return resultSet;
  // return result;
}
```

Hmmm. It looks like the API response isn't sending me a `total` value. Well, let's adjust to that.

Oops, forgot to make sure that it can handle a lack of tags. I'll fix that.

Ok, now I just need to make sure I can handle a few other places it can fail and fix the return in the above function and I should be good to go.

`git commit -am "Got the Pocket walker and since functionality working"`


