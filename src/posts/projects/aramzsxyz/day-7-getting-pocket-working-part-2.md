---
title: XYZ Site - Day 7 - Next step to rebuild Pocket exporting - part 2.
description: "Previously I had exported a nice simple JSON file I could turn into files, but that site broke, so trying Readwise instead"
date: 2024-11-21 17:59:43.10 -4
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

## Day 7

Ok, let's look at translating objects from the Pocket API to my own.

Ok, most of the translation is pretty obvious. However, there is something a little weird.

Here's my old object:

```js
let dataSet = {
	link: aChild.href,
	date: isoDate,
	tags: aChild.getAttribute('tags').split(',').filter(e => e).map(tag => tag.toLowerCase()),
	title: aChild.textContent,
	content: '',
	isBasedOn: aChild.href,
	slug: slugger(dateFileString + "-" + aChild.textContent),
	dateFolder: `${year}/${month}/${day}`
}
```

The weird thing is the `textContent` check of the slug. I want to have the same slugs as before. The files do look like they are taking a URL. The `aChild` object is the link but the link it is pulling here is as follows:

```html
<a href="https://www.poynter.org/business-work/2024/over-half-of-journalists-considered-quitting-due-to-burnout-this-year-per-new-report/" time_added="1727312468" tags="journalism">Over half of journalists considered quitting due to burnout this year, per new report - Poynter</a>
```

Well, it should be fine as long as I'm using the same slug right?

Ok, so we'll hook it up to my function and take a look at trying to write some files.

Hmmm, the CLI tool isn't opening the browser like it did before. I wonder if it is a systems thing.

Ok, just needed to restart the computer I guess.

I also needed to break down the date object into a more manageable function:

```js
const dateInfoObjMaker = (initialDateString) => {
  let dateString = '';
  try {
    dateString = initialDateString || '';
  } catch (e) {
    console.log('Date error', el, aChild);
    throw new Error('Could not parse date' + el)
  }
  let dateObj = new Date(parseInt(dateString) * 1000);
  // Generate a file-slug YYYY-MM-DD string from the date
  let date = dateObj;
  let yearFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric' });

  let year = yearFormatter.format(dateObj);
  // Use Intl.DateTimeFormat to get the month in New York timezone
  let monthFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: '2-digit' });
  let month = monthFormatter.format(date);
  // Use Intl.DateTimeFormat to get the day in New York timezone
  let dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', day: '2-digit' });
  let day = dayFormatter.format(date);
  let dateFileString = `${year}-${month}-${day}`;
  let isoDate = '';
  try {
    isoDate = dateObj.toISOString();
  } catch (e) {
    console.log('Date error', e, dateString);
    throw new Error('Could not parse date' + dateString)
  }
  return {
    year: year,
    month: month,
    day: day,
    dateFileString: dateFileString,
    isoDate: isoDate
  }
}
```

Looking good! I think I got it:

```js
{
	link: 'https://www.axios.com/2024/11/21/sec-chair-gary-gensler-step-down',
	date: '2024-11-21T18:04:50.000Z',
	tags: [ 'economy', 'politics' ],
	title: 'https://www.axios.com/2024/11/21/sec-chair-gary-gensler-step-down',
	description: '',
	content: '',
	isBasedOn: 'https://www.axios.com/2024/11/21/sec-chair-gary-gensler-step-down',
	slug: '2024-11-21-httpswwwaxioscom20241121sec-chair-gary-gensler-step-down',
	dateFolder: '2024/11/21'
},
```

The next step is seeing how it looks when I write it to a file.
