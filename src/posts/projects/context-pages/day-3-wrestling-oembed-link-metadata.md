---
title: "Day 3: Wrestling with OEmbed"
description: "I want to share lists of links, but make them readable and archived"
date: 2022-1-9 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - oembed
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

## Day 3

Ok, yesterday I was trying to knock down the oEmbed process from Facebook and getting nothing. Let's take this back to base principles and see if I can make a request outside of Node that gets what I need

Ok, it looks like I don't have the right permissions for my Facebook app? Sort of taking the o out of oEmbed if I need an app, permissions and a key isn't it Facebook?

Ok, to get the oEmbed process working I need to have my App verified on Facebook... which means uploading a photo of my government provided ID? Nope, fk that. Ok, just no Facebook oembeds in this process then.

Ok, let's grab the page data that tells us about a post now. To do that, I'm going to use a classic package I've done some work in before: JSDOM.

JSDOM can do its own requests, but I would prefer to handle that as a separate step.

First I'm going to build a basic object that can contain data about the page that should be useful. I want to predefine a few namespaces I would use. Let's pull [the standard stuff from the meta tags](https://aramzs.github.io/jekyll/social-media/2015/11/11/be-social-with-jekyll.html) and [JSON-LD](https://aramzs.github.io/jekyll/schema-dot-org/2018/04/27/how-to-make-your-jekyll-site-structured.html). I can also use [Dublin Core potentially](https://en.wikipedia.org/wiki/Dublin_Core#Levels_of_the_standard). I [can also use h-card](https://microformats.org/wiki/h-card) [perhaps](https://indieweb.org/h-card) or [h-entry](https://indieweb.org/authorship)? We can try that out at some later point.

Ok, so once I have the DOM set up how can I grab the data I need?

On the DOM object I can execute `window.document.getElementsByTagName("meta");` and get a list back. Interestingly tags using the `name` property are accessible on the resulting object by name. For OpenGraph we can use [a wildcard search](https://stackoverflow.com/questions/8714090/queryselector-wildcard-element-match) of `querySelectorAll`.

```javascript
const openGraphNodes = window.document.querySelectorAll(
	"meta[property^='og:']"
);
```

Ok, so I need to set up some tests to make sure it is working as expected.

Can I use `to.equal` in mocha?

```javascript
result.metadata.keyvalues.equal([
	"jekyll",
	"social-media",
]);
```

Apparently not.

Ok, did some searching around and [it looks like the right way to handle this](https://stackoverflow.com/questions/41726208/chai-testing-for-values-in-array-of-objects):

```javascript
expect(result.metadata.keyvalues).to.have.members([
	"jekyll",
	"social-media",
])
```

Ok, things are working. But I think I can make this better code by simplifying and abstracting the functions around the `querySelector`. There OpenGraph and Twitter based meta values are all based on RDF and we can analyze them in a similar way.

```javascript
const pullMetadataFromRDFProperty = (documentObj, topNode) => {
	const graphNodes = documentObj.querySelectorAll(
		`meta[property^='${topNode}:']`
	);
	const openGraphObject = Array.from(graphNodes).reduce((prev, curr) => {
		const keyValue = curr.attributes
			.item(0)
			.nodeValue.replace(`${topNode}:`, "");
		if (prev.hasOwnProperty(keyValue)) {
			const lastValue = prev[keyValue];
			if (Array.isArray(lastValue)) {
				prev[keyValue].push(curr.content);
			} else {
				prev[keyValue] = [lastValue, curr.content];
			}
		} else {
			prev[keyValue] = curr.content;
		}
		return prev;
	}, {});
	// console.log("openGraphObject", openGraphObject);
	return openGraphObject;
};
```

`git commit -am "Setting up scrape of OpenGraph data and supporting unit tests"`

Now I can use this function to capture the Twitter metadata as well!

`git commit -am "Setting up scrape of twitter data"`

Oh wait, I need to account for the fact that some tags are using `name` and some are using `property`.

`git commit -am "Fix pullMetadataFromRDFProperty to have a prop type"`

A few more modifications and I can get it to capture DublinCore if available as well.

I can even build some tests to prove some negative cases. That should be useful for more comprehensive testing.

Basically this should allow me to compose a bunch of different tests with different HTML.

`git commit -am "More extensive test coverage"`

Looking good. Now I want to test it end to end.

```javascript
	describe("should create link objects from a domain requests", function () {
		this.timeout(5000);
		it("should resolve a basic URL", async function () {
			const result = await linkModule.getLinkData({
				sanitizedLink:
					"http://aramzs.github.io/jekyll/social-media/2015/11/11/be-social-with-jekyll.html",
				link: "http://aramzs.github.io/jekyll/social-media/2015/11/11/be-social-with-jekyll.html",
			});
			result.status.should.equal(200);
			result.metadata.title.should.equal(
				"How to make your Jekyll site show up on social"
			);
			result.metadata.author.should.equal("Aram Zucker-Scharff");
			result.metadata.description.should.equal(
				"Here's how to make Jekyll posts easier for others to see and share on social networks."
			);
			result.metadata.canonical.should.equal(
				"http://aramzs.github.io/jekyll/social-media/2015/11/11/be-social-with-jekyll.html"
			);
			expect(result.metadata.keywords).to.have.members([
				"jekyll",
				"social-media",
			]);
			result.opengraph.title.should.equal(
				"How to make your Jekyll site show up on social"
			);
			result.opengraph.locale.should.equal("en_US");
			result.opengraph.description.should.equal(
				"Here's how to make Jekyll posts easier for others to see and share on social networks."
			);
			result.opengraph.url.should.equal(
				"http://aramzs.github.io/jekyll/social-media/2015/11/11/be-social-with-jekyll.html"
			);
			result.twitter.card.should.equal("summary_large_image");
			result.twitter.creator.should.equal("@chronotope");
			result.twitter.title.should.equal(
				"How to make your Jekyll site show up on social"
			);
			result.twitter.image.should.equal(
				"https://raw.githubusercontent.com/AramZS/aramzs.github.io/master/_includes/tumblr_nwncf1T2ht1rl195mo1_1280.jpg"
			);
			result.dublinCore.Format.should.equal("video/mpeg; 10 minutes");
			result.dublinCore.Language.should.equal("en");
			result.dublinCore.Publisher.should.equal("publisher-name");
			result.dublinCore.Title.should.equal("HYP");
			result.jsonLd["@type"].should.equal("BlogPosting");
			result.jsonLd.headline.should.equal(
				"How to make your Jekyll site show up on social"
			);
			result.jsonLd.description.should.equal(
				"Here's how to make Jekyll posts easier for others to see and share on social networks."
			);
			expect(result.jsonLd.image).to.have.members([
				"https://raw.githubusercontent.com/AramZS/aramzs.github.io/master/_includes/tumblr_nwncf1T2ht1rl195mo1_1280.jpg",
			]);
		});
	});
```

Oh, I forgot, I need to await `response.text()`!

Ok, a few more tweaks and a reminder that I don't have Dublin Core on my actual site and it should be good to go.

`git commit -am "End to end unit test for building a link object" `
