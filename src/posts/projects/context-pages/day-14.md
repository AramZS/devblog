---
title: "Day 14: Testing the Contexter in action"
description: "I want to get the data set up in an HTML block a user can style"
date: 2022-2-10 22:59:43.10 -4
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

## Day 14

Ok, let's make sure that the finalized meta object is as filled out as possible.

`git commit -am "Fill out finalizedMeta object"`

Let's try to embed a tweet and a link in this post! What would this look like for Eleventy? We can't just pull the module in, we'll need to build something to process it.

So first a Tweet:

https://twitter.com/Chronotope/status/1402628536121319424

- https://twitter.com/Chronotope/status/1485620069229027329

And a link:

https://aramzs.github.io/jekyll/schema-dot-org/2018/04/27/how-to-make-your-jekyll-site-structured.html

 https://www.regular-expressions.info/lookaround.html

Now, let's try building out the Eleventy plugin we need.

The core will be detection, so we want the right regex for it.

There's a [good preexisting safe URL regex](https://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript) I can use. But I want to also make sure it's on its own line along with supporting ` - `, `- ` and a version that opens with a tab.

So we can play around a little bit to capture the opening and make sure that the URL is the end of the line as well:

```javascript
const urlRegex =
	/^((\t?| )?\- )?(\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))(?=\n|\r)$)+/gim;
```

Good stuff!

But how to apply it? I've tried doing it inside Markdown before but it requires a double-run. I wonder if I can try another approach?

What about [Eleventy transforms](https://www.11ty.dev/docs/config/#transforms)? They look [pretty straightforward to implement](https://github.com/vimtor/eleventy-plugin-external-links/blob/main/index.js).

Oop ended up going out instead of finishing this. Whelp, on to the next day!
