---
title: Dealing with Foursquare checkins that don't have an API response
description: "If it doesn't make money it apparently isn't in the Foursquare API"
date: 2025-01-04 11:59:43.10 -4
tags:
  - Python
  - Foursquare
  - Location Data
  - Jupyter Notebook
  - Jupyter
  - WiP
---

## Project Scope and ToDos

1. Create a new site
2. Process the Foursquare data to a set of locations with additional data
3. Set the data up so it can be put on a map (it needs lat and long)

- [ ] Can be searched
- [ ] Can show travel paths throughout a day

## Day 4

Ok, I've got the whole setup for retrieving from the API done. Places that 200 are being integrated into the dataframe successfully and also being written to local JSON files.

There's only one problem, check-in locations that don't correspond to a business aren't in [the API](https://docs.foursquare.com/developer/reference/place-details) and I have a ton of them.

I'm going to write them all to files, this allows me to debug them a little easier.

`git commit -am "Adding more processing for Foursquare's API to get the data I need."`

I think I'm going to have to crawl the pages, which are still up for now. That will hopefully get me the data I need.

Every page has this data in the HEAD, it looks like!

We can see lat and long in:

```html
<meta content="40.73920556687168" property="playfoursquare:location:latitude">
<meta content="-73.95259827375412" property="playfoursquare:location:longitude">
```

That is likely all I need, but I can also get the address info it looks like, that's on the page in structured HTML:

```html
<div class="venueAddress">
	<div class="adr" itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
		<span itemprop="streetAddress">Pulaski Bridge</span> (at Newtown Creek)<br><span itemprop="addressLocality">Brooklyn</span>, <span itemprop="addressRegion">NY</span> <span itemprop="postalCode">11211</span>
	</div>
</div>
```

I'll need to add a function to access the `url` from the dataframe and crawl that page, and do it quickly before this stuff goes offline, assuming it still will. I can then pull that data into my dataframe.

I'll likely have to use [beautifulsoup](https://beautiful-soup-4.readthedocs.io/en/latest/).

I also should investigate if [the new Places data set](https://location.foursquare.com/resources/blog/products/foursquare-open-source-places-a-new-foundational-dataset-for-the-geospatial-community/) that was open sourced might have this data and, if so, how I can access it.
