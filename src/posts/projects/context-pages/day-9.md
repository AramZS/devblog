---
title: "Day 8: Getting a Twitter Thread"
description: "I want to get get a Twitter thread when I link to a single Tweet that is part of a thread"
date: 2022-1-27 22:59:43.10 -4
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

## Day 9

Ok, so last time we were here it wasn't looping properly with the While and I assumed it had something to do with the Promises. I'm not so sure now. I forgot that I added the first tweet into the array which means it never even loops once. So this means the loop isn't advancing, but it's unclear why. My conditions seem to be correct.

After adding a little logging, it seems like it doesn't even finish that first loop.

Oops, looks like I captured the wrong Tweet to test with. Well, that's a good reason why.

Ok, code works, it's a little messy but it works!

Cleaned it up, refined the test. Here's the final function to walk a Tweet thread:

```javascript

const getTweetThread = async (tweetObj = defaultTweetObj) => {
	let threadCheck = false;
	let threadFirstCheck = false;
	let conversation = false;
	// const promises = [];
	const tweetData = tweetObj.data;
	const tweetIncludes = tweetObj.includes;
	if (tweetData.in_reply_to_user_id) {
		threadFirstCheck = true;
	}
	if (
		Array.isArray(tweetIncludes.users) &&
		tweetIncludes.users.length > 0 &&
		tweetIncludes.users[0].users &&
		tweetData.in_reply_to_user_id &&
		tweetData.conversation_id != tweetData.id
	) {
		threadFirstCheck = true;
	}
	if (!threadFirstCheck) {
		conversation = await getTwitterClient().search(
			`conversation_id:${tweetData.conversation_id} to:${tweetIncludes.users[0].username} from:${tweetIncludes.users[0].username}`,
			tweetFields
		);
		const fullConversation = conversation._realData.data;
		if (conversation._realData.data.length < 1) {
			return false;
		}
		fullConversation.push(tweetObj);
		console.dir(fullConversation);
		return fullConversation.reverse();
	} else {
		console.dir(tweetData);
		conversation = [tweetObj];
		let nextTweet = true;
		while (nextTweet != false) {
			console.log("nextTweet", nextTweet);
			if (nextTweet === true) {
				nextTweet = getRepliedTo(tweetData);
				console.log("nextTweet true", nextTweet);
			}
			var tweet = await getTwitterClient().singleTweet(
				`${nextTweet}`,
				tweetFields
			);
			// promises.push(tweet);
			console.log("tweet true", tweet);
			conversation.push(tweet);
			nextTweet = getRepliedTo(tweet.data);
		}
		// await Promise.all(promises);
		return conversation.reverse();
	}
};
```

Cool stuff. I can now capture a twitter thread either bottom up or top down. Next step here is to capture any quote tweets and their threads. Luckily this thread provides an example quote tweet, I'll have to find another thread to give me a quoted thread.

`git commit -am "Capture a Twitter thread"`
