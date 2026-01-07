---
title: XYZ Site - Day 2 - Site exports to markdown blogposts
description: "Getting my various content about books exported and into this site."
date: 2024-03-17 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
---

## Project Scope and ToDos

1. Create a versatile blog site
2. Create a framework that makes it easy to add external data to the site

- [ ] Give the site the capacity to replicate the logging and rating I do on Serialized and Letterboxd.
- [ ] Be able to pull down RSS feeds from other sites and create forward links to my other sites
- [ ] Create forward links to sites I want to post about.
- [ ] Create a way to pull in my Goodreads data and display it on the site
- [ ] Create a way to automate pulls from other data sources
- [ ] Combine easy inputs like text lists and JSON data files with markdown files that I can build on top of.
- [ ] Add a TMDB credit to footer in base.njk
- [ ] Make sure tags do not repeat in the displayed tag list.

## Day 2

I've decided that I really want to make this site a repository of my site export data. I'll start with manual exports first. I've pulled my data from JustWatch on TV shows, I got an export from Letterboxd and now I'm working through my previously treated data from a Goodreads export. I'll likely end on my [Pocket](https://support.mozilla.org/en-US/kb/exporting-your-pocket-list) data for dealing with exports. The next step will be moving over content automatically as I update the other sites. But that's for another day.

As I was exploring the options for an up to date dump of my GoodReads data, I found that they killed their API making this whole process a little more difficult to the future. I also realized that, although my Kindle book highlights and quotes are visible in Goodreads, they aren't in the export and I can't find any official way to export them. So I found a site called [Clippings.io](https://clippings.io/) that can get the quotes and deliver them to me in a JSON file. I had to pay a monthly fee to get the big features on the site, but it was pretty reasonable so I don't mind. I should try and remember to turn it off in the future.

For each of these exports I've been processing I've tried to set up a standalone package.json script, and once they're working I can incorporate them into the build process (if I want). I've set one up to test quotes import and see how it works. It pulls from the data file, which itself pulls from a sources JSON I set up when I was thinking of writing these all to a JSON file, but I've decided to write them to Markdown instead, like all the rest of these. I just like the idea of individual pages being mapped to individual files and long JSON files that have no limit just seem like a recipe for disaster.

`git commit -am "Adding media template and setting up for quotes"`

The resulting file will give me a lot more data than I need at this moment, but I don't mind. But it is a lot of disorganized files. I wonder if I should folder them by book, or organize the file names by date to make it a little more parsable. Considering how I dip in and out of books I don't think organizing by date is the right way. I can slug from the `sourceTitle` and use that to add to the file path I'm sending into `processObjectToMarkdown`.

I'll have to figure out how to make source specific pages later.

Hmmm, I'm seeing a rather unhelpful error:

```javascript
[11ty] Problem writing Eleventy templates: (more in DEBUG output)
[11ty] Cannot use 'in' operator to search for 'date' in 43 (via TypeError)
[11ty]
[11ty] Original error stack trace: TypeError: Cannot use 'in' operator to search for 'date' in 43
[11ty]     at Template.addPageDate (.../node_modules/@11ty/eleventy/src/Template.js:405:34)
[11ty]     at async Template.getData (.../node_modules/@11ty/eleventy/src/Template.js:390:18)
[11ty]     at async TemplateMap.add (.../node_modules/@11ty/eleventy/src/TemplateMap.js:65:16)
[11ty]     at async Promise.all (index 381)
[11ty]     at async TemplateWriter._createTemplateMap (.../node_modules/@11ty/eleventy/src/TemplateWriter.js:325:5)
[11ty]     at async TemplateWriter.generateTemplates (.../node_modules/@11ty/eleventy/src/TemplateWriter.js:360:5)
[11ty]     at async TemplateWriter.write (.../node_modules/@11ty/eleventy/src/TemplateWriter.js:407:23)
[11ty]     at async Eleventy.executeBuild (.../node_modules/@11ty/eleventy/src/Eleventy.js:1191:13)
[11ty]     at async Eleventy.watch (.../node_modules/@11ty/eleventy/src/Eleventy.js:1014:18)
```

Seems like it is a template rendering problem. I've added some data properties to help me debug this sort of thing so I can more easily see the possible templates having a problem:

- `src/_includes/layouts/page.njk`
- `src/resources/types.njk`
- `src/_includes/layouts/page-resource.njk`

Of those three, the only concern is on page-resource.njk. I'll start there. This code appears to be the problem, as it assumes a date value, and there should be one on all of these.

(remove backslashes)

```liquid
{\% set subTitle %\}
    posted on <time datetime="{\{ page.date.toISOString() }\}">{\{ page.date | dateToFormat("DDD") }\}</time> in: {\% include "../components/tag-list.njk" %\}.
{\% endset %\}
```

The error seems to be coming from this area in particular in the 11ty core code:

```javascript
  async addPageDate(data) {
    if (!("page" in data)) {
      data.page = {};
    }

    let newDate = await this.getMappedDate(data);
    console.log(data.page);
    if ("page" in data && "date" in data.page) {
      debug(
        "Warning: data.page.date is in use (%o) will be overwritten with: %o",
        data.page.date,
        newDate
      );
    }

    data.page.date = newDate;

    return data;
  }
```

But I'm not sure *why*. I've tried removing the date property, but that's not working. But it is def the quote md files causing the issue, because removing them stops the error.

Oh, my Quote posts have their own `page` property (the page the quote was on) and that is conflicting with how `page` objects work in Eleventy. Apparently this is sort of a protected property, but not in a way that it emits a useful warning >.<. I'll replace it with `pageNum` as the property.

`git commit -am "Get quotes working by avoiding conflict with the page object"`

Ok, that looks good. Still getting a conflict, this time with my custom slugs not passing through. It looks like the logic for resource pages doesn't include a slug if I set one in the post. I can correct it to check for the `slug` field.

Looking good, I now have to deal with the quote files that have `publish: false` attached to them. This [isn't a 11ty](https://github.com/11ty/eleventy/issues/188) [native concept](https://github.com/11ty/eleventy/issues/2060), so I'll have to build some logic in to keep them out of the flow.

I'm going to adapt the approach in the [Eleventy Base Blog](https://github.com/11ty/eleventy-base-blog/blob/main/eleventy.config.drafts.js).

Ok, so after some experimentation, I don't think this is working, though [I'm not sure why](https://github.com/11ty/eleventy-base-blog/issues/173).

I'm not entirely sure what the issue was, but I've solved it by adding new logic on filtering into the file at `lib/collections.js` to filter the default inclusion logic for the `post` collection. This seems to have worked even where a file might be in another collection. I guess no collection gets made that isn't made through that file, so it has total control. Good to know. In any case, my new more extensive draft logic does seem to work now.

I've added an additional control to by dotenv file `DRAFT_FREE="false"` to allow me to turn off drafts, even in the local development environment. This also means that I'll be draft free by default in my dev env. I know a lot of folks manage drafts more actively looking at them in the built site, but I'm not currently doing that. Maybe if I start, I'll have to figure out some more elaborate logic. The template does support that flow by showing draft posts in place with `(D) ` in red before the title. That's pretty cool, even if I'm not planning to use it!

`git commit -am "Add logic to manage draft mode and a no-publish mode"`

