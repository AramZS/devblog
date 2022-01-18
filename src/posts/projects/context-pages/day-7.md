---
title: "Day 7: Connecting to Twitter"
description: "I want to get my Tweets archived when I link to them"
date: 2022-1-17 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - archiving
  - Twitter
featuredImage: "memento.png"
featuredImageCredit: "From: Memento Guide - Introduction to Memento"
featuredImageLink: "http://mementoweb.org/guide/quick-intro/"
featuredImageAlt: "Chart of the Memento architecture"
---

## Project Scope and ToDos

1. Take a link and turn it into an oEmbed/Open Graph style share card
2. Take a link and archive it in the most reliable way
3. When the link is a tweet, display the tweet but also the whole tweet thread.
4. When the link is a tweet, archive the tweets, and display them if the live ones are not available.
5. Capture any embedded retweets in the thread. Capture their thread if one exists
6. Capture any links in the Tweet
7. Create the process as an abstract function that returns the data in a savable way

- [x] Archive links on Archive.org and save the resulting archival links
- [ ] Create link IDs that can be used to cache related content
- [ ] Integrate it into the site to be able to make context pages here.
- [ ] Check if a link is still available at build time and rebuild the block with links to an archived link

## Day 7

I want to have a good archive of tweets, with the capability to capture the tweet, even if it is deleted. I also want to be able to capture a whole thread from the starting tweet.

One step at a time, let's capture tweets, create a specific-to-tweet archive mode, and then move on to the thread mode.

I could make a direct communication to the Twitter API, or do some more straightforward API requests, but it looks like there [is a publicly maintained Node package with frequent activity and good contribution](https://github.com/PLhery/node-twitter-api-v2). Let's start there.

I'll need to manage Twitter keys, so I need to use `dotenv` for local development.

Ok, documentation on this package isn't great, so let's start playing with it. First I'll set up a client and set that up with a unit test. Ok, well it looks like that isn't working. Something is wrong with how I'm setting up the client apparently. The most basic version isn't giving me back results.

Ok, I got to keep trying. I think I need to use the app flow here?

The [tutorial](https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/basics.md) they provide is annoyingly not very useful.

Ok, I tested out a few different takes on the authentication flow and got one working on Glitch. It looks like the way to build the client, since I already have the token, is with:

```javascript
	const appOnlyClient = new TwitterApi(process.env.TWITTER_BEARER);
	// const roC = appOnlyClient.readOnly;
	const v2Client = appOnlyClient.v2;
	return v2Client;
```

Ok, to check this is working I need to check deep equality with the expected object. Not sure how to do that with mocha and chai. It [looks](https://medium.com/building-ibotta/testing-arrays-and-objects-with-chai-js-4b372310fe6d) like I can do that with `expect(object).to.deep.include`?

```javascript
var chai = require("chai"),
	expect = chai.expect,
	assert = chai.assert,
	should = chai.should();

const linkModule = require("../src/tweet-archiver");
describe("The Twitter Archive Module", function () {
	// Basic, let's make sure everything is working
	// Some adapted from https://github.com/braintree/sanitize-url/blob/main/src/__tests__/test.ts
	describe("Capture a single tweet", function () {
		this.timeout(60000);
		it("should capture a basic tweet", async function () {
			const getUser = await linkModule
				.getTwitterClient()
				.userByUsername("chronotope");
			expect(getUser).to.deep.include({
				data: {
					id: "15099054",

					name: "Aram Zucker-Scharff",

					username: "Chronotope",
				},
			});
		});
	});
});
```

Yup, that works!

Ok, I've got a basic connection to twitter up and running!

Ok, so now I want to be able to get a Tweet's data from it's URL.

I want to start by [finding an individual tweet](https://github.com/PLhery/node-twitter-api-v2/blob/f4bea02d21b70faabb80973d34dc4ee545da9bf1/doc/v2.md#lookup-for-tweets). I need to regex the number out of the URL and then I can query up the tweet data.


```javascript
const getTweetByUrl = async (url) => {
	var tweetID = url.match(/(?<=status\/).*(?=\/|)/i)[0];
	console.log(tweetID);
	var tweet = await getTwitterClient().tweets([`${tweetID}`]);
	return tweet;
};
```

and in the test:

```javascript
it("should capture a single tweet", async function () {
	const getTweet = await linkModule.getTweetByUrl(
		"https://twitter.com/Chronotope/status/1275920609097199628"
	);
	expect(getTweet).to.deep.include({
		data: [
			{
				id: "1275920609097199628",
				text:
					"@swodinsky Everything connected to " +
					"the internet eventually becomes ads " +
					":/",
			},
		],
	});
});
```

That works!

`git commit -am "Basic Twitter query functionality"`

This is a little troubling though. There's no information about the tweet as a thread. That information is in a standard response from the Twitter API. Do I need to access the API directly or do I need to change my function call here?

Ok, it looks like [I have to use expansions and optional fields](https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets) to get the info I want. I can look in the defined types file for this module to understand a little more about how these get passed (easy enough to pull up with the Peak feature in VS Code).

Using that, I can get a much more complex object back!

Now I can have the whole tweet object I'm generating in the test, useful for reference.

`git commit -am "Get and test a more complex single tweet"`
