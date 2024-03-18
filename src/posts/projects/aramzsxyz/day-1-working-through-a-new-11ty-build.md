---
title: XYZ Site - Day 1 - Working through a new 11ty build
description: "Trying out someone else's approach to 11ty."
date: 2024-02-24 22:59:43.10 -4
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

## Day 1

I've branched the work from <a href="https://photogabble.co.uk/about/" target="_blank">Simon Dann</a> <small>(<a target="_blank" href="https://notacult.social/@carbontwelve">@carbontwelve@notacult.social</a>)</small> whose blog I really liked. I reached out and [got the ok to adapt the site](https://notacult.social/@carbontwelve/111568182431303826) to my own site. So that's what I'm trying to do now. I've been fiddling around to try and figure out how it all works, and it's pretty cool!

One of the things I want to do is be able to contribute back to Dann's site if I have useful improvements. I also did some work that will make a hard split from the origin make sense. So I'm not working on the site as a branch, but I should be able to sync back from and potentially into the original repository. I'm going to add it as an origin I can interact with:

`git remote add upstream git@github.com:photogabble/website.git`

Let's see if that works.

It does! It allows me to cherry-pick improvements from the remote. That's useful, because they've added a lot of updates [since I branched](https://github.com/photogabble/website/commit/c7bf2e5848d46dbecf9772a1a677535630f3c879). We'll see later if I have useful things to contribute back.

Now I want to try and get my TV lists working. I've been playing around with using a text list I pulled from JustWatch activity. I then crawl that and pull metadata and images out of [The Movie DB](https://developer.themoviedb.org/reference/intro/getting-started). I want to combine it or interact with the movie data that is in the `data` folder for global data. But I have to admit, I'm not really clear with how Dann set up processing that into the particular template that shows it. The result is that by using the list mechanism in the site I've ended up having both the TV markdown files I created and the data file writing to the same place. I've got to fix that, but to do that I need a better grasp on what is going on with how the site interacts with the data objects. Dann has made some pretty different structural choices around how to build and 11ty site than any of mine (that's one of the reasons I wanted to work with this code) but it means I'm pretty confused about some of the pages and how they pop into existence at build. That's fine, I want to learn.

Part of the confusion is that Dann has really leaned into some of the Nunjucks 11ty hierarchy for rendering that really got me mixed up the first time around I used it for an 11ty site. I think that it seems the site is just tapping that data object directly into the template. Whereas I can try and change the template to combine the two with a custom layout in the `layouts` folder I think. To combine the two data sources, I'm going to [try a technique I found on Dev.to from Giulia Chiola](https://dev.to/giulia_chiola/add-items-to-an-array-in-nunjucks-482e).

The key to getting the page to display right is to also have some information in the `src/_data/lists-meta.js` file. I actually think I could have put the layout into that file, but I've had my automated process put it into the actual generated MD files for now. Let's see how it goes.

Ok, I've been able to generate the file using my new template, but it doesn't have the new data I put in.

The one issue is the item/post format from 11ty is a lot more complicated than the content from the JS files. Not only that, but I'll need to sort the two together. I know, I'll build a filter! That way I can transform the posts to the simpler format and also handle the date sort.

Dann's project makes it easy to add new filters. I can just add to `lib/filters.js`.

```javascript
const dateSort = (arrayOfObjects, key) => {
	arrayOfObjects.sort(function (a, b) {
		// Turn your strings into dates, and then subtract them
		// to get a value that is either negative, positive, or zero.
		return new Date(b[key]) - new Date(a[key]);
	});
	return arrayOfObjects;
};

const mixedDataSortWatchedMedia = (arrayOfObjects) => {
	let standardizedArrayOfObjects = arrayOfObjects.map((item) => {
		if (item.data) {
			let newObject = {
				...item.data,
				content: item.content,
				date: item.date,
			};
			return newObject;
		}
		return item;
	});
	const sorted = dateSort(standardizedArrayOfObjects, "watchedDate");
	console.log("mixedDataSortWatchedMedia sorted", sorted);
	return sorted;
};
```

That takes care of it!
