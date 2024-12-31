---
title: Setting up a python project to handle Foursquare data exports
description: "Foursquare gave me a big hunk of data files, now what do I do with it?"
date: 2024-12-25 10:59:43.10 -4
tags:
  - Python
  - Foursquare
  - Location Data
  - Jupyter Notebook
  - Jupyter
---

## Project Scope and ToDos

1. Create a new site
2. Process the Foursquare data to a set of locations with additional data
3. Set the data up so it can be put on a map (it needs lat and long)

- [ ] Can be searched
- [ ] Can show travel paths throughout a day

## Day 1

Since the Foursquare site is shutting down I got a data export. I have to decide what I want to do with it now that I have it. It is a big set of data, so I will need to do some work to make it usable and figure out how to treat it and turn it into the type of site I want.

Big dataset, so let's turn to Python to process it. That's what it is best at. It has been a while, but I can start drawing some interesting conclusions from it for sure.

There are a bunch of different files, and it seems like the `checkins` files are the most relevant. But they don't have latitude and longitude data attached. That's not great. I also have a `visits` file that does have latitude and longitude, but it does seem to map to anything.

I'll assemble the data into a Pandas dataframe to start playing with it. See if I can find if the two connect at all.

It looks like someone else has encountered this problem. [They recommend hitting the Foursquare API to get the lat/long](https://stackoverflow.com/questions/77261620/get-lat-long-of-foursquare-data).

```python
import requests
import json
import csv

headers = {
    "accept": "application/json",
    "Authorization": "YOUR_API_KEY"
}

# define path for products adoc file
path = r'foursquare.csv'

# clear attributes file if exists
c = open(path,'w')
c.close()
csv = open(path, 'a')

with open('ids.txt', 'r') as f:
  for line in f:
    fsq_id = str(line).replace("\n","")
    url = "https://api.foursquare.com/v3/places/"+fsq_id+"?fields=geocodes"
    response = requests.get(url, headers=headers)
    if response.status_code != 404:
        locations = response.json()
        csv.write(fsq_id)
        csv.write(", ")
        csv.write(str(locations['geocodes']['main']['latitude']))
        csv.write(", ")
        csv.write(str(locations['geocodes']['main']['longitude']))
        csv.write("\n")

print("done")
```

This leverages the [Place Details API](https://location.foursquare.com/developer/reference/place-details).

Once I loaded the JSON files into memory, I can walk them into a dataframe:

```python
# Create a DataFrame from the list of dictionaries
df = pd.DataFrame(columns=[
    'id',
    'createdAt',
    'type',
    # 'visibility',
    'timeZoneOffset',
    'venueId',
    'venueName',
    'venueURL',
    'commentsCount'
])

for checkinList in data:
	for item in checkinList["items"]:
		if 'venue' not in item:
			continue
		df = pd.concat([pd.DataFrame([[
      item['id'],
      item['createdAt'],
      item['type'],
      # item['visibility'],
      item['timeZoneOffset'],
      item['venue']['id'],
      item['venue']['name'],
      item['venue']['url'],
      item['comments']['count']
      ]], columns=df.columns), df], ignore_index=True)


print(df.shape)
```

Checked and for some reason only 1000 items don't have visibility, I've manually defaulted those to "private".

Even now that I've got those included though, the IDs in `visits.json` and `visits.csv` don't map to anything in my checkins.

Now my total checkins in the dataframe are `14265` entries.

Ok, so visits seems to be non-check-in occurrences where I was at a location. The Swarm app will occasionally have draft checkins that it suggests, saying it thinks I was in a particular location and prompting me to check in, correct, or not. This appears to be what is going on here. So for example

```json
		{
			"id": "673e69ccdc7d4627b68ceb3b",
			"userId": "15234",
			"timeArrived": "2024-11-20 22:59:24.483000",
			"timeDeparted": "2024-11-20 23:15:22.419000",
			"os": "Android",
			"osVersion": "12",
			"deviceModel": "SM-G975U1",
			"isTraveling": false,
			"latitude": 40.6436454,
			"longitude": -74.072583,
			"city": "Staten Island",
			"state": "New York",
			"postalCode": "8600000US10301",
			"countryCode": "US",
			"locationType": "Venue"
		}
```

Is a visit. And it happens around the same time as check-ins that I actually made. I looked up the lat/long and found the location seemed to be the Staten Island ferry terminal.

```python
print(df.query('venueName.str.contains("Staten Island")'))
```

Here's the result:

| id                       | createdAt                  | type    | visibility   | timeZoneOffset | venueId                  | venueName                                 | venueUrl                                           | commentsCount |
|--------------------------|----------------------------|---------|--------------|----------------|--------------------------|-------------------------------------------|----------------------------------------------------|---------------|
| 5bc75aa89cadd9002ce17dc3 | 2018-10-17 15:52:08.000000 | checkin | private      | -240           | 4165d880f964a5207e1d1fe3 | Staten Island Ferry - Whitehall Terminal  | https://foursquare.com/v/staten-island-ferry--...  | 0             |
| 673e61fdf804d01340b055f2 | 2024-11-20 22:26:05.000000 | checkin | closeFriends | -300           | 4165d880f964a5207e1d1fe3 | Staten Island Ferry - Whitehall Terminal  | https://foursquare.com/v/staten-island-ferry-- ... | 0             |
| 673e69ccc2749c4b190f5fb9 | 2024-11-20 22:59:24.000000 | checkin | closeFriends | -300           | 4a478d19f964a520d2a91fe3 | Staten Island Ferry - St. George Terminal | https://foursquare.com/v/staten-island-ferry--...  | 0             |
| 673e73175e573a13d383bcfa | 2024-11-20 23:39:03.000000 | checkin | closeFriends | -300           | 4d35e19d6c7c721eb511cf56 | College of Staten Island Main Gate        | https://foursquare.com/v/college-of-staten-isl...  | 0             |
| 673ea1637f8f7e3e6b5232db | 2024-11-21 02:56:35.000000 | checkin | closeFriends | -300           | 4165d880f964a5207e1d1fe3 | Staten Island Ferry - Whitehall Terminal  | https://foursquare.com/v/staten-island-ferry-- ... | 0             |


Ok, well, that seems fine, but no match really. There *is* a close match (if you ignore milliseconds) in timing. But it isn't really enough to join on en-mass, even if it is close. This also shows me that the records that don't have a visibility value look like they are early on in my checkin history, which is useful to know.

So I have 9,993 "visits". Which I think are dismissed check-in prompts?

There's also a whole file for `unconfirmed_vists.json` which has 18,279 entries. Where I can find some matches, it looks like they also are maybe pending prompts that I never confirmed or denied? These aren't just lat and long

There's no clear difference between the two. And there's no documentation from Foursquare. I'm going to go with my assumptions here. In that case, the only thing that matters is my checkins. That's cool.

Interestingly, the unconfirmed_visits have lat and long values. They look like this:

```json
{
	"id":"673a6e9eddf0e34a16590965",
	"startTime":"2024-11-17 22:08:21.628000",
	"endTime":"2024-11-17 22:31:27.761000",
	"venueId":"59e63da08c35dc3e57ab5520",
	"lat":40.74526808227119,
	"lng":-73.99024878341206,
	"venue":{
		"id":"59e63da08c35dc3e57ab5520",
		"name":"Patent Pending",
		"url":"https:\/\/foursquare.com\/v\/patent-pending\/59e63da08c35dc3e57ab5520"
	}
}
```

There is a checkin around this time, found via

```python
print(df.query('venueName.str.contains("Patent Pending")'))
```

I'm pretty sure it is based around the time I did the actual checkin, found that via the above at `createdAt` time `2024-11-17 22:31:33.000000`.

It looks like comments file is pretty useless:

```json
{
	"userId":15234,
	"time":"2017-03-03 02:37:36.000000",
	"comment":"Hey! Just saw this, we just got to Kimchi Grill, if you want to join for food."
}
```

I could potentially make some assumptions on `time`, but it doesn't necessarily map out, comments could happen way later, after other checkins.

Then there is the tips file.

It has objects like:

```json
{
	"id":"670f00d47d191f5820d40dda",
	"createdAt":"2024-10-15 23:55:00.000000",
	"text":"Great bookstore, with drinks, snacks, and plentiful recommendations cards with lots of details.",
	"type":"user",
	"canonicalUrl":"https:\/\/foursquare.com\/item\/670f00d47d191f5820d40dda",
	"flags":[],
	"viewCount":29,
	"agreeCount":0,
	"disagreeCount":0,
	"user":{
		"id":"15234",
		"firstName":"Aram",
		"lastName":"Zucker-Scharff",
		"handle":"chronotope",
		"privateProfile":false,
		"gender":"male",
		"address":"",
		"city":"",
		"state":"",
		"countryCode":"US",
		"relationship":"self",
		"photo":{
			"prefix":"https:\/\/fastly.4sqi.net\/img\/user\/",
			"suffix":"\/15234-EMJINMXJKZ5R5S20.jpg"
		}
	},
	"venue":{
		"id":"64dd65470e981a714e4c9f6c",
		"name":"First Light Books",
		"url":"https:\/\/foursquare.com\/v\/first-light-books\/64dd65470e981a714e4c9f6c"
	}
}
```

There do appear to be associated photos, but those photos don't seem to be in the `pix` folder I got with the export. I tried accessing the URL directly, but didn't get anything at that URL. However, looking at the venue, I didn't upload an image.

But that does match my profile image at `https://fastly.4sqi.net/img/user/64x64/15234-EMJINMXJKZ5R5S20.jpg`.

So I guess that is what that is. This does have a check-in associated with it:


| id                       | createdAt                  | type    | visibility   | timeZoneOffset | venueId                  | venueName                                 | venueUrl                                           | commentsCount |
|--------------------------|----------------------------|---------|--------------|----------------|--------------------------|-------------------------------------------|----------------------------------------------------|---------------|
| 670efb74d8a0e46cd107fea5 | 2024-10-15 23:32:04.000000 | checkin | closeFriends      | -300           | 64dd65470e981a714e4c9f6c | First Light Books  | https://foursquare.com/v/first-light-books/64d...   | 0

Nothing there to associate based on except ID of the venue.

I am starting to conclude that maybe I also need just a listing of all the venues I've visited.

So I need to build a venues dataframe too.

Ok, so we'll need to load a few files:

```python
# Get tips file
tipsFile = open('../foursquare-export/tips.json', 'r')
print(f"Reading tips file")
tipsObject = json.load(tipsFile)
tipsSetObject = tipsObject['items']

# get Venue Ratings
ratingsFile = open('../foursquare-export/venueRatings.json', 'r')
print(f"Reading ratings file")
ratingsObject = json.load(ratingsFile)

venueLikes = ratingsObject['venueLikes']
venueDislikes = ratingsObject['venueDislikes']
venueOkays = ratingsObject['venueOkays']

photosFile = open('../foursquare-export/photos.json', 'r')
print(f"Reading photos file")
photosObject = json.load(photosFile)
photosSetObject = photosObject['items']
```

As you can see, the venue ratings file is divided into `venueLikes`, `venueDislikes` and `venueOkays`. So I'm pulling those out.

So we know what a `tip` looks like.

Here's what each object inside the venue ratings looks like:

```json
{
	"id": "6278124503e634412f05cdaf",
	"name": "Sobremesa Cocina Mexicana",
	"url": "https:\/\/foursquare.com\/v\/sobremesa-cocina-mexicana\/6278124503e634412f05cdaf"
},
```

And then we've got the photos object:

```json
{
	"id":"4db1b674fd28f0dcfa1c0d2c",
	"createdAt":"2011-04-22 17:10:12.000000",
	"prefix":"https:\/\/fastly.4sqi.net\/img\/general\/",
	"suffix":"\/BMGMLXNIP44I0WPVA2LOPEMOYCFXBGQ1ZFTY1IILIQXJP3WA.jpg",
	"width":538,
	"height":720,
	"demoted":false,
	"visibility":"friends",
	"fullUrl":"https:\/\/fastly.4sqi.net\/img\/general\/538x720\/BMGMLXNIP44I0WPVA2LOPEMOYCFXBGQ1ZFTY1IILIQXJP3WA.jpg",
	"relatedItemUrl":"https:\/\/www.swarmapp.com\/checkin\/4db1b66fa86e63d21171a701"
}
```

or

```json
{
	"id":"51fc5b1f498ea67cd47c6be5",
	"createdAt":"2013-08-03 01:21:35.000000",
	"prefix":"https:\/\/fastly.4sqi.net\/img\/general\/",
	"suffix":"\/15234_GrwLQ564TbAJeS3qJjRxK5ZYDOVCj93L1ATyPJt_3RU.jpg",
	"width":720,
	"height":960,
	"demoted":false,
	"visibility":"public",
	"fullUrl":"https:\/\/fastly.4sqi.net\/img\/general\/720x960\/15234_GrwLQ564TbAJeS3qJjRxK5ZYDOVCj93L1ATyPJt_3RU.jpg",
	"relatedItemUrl":"https:\/\/foursquare.com\/v\/51fc5a63498ec02f4de928e0"
},
```

There the `suffix` field does match up with a file in the `pix` folder, so that's where those connect up.

The `relatedItemUrl` doesn't go to anywhere that is online on the web. The value at the end of that though, the `4db1b66fa86e63d21171a701` part of the `relatedItemUrl` does match up with an `id` in the `checkins` files! So that's how I can associate a photo with a check-in and venue it seems.

So what format should the second dataframe be?

I'm thinking:

```python
venuesDf = pd.DataFrame(columns=[
    'id', # venue id
    'name', # venue name
    'url', # venue url
    'latitude',
    'longitude',
    'tipString', # tip text
    'tipCreatedAt',
    'tipId',
    'tipUrl', # tip canonicalUrl
    'tipViews', # tip viewCount
    'tipAgreeCount', # tip agreeCount
    'tipDisagreeCount', # tip disagreeCount
    'rating', # from ratings file, can be like, dislike, okay
    'imageSuffix', # from photos file, is the `suffix` field
    'imageWidth', # from photos file, is the `width` field
    'imageHeight', # from photos file, is the `height` field
    'imageId', # from photos file, is the `id` field
    'imageCreatedAt', # from photos file, is the `createdAt` field
    'checkIns' # array of string checkin IDs.
])
```

Ok, so I want to append the other checkin IDs. How to do this? In theory this should work.

```python
for index, row in df.iterrows():
	venueRow = venuesDf.loc[venuesDf['id']==row['venueId']]
	if venueRow.empty:
		# print(f"Venue not found for {row['venueId']}")
		# continue
		venuesDf.loc[-1] = [
      row['venueId'],
      row['venueName'],
      row["venueURL"],
      "", # latitude
      "", # longitude
      "", # tipString
      "", # tipCreatedAt
      "", # tipId
      "", # tipUrl
      "", # tipViews
      "", # tipAgreeCount
      "", # tipDisagreeCount
      "", # rating
      "", # imageSuffix
      "", # imageWidth
      "", # imageHeight
      "", # imageId
      "", # imageCreatedAt
      [row['id']] # checkIns
      ]  # adding a row
		venuesDf.index = venuesDf.index + 1  # shifting index
		venuesDf = venuesDf.sort_index()  # sorting by index
	else:
		# add a new checkin to the series of checkins for this venue
		venuesDf.loc[venuesDf['id'] == row['venueId'], 'checkIns'] = venuesDf.loc[venuesDf['id'] == row['venueId'], 'checkIns'].apply(lambda x: x + [row['id']])
```

`git commit -am "Getting the initial feed in of venues into their own dataframe"`

Ok, this is appending the ID where needed.

Now I need to get the ratings in:

```python
def addVenueRating(ratingSet, ratingType, venueDFSet):
	for ratingItem in ratingSet:
		venueRatingId = ratingItem['url'].split('/')[-1]
		venueRow = venueDFSet.loc[venueDFSet['id']==venueRatingId]
		if venueRow.empty:
			print(f"Venue not found for {venueRatingId}")
			venueDFSet.loc[-1] = [
				row['venueId'],
				row['venueName'],
				row["venueURL"],
				"", # latitude
				"", # longitude
				"", # tipString
				"", # tipCreatedAt
				"", # tipId
				"", # tipUrl
				"", # tipViews
				"", # tipAgreeCount
				"", # tipDisagreeCount
				"", # rating
				"", # imageSuffix
				"", # imageWidth
				"", # imageHeight
				"", # imageId
				"", # imageCreatedAt
				[row['id']] # checkIns
			]  # adding a row
			venueDFSet.index = venueDFSet.index + 1  # shifting index
			venueDFSet = venueDFSet.sort_index()  # sorting by index
			continue
		venueDFSet.loc[venueDFSet['id'] == venueRatingId, 'rating'] = ratingType

addVenueRating(venueLikes, "like", venuesDf)
addVenueRating(venueDislikes, "dislike", venuesDf)
addVenueRating(venueOkays, "okay", venuesDf)
```

I discovered there were a few venues I guess I rated without a corresponding check-in? Had to make sure to create them I guess.

Ok, now I have ratings and checkins. I now need photos and tips.

Tips first? Ok, this does it:

```python
for tip in tipsSetObject:
	tipVenueId = tip["venue"]["id"]
	venueRow = venuesDf.loc[venuesDf['id']==tipVenueId]
	if venueRow.empty:
		print(f"Venue not found for {tip['id']}")
		continue
	# print(f"Venue found for {tipVenueId}")
	venuesDf.loc[venuesDf['id'] == tipVenueId, 'tipString'] = tip["text"]
	venuesDf.loc[venuesDf['id'] == tipVenueId, 'tipCreatedAt'] = tip["createdAt"]
	venuesDf.loc[venuesDf['id'] == tipVenueId, 'tipId'] = tip["id"]
	venuesDf.loc[venuesDf['id'] == tipVenueId, 'tipViews'] = tip["viewCount"]
	venuesDf.loc[venuesDf['id'] == tipVenueId, 'tipAgreeCount'] = tip["agreeCount"]
	venuesDf.loc[venuesDf['id'] == tipVenueId, 'tipDisagreeCount'] = tip["disagreeCount"]
	venuesDf.loc[venuesDf['id'] == tipVenueId, 'tipUrl'] = tip["canonicalUrl"]

print(venuesDf.loc[venuesDf['id']=="64dd65470e981a714e4c9f6c"])
```

`git commit -am "Set up tip pull into the venue dataframe"`

Next up is the images and then the last thing is to figure out how to pull lat and long data.

Hmmm. Looks like checkins can also have a `shout` value:

```json
{
	"id":"673583d957abcd42163c5c32",
	"createdAt":"2024-11-14 05:00:09.000000",
	"type":"checkin",
	"visibility":"closeFriends",
	"entities":[],
	"shout":"Kareoke time!",
	"timeZoneOffset":-300,
	"venue":{
		"id":"5285412911d2a3e51484ff56",
		"name":"The Brew Inn",
		"url":"https:\/\/foursquare.com\/v\/the-brew-inn\/5285412911d2a3e51484ff56"},
		"comments":{"count":0}
	}
```

Ok, back to photos.

Looks like we got a problem: When the URL for a photo contains `foursquare` it doesn't map to a check-in, but to the location. Need to check.

Interesting. Somehow I have images that don't have attached check-ins. Seems impossible, but ok. Maybe from earlier versions of the app.

The photos don't seem to be joining in. Something is wrong with my logic. Hmmm.

`git commit -am "Attempting to process photos list"`
