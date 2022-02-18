---
title: "Day 8: Getting a Twitter Thread"
description: "I want to get a Twitter thread when I link to a single Tweet that is part of a thread"
date: 2022-1-25 22:59:43.10 -4
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

## Day 8

Last time I worked on this project I got a basic Twitter tweet object worked out. It looked like this:

```javascript
{
	data: {
		text: "@swodinsky Everything connected to the internet eventually becomes ads :/",
		referenced_tweets: [
			{ type: "replied_to", id: "1275920325000278020" },
		],
		author_id: "15099054",
		in_reply_to_user_id: "15099054",
		id: "1275920609097199628",
		entities: {
			mentions: [
				{
					start: 0,
					end: 10,
					username: "swodinsky",
					id: "2908572178",
				},
			],
		},
		possibly_sensitive: false,
		conversation_id: "1275917959618232320",
		reply_settings: "everyone",
		created_at: "2020-06-24T22:35:53.000Z",
		source: "Twitter Web App",
	},
	includes: {
		users: [
			{
				username: "Chronotope",
				name: "Aram Zucker-Scharff",
				id: "15099054",
				url: "https://t.co/2rHFiUBQX1",
			},
			{
				username: "swodinsky",
				name: "shoshana wodinsky (she/her)",
				id: "2908572178",
				url: "https://t.co/MYBP7NgPOL",
			},
		],
		tweets: [
			{
				possibly_sensitive: false,
				text: "@swodinsky I think that, unless something changes pretty radically at the regulatory level, that is a fair assumption.  https://t.co/aDY7rAbJYd",
				id: "1275920325000278020",
				source: "Twitter Web App",
				author_id: "15099054",
				in_reply_to_user_id: "2908572178",
				reply_settings: "everyone",
				created_at: "2020-06-24T22:34:45.000Z",
				entities: {
					urls: [
						{
							start: 120,
							end: 143,
							url: "https://t.co/aDY7rAbJYd",
							expanded_url:
								"https://twitter.com/Chronotope/status/1134464455872524288",
							display_url:
								"twitter.com/Chronotope/sta…",
						},
					],
					mentions: [
						{
							start: 0,
							end: 10,
							username: "swodinsky",
							id: "2908572178",
						},
					],
				},
				referenced_tweets: [
					{ type: "quoted", id: "1134464455872524288" },
					{
						type: "replied_to",
						id: "1275919838607794181",
					},
				],
				conversation_id: "1275917959618232320",
			},
		],
	},
}
```

This time I want to be able to capture a Twitter thread. I [have a short one](https://twitter.com/Chronotope/status/1485621494365528072) starting with a retweet at the top that will be perfect for this. So how do I test for this to be a thread?

I think there are a few early checks that can narrow it down:

- If the ID of the tweet doesn't match the conversation_id of the tweet.
- If the `in_reply_to_user_id` field matches the `author_id`

This doesn't cover conversations that start at the beginning of the tweet though. For that I want to search by `conversation_id` and `author_id` to see if there are replies.

I'm able to search by conversation_id:

```javascript
	const conversation = await getTwitterClient().search(
		`conversation_id:${tweetData.conversation_id}`
	);
```

but `+` or ` ` or `&` as a join with `author_id` doesn't work.

Let me try it with just the `author_id` field.

Ok, well, that field isn't valid to query by itself either.

[Looks like only some fields are valid to query with](https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query#build).

Ok! This works!

```javascript
const conversation = await getTwitterClient().search(
	`conversation_id:${tweetData.conversation_id} to:${tweetIncludes.users[0].username} from:${tweetIncludes.users[0].username}`,
	tweetFields
);
```

I can then take the array of tweets at `conversation._realData.data`, push the passed-in Tweet Object to the array of tweets, and then `reverse()` it.

Ok, that verifies if the tweet is at the top of the thread. I can check to make sure the query returns more than one object, so I know it is a thread.

The next type of Twitter link is the one that is at the bottom of the thread.

Hmmm, I can break out the function to get the replied to ID to it's own function so I can reuse it, but that doesn't solve the problem that walking up the Twitter thread is going to have a series of `async`s that need to be awaited. Perhaps [this way](https://stackoverflow.com/questions/17217736/while-loop-with-promises)?

```javascript
} else {
	console.dir(tweetData);
	conversation = [tweetObj];

	let nextTweet = true;
	while (nextTweet) {
		if (nextTweet === true) {
			nextTweet = getRepliedTo(tweetData);
		}
		var tweet = await getTwitterClient().singleTweet(
			`${nextTweet}`,
			tweetFields
		);
		conversation.push(tweet);
		nextTweet = getRepliedTo(tweet.data);
	}
}
```

Hmmm... I'm not getting the right array length. Seems like it isn't waiting to resolve things wrong enough or my loop is wrong. Something to check tomorrow!

`git commit -am "Building out thread archiver"`
