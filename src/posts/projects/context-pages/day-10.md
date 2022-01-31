---
title: "Day 10: Getting Quoted Tweets"
description: "I want to get the full tweet and thread when a Tweet quotes another tweet. "
date: 2022-1-29 22:59:43.10 -4
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

## Day 10

Ok, I got my stuff pretty well working yesterday, but I want to check to see if it works with a thread that's not just me.

It isn't quite working though. It looks like I can't depend on the replied_to tweet data to be in the first position consistently. I'll use a `find` instead of making that assumption.

```javascript
const getRepliedTo = (tweetData) => {
	if (tweetData.referenced_tweets && tweetData.referenced_tweets.length) {
		const repliedTo = tweetData.referenced_tweets.find((tweet) => {
			if (tweet.type == "replied_to") {
				return true;
			} else {
				return false;
			}
		});
		if (repliedTo) {
			console.log("referenced_tweet 0", repliedTo.id);
			return repliedTo.id;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
```

Ok, now when I want to get a quoted tweet, I can build a similar function to extract the ID as a first step. Then I can get the full Tweet. I can try pulling that Tweet's thread... But what if that tweet is the middle of a thread? I should likely check that as well. Do I need to do that in every case, or just this case? I think it would be unwise to assume I want to do it in every case, so let's just do it in this case. Get the assumed Thread AND the conversation thread?

I guess it is a little more complicated and requires a little more complex of a return than a simple array to handle all the cases. Ok, time to refactor it.

Oh, ok, you don't get a `data` object with every tweet. It's only per query (though not the search query I guess?). Let's refactor some more to remove it from the equation and make my functions generally usable.

`git commit -am "Fix incorrect use of Twitter Query data object and make the thread finder more versatile."`

Ok, so now let's set up a situation where we need this new feature to work! I've found a good Tweet, so now I'll give it a try.

Hmmmm

And for some reason my conversation_id based query isn't working. The query is going through, but it isn't getting results. Even though checking the search it should be.

Oh, I see, [the search endpoint only goes back 7 days](https://developer.twitter.com/en/docs/twitter-api/tweets/search/introduction). Annoying.

`git commit -am "Tweet archiver test if tweets were more recent this would work"`

Ok, I'm getting my quoted tweets and tweet threads!

Last step is a function for grabbing the media from tweets to archive and then I can build a function that takes tweet objects and turns them into something useful and embedable, and easy to archive.

