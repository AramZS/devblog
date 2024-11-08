---
title: XYZ Site - Day 5 - Rebuilding my quotes flat file generator
description: "Previously I had exported a nice simple JSON file I could turn into files, but that site broke, so trying Readwise instead"
date: 2024-11-08 17:59:43.10 -4
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
- [ ] Get my Kindle Quotes into the site
- [ ] YouTube Channel Recommendations

## Day 5

So previously I had a simple JSON file I could pull from Clippings.Io and just walk each object and turn it into a flat file. It was such a negligible transform I didn't even think much about it. Now that service appears to have broken, so I'm looking at a new service called Readwise. Let's see if it works.

I played around with some more specific CSV to JSON libraries, but they really didn't work so I'm going with `csv` and `csv-parse` to keep it as simple as possible. Now I'll have to write more of my own code, but obviously I don't have any problem with that. First let's try to make sure everything works as intended:

```js
async function readCSVFromFolder(folderPath) {
  //let parse = csvParse.parse({delimiter: ":"});
  const records = [];
  let counter = 0;
  let headers = [];
  const parser = fs
  .createReadStream(`./to-process/readwise-data.csv`)
  .pipe(csvParse.parse({
    trim: true,
  // CSV options if any
  }));
  for await (const record of parser) {
    if (counter === 0) {
      // Skip the first row
      counter++;
      headers = record;
      continue;
    }
    counter++;
    // Work with each record
    let jsonRecord = record.reduce((acc, value, index) => {
      acc[headers[index]] = value;
      return acc;
    }, {});
    records.push(record);
    console.log(jsonRecord);
  }
  console.log(records);
}
```

