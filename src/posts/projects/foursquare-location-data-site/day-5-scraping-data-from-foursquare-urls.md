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
  - Locations
  - requests
  - BeautifulSoup
---

## Project Scope and ToDos

1. Create a new site
2. Process the Foursquare data to a set of locations with additional data
3. Set the data up so it can be put on a map (it needs lat and long)

- [ ] Can be searched
- [ ] Can show travel paths throughout a day

## Day 5

I want to crawl Foursquare URLs for pages I do not have data in the API for. Here's [an example page](https://foursquare.com/v/north-philadelphia/4e9ae7244901d3b0b7190bde): `https://foursquare.com/v/north-philadelphia/4e9ae7244901d3b0b7190bde`

This is one of the pages that are there on the web (though who knows for how long) but are not in the Foursquare Places API. So let's figure out how to determine location data from a URL like that by starting in a Jupyter Notebook.

I'll use `requests` here as well to get the HTML pages. Then I can use the classic `BeautifulSoup` package to parse what I need out of it.

Ok, it turns out that there are two types of pages, ones like the one above, which have lat and long in the metadata, but no additional place/address location data. Then there are ones like [Baruch College's Vertical Campus](https://foursquare.com/v/baruch-college--william-and-anita-newman-vertical-campus/4a494ce4f964a5202cab1fe3) which are locations with place data but are, I guess, not business enough to be in the Places API.

So I can always get lat and long, but I'll need to check if the address block exists:

```python
htmlLatitude = soup.find("meta", property="playfoursquare:location:latitude")
print(htmlLatitude)
print(f"Latitude is {htmlLatitude['content']}")
locationDataDict["latitude"] = htmlLatitude['content'];

htmlLongitude = soup.find("meta", property="playfoursquare:location:longitude")
print(htmlLongitude)
print(f"Latitude is {htmlLongitude['content']}")
locationDataDict["longitude"] = htmlLongitude['content'];

htmlAddressBlock = soup.find("div", itemprop="address")
if htmlAddressBlock is None:
	print("No address block found")
else:
	htmlStreetAddress = soup.find("span", itemprop="streetAddress")
	print(htmlStreetAddress)
	print(f"address is {htmlStreetAddress.string}")
	locationDataDict["address"] = htmlStreetAddress.string;
```

It looks like [the Places API](https://docs.foursquare.com/data-products/docs/places-api) that Foursquare open sourced *is* the API I'm using, so yeah, better crawl the pages I want before they're gone.

Weirdly, this does not appear to have "country" in the HTML. But there is another place to pull it from, the mess of Javascript that gets pushed on to the page. I suppose I could pull this from lat and long, but I'm trying to avoid grabbing a ton of data from external APIs.

I guess someetimes you just need to Do A Regex lol.

```python
# Country pull
pattern = r'","country":"([^"]+)","'
match = re.search(pattern, str(htmlContent))
print("country match")
print(match.groups()[0])
```

Also, it seems not every page has all the address fields, so I'll have to allow some of those to null out.

`git commit -am "Crawl HTML as a fallback to foursquare API 404"`

Ok, I tried writing all of these rows to JSON:

```python
for i in dataFrames["venues"].index:
    idString = dataFrames["venues"].iloc[i].get('id')
    dataFrames["venues"].loc[i].to_json("../datasets/venues/{}.json".format(idString))

for i in dataFrames["photos"].index:
    idString = dataFrames["photos"].iloc[i].get('id')
    dataFrames["venues"].loc[i].to_json("../datasets/photos/{}.json".format(idString))

for i in dataFrames["checkins"].index:
    idString = dataFrames["checkins"].iloc[i].get('id')
    dataFrames["checkins"].loc[i].to_json("../datasets/checkins/{}.json".format(idString))
```

and took a quick skim through it and it looks like everything looks good, plus I have a full archive of all the data I need.
