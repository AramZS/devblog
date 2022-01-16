---
title: "Day 1: Building a tool to generate context pages"
description: "I want to share lists of links, but make them readable and archived"
date: 2022-1-1 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - Analytics
  - Privacy
  - Metrics
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
---

## Project Scope and ToDos

1. Take a link and turn it into an oEmbed/Open Graph style share card
2. Take a link and archive it in the most reliable way
3. When the link is a tweet, display the tweet but also the whole tweet thread.
4. When the link is a tweet, archive the tweets, and display them if the live ones are not available.
5. Capture any embedded retweets in the thread. Capture their thread if one exists
6. Capture any links in the Tweet
7. Create the process as an abstract function that returns the data in a savable way

- [ ] Archive links on Archive.org and save the resulting archival links
- [ ] Create link IDs that can be used to cache related content
- [ ] Integrate it into the site to be able to make context pages here.
- [ ] Archive linked YouTubes

## Day 1

Ok, so this is a thing that happens a lot. I collect a bunch of links to a particular topic, and I want to share it. But it's hard to read a bunch of links, so how do I make it more readable?

I thought through some scope requirements and to dos and put them on the top of this page first. My first goal is to take a list of links and turn them into something more easy to read. I think the best way is by creating Open Graph style share cards for each link and replacing the link in place with those cards. So let's handle that request process.

### Selecting test tool

I think the easiest way to move forward is to build some test processes first so that I can run links through the function I'm building and test my outputs. I've now done tests with Jest and Mocha. Another popular library is [Chai](https://www.chaijs.com/), so let's try that.

### Archiving Tools Refrerence

It's also worthwhile to do exactly the sort of thing I'm talking about here and record some info about archiving links.

- https://github.com/palewire/savemy.news
- https://github.com/palewire/archiveis
- https://perma.cc/docs/developer
- https://conifer.rhizome.org/
- https://en.wikipedia.org/wiki/Help:Using_the_Wayback_Machine#JavaScript_bookmarklet
- https://help.archive.org/hc/en-us/articles/360001513491-Save-Pages-in-the-Wayback-Machine
- http://mementoweb.org/depot/native/archiveis/
- http://mementoweb.org/guide/quick-intro/
- https://wiki.archiveteam.org/index.php/ArchiveTeam_Warrior
- https://wiki.archiveteam.org/index.php/Software
- https://github.com/eloquence/freeyourstuff.cc
- https://github.com/dhamaniasad/WARCTools
- https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
- https://www.npmjs.com/package/html-pdf-node
- https://github.com/mozilla/readability

This is all pretty much more extensive then I want to do for my first run at this project, but it is good to have a list. To start, let's turn link lists into HTML cards.

### Sanitizing the URL

Ok, first thing is to sanitize the URL.

There's a fairly popular Node sanitation library, I'll start there.

I'll pull the regex WordPress uses to clean URLs, as I've used that in PHP and it's fairly reliable.

Finally, I want to strip marketing params that are commonly used in links. I could make my own code here, but a quick search around has revealed that [someone built some good regexes to handle this](https://github.com/mihaip/utm-stripper/blob/master/extension/background.js).

Ok, this makes for a good test setup. It looks like Chai builds on top of Mocha, so let's install that too.

Ok, it looks like [Chai has a suite of tools, the major ones are should, expect and assert](https://www.chaijs.com/guide/styles/).

Ok, let's make some bad links.

I want to invalidate `mailto` links also. So let's see if I can throw an error and capture it in Chai.

I should be able to capture the tests with `.should.Throw` and `expect(fn).to.throw(new Error('text'))`

Hmm, that's not working.

Ok, [it looks like it has a different format](https://stackoverflow.com/a/22340179) and does require we put the error-throwing function inside another function... for some reason. I also can't use the error object, just the error text. Also unclear from the docs.

```javascript
it("should throw on mailto links", () => {
	expect(() => {
		linkModule("mailto:test@example.com?subject=hello+world");
	}).to.throw("Invalid Mailto Link");
});
```

Ok, my sanitizer looks good and I think that I have some good coverage. Next step will be handling the Fetch step and building out the data model. But this is a good place to stop.

`git commit -am "Set up sanitizer and unit tests"`