This is mostly [straight out of the documentation](https://csv.js.org/parse/examples/async_iterator/#async-iterator). I've never used an async iterator like this before, but it does make things a lot easier.

It's a simple library, so it is just taking each CSV item and turning it into an entry in an array. Each entry is itself an array. But I want JSON objects. So I took the first entry of the array (where the table headers are) and wrote it out to an array. Now I can use that array to pull from for my object keys.

Very straightforward here. And it works! Here's the first object on my list:

```json
{
  Highlight: 'Words can be like X-rays, if you use them properly—they’ll go through anything. You read and you’re pierced.',
  'Book Title': 'Brave New World',
  'Book Author': 'Aldous Huxley',
  'Amazon Book ID': 'B000FA5R5S',
  Note: '',
  Color: 'yellow',
  Tags: '',
  'Location Type': 'location',
  Location: '911',
  'Highlighted at': '2011-01-30 04:56:00+00:00',
  'Document tags': ''
}
```

These aren't the best JSON object keys, but it is a good start.

I'm not deep in fancy typescript or anything here so I have to map these out to the object I built from the old format, using a class-style function:

```js
function Quote(quoteObj) {
	this.sourceTitle = "";
	this.cite = {
		name: "",
		href: "",
	}; // author
	this.blockquote = "";
	this.createdDate = new Date().toISOString();
	this.publishDate = new Date().toISOString();
	this.location = 0;
	this.type = "quote";
	this.handedFrom = "Kindle";
	this.referringUri = false;
	this.notes = [];
	this.publish = true;
	this.slug = false;
	this.tags = ["Quote"];
	Object.assign(this, quoteObj);
	var quoteHasContent = false;
	if (
		quoteObj.hasOwnProperty("blockquote") &&
		quoteObj.blockquote.length > 3
	) {
		quoteHasContent = true;
	}
	if (!quoteHasContent) {
		this.publish = false;
	}
  if (this.hasOwnProperty("page")){
    this.pageNum = this.page;
    delete this.page;
  }
}
```

There are a few extra fields here because my quotes section isn't *only* for Kindle quotes, it's for everyone! But that structure, if I keep to it, will mean that I have to do very little change at the file writing stage.

There is a major change I will have to do. Previously my parse and write process was very blunt. It was fine for running locally but now that I've got a Readstream I can operate on the CSV with more efficiency. It will be more performant to, instead of parse the file, get the objects, right the objects; parse the individual objects, and write them to the flat files I use for my site at that time, during the processing of the Readstream.

That's fine. LFG!!!

Let's do the transform to the new format:

```js
function readwiseReformatQuote(clipping) {
	// console.log("Clipping", clipping);
	var quoteObj = {
		sourceTitle: clipping["Book Title"],
		cite: {
      name: clipping["Book Author"],
      href: false
    },
		blockquote: clipping.Highlight,
		location: clipping['Location Type'] === "location" ? clipping.Location : null,
		page: null,
		createdDate: clipping["Highlighted at"],
    date: new Date(clipping["Highlighted at"]).toISOString(),
		publishDate: null,
		annotationType: "Highlight",
		notes: clipping.Note ? [clipping.Note] : [],
		publish: clipping.publish ? clipping.publish : true,
    tags: clipping["Document tags"] ? clipping["Document tags"].split(',') : [],
	};
	console.log("Readwise transformed", clipping, quoteObj);
	return quoteObj;
}
```

Here is the function for writing the file:

```js
function quoteObjectWriter(quoteObj){
  let sourcePath = '';
  if (quoteObj.sourceSlug && quoteObj.sourceSlug.length > 0) {
    sourcePath = `/${quoteObj.sourceSlug}`;
  }
  return processObjectToMarkdown(
    "title",
    "content",
    "./src/content/resources/quotes"+sourcePath,
    quoteObj,
    true
  )
}
```

Ok, first test showed some interesting issues. It looks like it pulled in quotes that I exported from Pocket as well, which I forgot was something I added to Readwise. This is cool! I want some way to differentiate the two for further development though!

Here is what a Pocket-sourced Readwise JSON looks like:

```json
{
  Highlight: 'A longstanding 1800s ban on wearing masks during protests in New York State, originally introduced to discourage tenant demonstrations, was repealed in 2020 when the world began wearing masks to stop the spread of COVID-19.',
  'Book Title': 'At-Risk Hell’s Kitchen Resident Hits Out at Proposed Mask Ban',
  'Book Author': 'Dashiell Allen',
  'Amazon Book ID': '',
  Note: '',
  Color: '',
  Tags: '',
  'Location Type': '',
  Location: '0',
  'Highlighted at': '2024-08-03 14:27:41+00:00',
  'Document tags': 'nyc,politics'
}
```

And here is what the file that comes out of that looks like right now:

```md
---
annotationType: Highlight
blockquote: >-
  A longstanding 1800s ban on wearing masks during protests in New York State,
  originally introduced to discourage tenant demonstrations, was repealed in
  2020 when the world began wearing masks to stop the spread of COVID-19.
cite:
  name: Dashiell Allen
  href: false
createdDate: '2024-08-03 14:27:41+00:00'
date: '2024-08-03T14:27:41.000Z'
handedFrom: Kindle
id: 041a7d8c6bd019882888796524cc94ed
location: null
notes: []
pageNum: null
publish: true
publishDate: null
referringUri: false
slug: a-longstanding-1800s-ban-on-041a7
sourceSlug: at-risk-hells-kitchen-resident-hits-out-at-proposed-mask-ban
sourceTitle: At-Risk Hell’s Kitchen Resident Hits Out at Proposed Mask Ban
tags:
  - nyc
  - politics
title: >-
  A longstanding 1800s ban on wearing masks during protests in... - At-Risk
  Hell’s Kitchen Resident Hits Out at Proposed Mask Ban
type: quote
---

> A longstanding 1800s ban on wearing masks during protests in New York State, originally introduced to discourage tenant demonstrations, was repealed in 2020 when the world began wearing masks to stop the spread of COVID-19.
```

I think I can check and if `Location Type` and `Amazon Book ID` doesn't exist then I can assume that the quote is from Pocket. Cool!

For whatever reason Readwise doesn't do the following:

- Include book subtitles
- Include page numbers
- Use special characters like smartquotes in titles.

The first two sort of suck, the 3rd is great. The downside to not including the book subtitles or special characters in titles that were there before is that it means some quotes are recreated in new folders because my parser understands the names to be different. I'm ok with that. I'll delete the old folders.

Let's clean up and recreate with the new rules.

`git clean -fdn` yeah, that looks right.

`git clean -fd`

Ok, let's go again!

`npm run make:quotes`

Ooops. I forgot that setting a property to `null` will still set it to override an object when I merge them. Let's comment out `publishDate` which is intended to show when I published the quote on my site.

`git clean -fd`

Once more:

`npm run make:quotes`

Ok, that looks good, let's try serving it locally!

Cleaning up some of the repeated folders and wow...

It is very weird to me that apparently they just change some of the book titles some times. You'd think that would be a stable identifier for a book published before the internet existed.

Apparently Amazon has re-categorized The Algebraist as being part of Iain M Banks' Culture series? Even though Wikipedia says it is not part of that series? And this has apparently forced the series number to change. Apparently the listing of the Kindle book was altered to make it part of the Culture series as part of a reprinting issued a few months ago. [Some wikipedians are gonna get real mad](https://en.wikipedia.org/wiki/Talk:The_Algebraist#c-Psychobabble-2006-09-01T22:32:00.000Z-Not_a_Culture_novel?).

Why do some Diskworld books not have numbers as part of the subtitle now? Odd. And some of the Discworld novels they *added* numbers to! WTF.

Ok, serves great locally. Looks good.

Let's try connecting a few more import sources to Readwise, running a new export and see what we get.

Annoying that Readwise does nothing to tell me what particular import source a quote comes from. I'm just going to categorize everything that is an article as coming from Pocket for now. It's a bit of a cheat, but it looks like they don't differentiate internally in their own system so *shrugz*.

Better than nothing and hey, I got quote imports working again! Looks like this is a good stopping point.
