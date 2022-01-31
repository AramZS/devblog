---
title: "Day 11: Getting Twitter Media and Links"
description: "I want to get the full tweet and thread and the media inside those tweets. "
date: 2022-1-30 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - archiving
  - Twitter
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
- [ ] Use v1 Twitter API to get Gifs and videos

## Day 11

Ok, let's set up the last supporting function of the Twitter archiving process.

Ok, so what is the data structure involved here? I'm going to set up a test to log out the single tweet versions of this in order to understand what the data is and where it lives.

Here's how we figure out what we're looking at via tests.

```javascript
describe("Capture twitter media", function () {
	this.timeout(60000);
	it("should capture a basic tweet with an image link", async function () {
		const getUser = await linkModule
			.getTwitterClient()
			.singleTweet("1487451928309207047");
		expect(getUser.data.text).to.equal(
			"Hmmm not sure I would want a mortgage from a company also encouraging me to gamble. https://t.co/S9tVJpjeZo"
		);
	});
	it.only("should get image media from a Tweet", async function () {
		const gotTweet = await linkModule.getTweetByUrl(
			"https://twitter.com/Chronotope/status/1487451928309207047"
		);
		console.log("gotTweet", gotTweet);
		console.dir(gotTweet.data.attachments);
		console.dir(gotTweet.data.entities);
		expect(gotTweet.data.attachments).to.deep.include({
			media_keys: ["3_1487451926233030667"],
		});
		const quotedId = await linkModule.getQuotedTweetId(gotTweet.data);
	});
});
```

So now we know that a tweet might have a `media_keys` property inside its `attachments` property and that it will give us a media key.

Looking at the list of endpoints... is there a way to query for the media by key? It doesn't look like it, i[t looks like it is just handled on the `includes` property of the query response object](https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/media). Easy enough to see by altering this test slightly for a single Tweet query. What about the search? I don't see media links, even though I can add them to the query according to the documentation. The library [explains](https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/v2.md#search-tweets-recent) that [it has an access property on searches](https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/paginators.md).

But using that seems to do no more than accessing the tweet directly from the query object. The tweets themselves are surprisingly bare of metadata, regardless of what arguments I pass in. Ah, I can't just pass `media.fields` I also need to pass `expansions: ["attachments.media_keys"]`. But what happens when there is more than one result? I need a search that gets me multiple media tweets. Ok, so it is just a list, with keys alongside a list of tweets.

Instead I can combine the two, folding the `includes` data into the `attachments` key.

Ok, that works!

`git commit -am "Get image media from Tweet"`

Seems like I can't get gif media or videos from a Tweet. So those are out for now unless I want to activate v1. I'll put that on a future feature list nice-to-have. The last piece I want now is to extract links from Tweets.

Ok, for this I'll have to build a function that looks in the tweet data for the `entities` property and in the `entities` property for the `urls` property. If I find that, then I'll want to week out any `pic.twitter` URLs or `twitter.com` URLs in order to avoid double handling Twitter-based media I've already dealt with at some other part of the process. That should make sure that I don't have a situation where I'm trying to capture Twitter-based media as if it was a link off Twitter.

`git commit -am "Pull links from tweets."`

It's worth noting the expanded URL object can be pretty extensive. Here's an example of a full one:

```javascript
[
    {
      start: 224,
      end: 247,
      url: 'https://t.co/csLhSgsVy4',
      expanded_url: 'https://www.thegamer.com/facebooks-horizon-worlds-broken-metaverse-unimaginative-games/',
      display_url: 'thegamer.com/facebooks-hori…',
      images: [Array],
      status: 200,
      title: 'Facebook’s Horizon Worlds Is A Broken Metaverse Filled With Unimaginative Games',
      description: "For now, Mark Zuckerberg's virtual paradise looks like an underbaked digital space instead of Ready Player One",
      unwound_url: 'https://www.thegamer.com/facebooks-horizon-worlds-broken-metaverse-unimaginative-games/'
    }
]
```

I'll build a simple function to dig those out.

Last piece before I integrate this chunk in with the rest of the library is a function to wind all this together.

I'll need to compile the data together into a single object and then run tests to cover single tweets, quoted tweets, tweet threads, and tweet threads with quote tweets.

`git commit -am "Setup getTweets by URL for further use, with full data"`
