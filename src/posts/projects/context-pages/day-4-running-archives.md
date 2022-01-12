---
title: "Day 4: Getting links archived - research spike"
description: "I want to share lists of links, but make them readable and archived"
date: 2022-1-11 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - archiving
  - Internet Archive
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
- [ ] Check if a link is still available at build time and rebuild the block with links to an archived link

## Day 4

Ok, now that I have a sane link and metadata, I want to archive the links in a useful way and take that archive link and make it available. I [thought a little more about this in public and got an example approach in Python](https://github.com/epaulson/liquid_link_archiver).

[Looking at other work in the space](https://github.com/california-civic-data-coalition/django-internetarchive-storage/blob/master/ia_storage/storage.py) I'll need to walk my generated metadata object and get specific metadata values to set as the main version of those values for the archive. If I want to set this up so it can be locally archived by users It'll also be useful to look at [current work on this process](https://pastpages.org/) in [Python](https://django-memento-framework.readthedocs.io/en/latest/) and [PHP](https://wordpress-memento-plugin.readthedocs.io/en/latest/). It looks like there are [some existing tools that also](https://github.com/machawk1/awesome-memento) [might be useful to reference](http://www.mementoweb.org/tools/). There's even [a rather old but still useful archive.is package](https://github.com/qvint/archive.is). Some people have [even talked about](https://twitter.com/Yahel/status/1481087744780738562) taking [screenshots](https://splinter.readthedocs.io/en/latest/screenshot.html).

Let's start with Archive.is. Trying the preexisting package seems easiest and the code within seems pretty straightforward, very similar to the Python API I was looking at.

We'll find out if the package still works, very simple if so, though I'm adapting it to use async/await. We'll see how that goes:

```javascript
const pushToArchiveIs = async (url) => {
	// Based on https://github.com/palewire/archiveis/blob/master/archiveis/api.py
	const archiveTool = "https://archive.is";
	const archivingPath = "/submit/";
	const saveUrl = archiveTool + archivingPath;

	let result = await archiveIs.save(url);
	console.log(result);
	return result;
};
```

Well, wrote a test and it doesn't seem to work.

```javascript
it("should send a URL to archive.is", async function () {
			const result = await linkModule.pushToArchiveIs(
				"https://blog.aramzs.me"
			);
			result.shortUrl.should.equal("");
		});
```

Results in `TooManyRequestsError: Too Many Requests` no matter what URL I put in. So I guess the module doesn't work.

Ok, now I know. I wonder if I can fix it? I guess that's for the next day I work on this. Today was mostly about research and reading.

`git commit -am "Set up archiver and test archive.is module (it failed)"`
