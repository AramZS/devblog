---
title: "Day 18: Ok, I used it a whole bunch. Now time to adjust."
description: "Better crawling, better tools for the static site generator."
date: 2022-5-01 22:59:43.10 -4
tags:
  - Node
  - WiP
  - archiving
  - fetch
  - User Agents
  - scraping
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
- [ ] Pull Twitter images into 11ty archive.
- [ ] Add YouTube DL tool.
- [ ] Use https://github.com/oduwsdl/archivenow?
- [ ] Improve handoff to Archive.org with [various other methods](https://twitter.com/Chronotope/status/1517116475601043456).
- [ ] Contexter needs to read author objects out of Schema dot org JSON-LD blocks.
- [ ] Fall back to use Puppeteer
- [ ] Fall back to read the version on the Internet Archive
- [ ] Do something better when the same link is in the text more than once.

## Day 18

Ok, so I put this project through it's paces by using it over the last monthish. It's working surprisingly well, but I think there are a few issues. The first is that while the Facebook UA works most of the time, it doesn't always. So let's use the work I did in Backreads to try and up my chances of successfully getting a scrape using the standard means, even if I want to eventually drop a headless browser into this process.

I also want to set it up so that the static site generator does the actual build process instead of baking it into the JSON file. I think this process ends up being a little more compelex, but it will make creating updates easier and I think make the whole project more sustainable and easier to support.

### Get better scraping results

Ok, so, when I was experimenting with [Backreads](https://github.com/AramZS/backreads/) I found that the right User Agent really made a difference. So I'm going to bring over and clean up some of the logic I worked out there.

The first thing is to bring over a list of User Agents (or UAs) and give myself some tools to select which one to use. When working with Node Fetch before I found that particular URLs were more likely to respond with particular UAs. So I'll build a function to handle that selection process and store a few UAs that might be useful for scraping. I also want to have the option to exclude specific UAs when I've already tried them. Ok so:

```javascript
const ua =
	"facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";


const selectUserAgent = (link, shuffleExclude = false) => {
	let userAgent = ua;
	// https://developers.whatismybrowser.com/useragents/explore/software_type_specific/?utm_source=whatismybrowsercom&utm_medium=internal&utm_campaign=breadcrumbs
	// https://user-agents.net/lookup
	const userAgents = {
		windows:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
			"AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 " +
			"Safari/537.36",
		osx14: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 OPR/72.0.3815.400",
		firefox:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:83.0) Gecko/20100101 Firefox/83.0",
		firefox99:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:99.0) Gecko/20100101 Firefox/99.0",
		osx11: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
		baidu_ua: "Baiduspider+(+http://www.baidu.com/search/spider.htm)",
		googlebot: "Googlebot/2.1 (+http://www.google.com/bot.html)",
		modernGooglebot:
			"UCWEB/2.0 (compatible; Googlebot/2.1; +google.com/bot.html)",
		pythonRequests: "python-requests/2.23.0",
		facebookRequests:
			"facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
		lighthouse:
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko; Google Page Speed Insights) Chrome/41.0.2272.118 Safari/537.36",
		osx15: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0",
		linux: "Mozilla/5.0 (X11; Linux x86_64)",
		mobileBrave:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.38 Safari/537.36 Brave/75",
		feedReader:
			"Feedspot/1.0 (+https://www.feedspot.com/fs/fetcher; like FeedFetcher-Google)",
	};
	const substackERx = RegExp("email.substack");
	const substackMGRx = RegExp("mg2.substack");
	const washPostRx = RegExp("s2.washingtonpost.com");
	const washPostStandardRx = RegExp("washingtonpost.com");
	const archiveOrg = RegExp("archive.org");
	const bbergLink = /link\.mail\.bloombergbusiness\.com/;
	const bberg = /bloomberg/;
	const goLink = /r\.g-omedia\.com/;
	const logicLink = /thelogic\.us12\.list-manage\.com/;

	if (substackMGRx.test(link) || substackERx.test(link)) {
		userAgent = userAgents.baidu_ua;
	} else if (washPostRx.test(link)) {
		userAgent = userAgents.lighthouse;
	} else if (washPostStandardRx.test(link)) {
		userAgent = userAgents.lighthouse;
	} else if (bbergLink.test(link) || goLink.test(link) || bberg.test(link)) {
		userAgent = userAgents.osx11;
	} else if (logicLink.test(link) || archiveOrg.test(link)) {
		userAgent = userAgents.firefox;
	} else {
		const keys = Object.keys(userAgents);
		if (shuffleExclude) {
			var index = keys.indexOf(shuffleExclude);
			if (index > -1) {
				keys.splice(index, 1);
			}
		}
		userAgent = keys[Math.floor(Math.random() * keys.length)];
	}
	return userAgent;
};
```

This structure should also allow me to add more UAs and more links that respond to them as I go forward and when the link isn't known to me I can just shuffle the User Agent list and pull a random UA from the set.

I also noticed an issue where a number of the URLs would hang on request for unclear reasons. I should set up a way to avoid that. Thankfully, this was [also something I developed](https://github.com/AramZS/backreads/blob/main/lambdas/html-from-email/parsing-tools.js#L301) for the Backreads project.

I can set the timeout using the [AbortController](https://www.npmjs.com/package/abort-controller) object.

Using this to set my fetch options with an abort signal should work and prevent future hanging of the process (hopefully!).

```javascript
const controller = new AbortController();
const fetchTimeout = setTimeout(() => {
	console.log("Request timed out for", link, userAgent);
	controller.abort();
}, 6000);
finalFetchOptions.signal = controller.signal;
```

With this in hand I can also set up a retry process.

`git commit -m "Setting up UA rotation + retry"`

Ok, I can incorporate a better header into the Archives request. There is [an option to download via the web archive](https://github.com/MaxBittker/nyt-first-said/blob/master/parsers/archive_bounce.py#L17) which might be worth exploring later.

`git commit -m "Fix request UA setup, add archiver improvements"`

### Embed Build Process

Ok, so now we should set up functions that can be accessible to the extending program so it can build it's own link blocks. We can also set it up so that the required setup script can be created only once by the subject site.

`git commit -am "Set up functions that can be extended for other systems to make the link block themselves"`

Ok. While I'm in here I want to avoid situations like Bloomberg where I keep getting back context-less robot blocking pages. Let's set up a check for titles like those that aren't properly giving me status codes.

`git commit -am "Check titles for 404-style responses that don't have the right status codes."`

### Unit Tests Now, Twitter Embeds Later

The other thing I want to do is have better Twitter embeds. That means good styles and not relying on the Twitter scripts, which are pretty awful to load.

But now that I've taken the time to get the unit tests working, that'll have to be for another night.

`git commit -am "Getting unit tests back working"`
