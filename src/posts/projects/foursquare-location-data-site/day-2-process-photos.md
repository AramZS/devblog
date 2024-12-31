---
title: Handling photos and getting the actual locations for Foursquare location data from an export
description: "Foursquare export files with venues and checkins somehow don't have the actual lat and long data I need."
date: 2024-12-26 10:59:43.10 -4
tags:
  - Python
  - Foursquare
  - Location Data
  - Jupyter Notebook
  - Jupyter
  - request
---

## Project Scope and ToDos

1. Create a new site
2. Process the Foursquare data to a set of locations with additional data
3. Set the data up so it can be put on a map (it needs lat and long)

- [ ] Can be searched
- [ ] Can show travel paths throughout a day

## Day 2

I think I got it writing photos effectively, but I think I made a mistake trying to put them in the venue dataframe. I need a photo table.

`git commit -am "Setting up a dataframe for individual photos"`

Ok, I can see how to do it, but the sequence is getting complicated. I want to actually set up some functions and call them into the notebook I'm working on. Then I need to do the next thing, which is resolve venues to have lat and long values.

`git commit -am "Processing sequence of files into dataframes now in functions"`

Oh, I know some photos exist without a checkin, which means no venue entry. I'll have to add that.

`git commit -am "Photos should always have venues associated with them."`

Ok, so now we gotta look at hitting the Foursquare API to get the correct lat and long data.

## Using the Foursquare API

Ok, I tried out the [place details endpoint in the FourSquare API Explorer](https://docs.foursquare.com/developer/reference/place-details).

It returns an object like this:

```json
{
  "fsq_id": "59e63da08c35dc3e57ab5520",
  "categories": [
    {
      "id": 10032,
      "name": "Night Club",
      "short_name": "Night Club",
      "plural_name": "Night Clubs",
      "icon": {
        "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/nightclub_",
        "suffix": ".png"
      }
    },
    {
      "id": 13009,
      "name": "Cocktail Bar",
      "short_name": "Cocktail",
      "plural_name": "Cocktail Bars",
      "icon": {
        "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/cocktails_",
        "suffix": ".png"
      }
    },
    {
      "id": 13021,
      "name": "Speakeasy",
      "short_name": "Speakeasy",
      "plural_name": "Speakeasies",
      "icon": {
        "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/secretbar_",
        "suffix": ".png"
      }
    }
  ],
  "chains": [],
  "closed_bucket": "Unsure",
  "geocodes": {
    "drop_off": {
      "latitude": 40.745138,
      "longitude": -73.990299
    },
    "main": {
      "latitude": 40.745324,
      "longitude": -73.990221
    },
    "roof": {
      "latitude": 40.745324,
      "longitude": -73.990221
    }
  },
  "link": "/v3/places/59e63da08c35dc3e57ab5520",
  "location": {
    "address": "49 W 27th St",
    "census_block": "360610058001001",
    "country": "US",
    "cross_street": "btwn Broadway & 6th Ave",
    "dma": "New York",
    "formatted_address": "49 W 27th St (btwn Broadway & 6th Ave), New York, NY 10001",
    "locality": "New York",
    "postcode": "10001",
    "region": "NY"
  },
  "name": "Patent Pending",
  "related_places": {
    "parent": {
      "fsq_id": "59e618dc4c9be64fbe509006",
      "categories": [
        {
          "id": 13035,
          "name": "Coffee Shop",
          "short_name": "Coffee Shop",
          "plural_name": "Coffee Shops",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_",
            "suffix": ".png"
          }
        },
        {
          "id": 13034,
          "name": "Café",
          "short_name": "Café",
          "plural_name": "Cafés",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/cafe_",
            "suffix": ".png"
          }
        }
      ],
      "name": "Patent Coffee"
    }
  },
  "timezone": "America/New_York"
}
```

Ok, that has all the information I need! And a lot more besides. I was thinking I could just pull the information in to the dataframe, and I think that is true, but also I think I want to just replicate the object into a physical file for now. I might want to do more with it later.

I want to play around with these new functions and [test them](https://saturncloud.io/blog/how-to-import-python-file-as-module-in-jupyter-notebook/) in my Jupyter Notebook. [Looks like](https://stackoverflow.com/questions/1254370/reimport-a-module-while-interactive) the best way to do this is with [autoreload](https://ipython.readthedocs.io/en/stable/config/extensions/autoreload.html).

```python
%autoreload 2
import data_processing

config = dotenv_values('../.env')
apiKey = config['FSQ_API_KEY']

data_processing.get_place_details("59e63da08c35dc3e57ab5520", apiKey)
```

`git commit -am "Adding FSq API checks and file writing and new notebook for testing functions"`


