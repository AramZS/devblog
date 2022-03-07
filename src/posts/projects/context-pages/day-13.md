---
title: "Day 13: Getting Twitter Threads Working"
description: "I want to get the data set up in an HTML block a user can style"
date: 2022-2-06 22:59:43.10 -4
tags:
  - Node
  - WiP
  - archiving
  - embeds
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
- [x] Create link IDs that can be used to cache related content
- [ ] Integrate it into the site to be able to make context pages here.
- [ ] Check if a link is still available at build time and rebuild the block with links to an archived link
- [ ] Use v1 Twitter API to get Gifs and videos

## Day 13

Ok, forgot to do one thing, hook in the Twitter work. The one big issue is that I want to tie a bunch of oembeds together but the query doesn't seem to actually return a Twitter URL, just the ID. Is there a way to link to a Tweet without having to query up the user?

Looks like there is a way to construct this by putting the UID for the tweet on to the end of `https://twitter.com/i/web/status/`. Can I use this structure to get an oembed?

Nope.

Ok, it looks like even though this link doesn't work on the web and it isn't documented, you [can take the ID and pass it into the oembed endpoint](https://stackoverflow.com/questions/64917470/which-url-are-you-supposed-to-use-for-the-twitter-oembed-api) in the format of `twitter.com/twitter/status/{id}`. This is a very irritating hack, but hey, it works. I can get real complicated here, but I think it would be good to get to actually integrating this into a blog setup to get a better handle on how it works.

It looks like my oEmbed tool doesn't work with Twitter, but I can make a custom fetch to that process. It will get me back an object with an `html` property. I can then use `reduce` to pull all those oembeds together into a single string. Each comes with a script tag, so I'll just remove that. The final version that gets stitched together can have the tag added to the end.

`git commit -am "Combine blockquotes, remove scripts and set up twitter thread oembeds."`

Oh wait, I need to fix the finalized meta date object not filling properly!
