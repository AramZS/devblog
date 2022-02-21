---
title: "Day 16: Embeds and Archive Pages"
description: "I want to get the data set up in an HTML block a user can style"
date: 2022-2-21 22:59:43.10 -4
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
- [ ] Pull Twitter images into 11ty archive.

## Day 16

Ok, so I wasn't actively logging the last two days of work because a lot of it was random fiddles that I didn't think would take very long and a bunch of playing around with styling. But it all turned out to take a lot longer than I thought, and ended up more complicated.

First I decided to make a more complex take on the embed HTML based on some stuff I learned from work. Specifically, I decided I wanted to more strongly encapsulate the styles based on [custom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) [HTML elements](https://developers.google.com/web/fundamentals/web-components/customelements) and the [shadow](https://developers.google.com/web/fundamentals/web-components/shadowdom) [DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

I played around a bunch in Glitch with HTML and styles to form the embed design I want for non-oEmbed cards.

I've ended up with the HTML (here filled with sample data):

```html
    <contexter-box
      class="contexter-box"
      itemscope=""
      itemtype="https://schema.org/CreativeWork"
      >
      <contexter-thumbnail class="contexter-box__thumbnail" slot="thumbnail"
        ><img
          src="https://github.com/AramZS/aramzs.github.io/blob/master/_includes/beamdown.gif?raw=true"
          alt=""
          itemprop="image" /></contexter-thumbnail
      ><contexter-box-head
        slot="header"
        class="contexter-box__head"
        itemprop="headline"
        ><contexter-box-head
          slot="header"
          class="contexter-box__head"
          itemprop="headline"
          ><a
            is="contexter-link"
            href="http://aramzs.github.io/jekyll/schema-dot-org/2018/04/27/how-to-make-your-jekyll-site-structured.html"
            itemprop="url"
            target="_blank"
            >How to give your Jekyll Site Structured Data for Search with
            JSON-LD</a
          ></contexter-box-head
        ></contexter-box-head
      ><contexter-byline class="contexter-box__byline" slot="author"
        ><span class="p-name byline" rel="author" itemprop="author"
          >Aram Zucker-Scharff</span
        ></contexter-byline
      ><time
        class="dt-published published"
        slot="time"
        itemprop="datePublished"
        datetime="2018-04-27T22:00:51.000Z"
        >3/27/2018</time
      ><contexter-summary
        class="p-summary entry-summary"
        itemprop="abstract"
        slot="summary"
        ><p>
          Let's make your Jekyll site work with Schema.org structured data and
          JSON-LD.
        </p></contexter-summary
      ><contexter-keywordset
        itemprop="keywords"
        slot="keywords"
        class="contexter-box__keywordset"
        ><span rel="category tag" class="p-category" itemprop="keywords"
          >jekyll</span
        >,
        <span rel="category tag" class="p-category" itemprop="keywords"
          >schema-dot-org</span
        >,
        <span rel="category tag" class="p-category" itemprop="keywords"
          >Code</span
        ></contexter-keywordset
      ><a
          href="https://web.archive.org/web/20220219224214/https://aramzs.github.io/jekyll/schema-dot-org/2018/04/27/how-to-make-your-jekyll-site-structured.html"
          is="contexter-link"
          target="_blank"
          class="read-link archive-link"
          itemprop="archivedAt"
             slot="archive-link"
          >Archived</a
        >&nbsp;|&nbsp;<a
          is="contexter-link"
          href="http://aramzs.github.io/jekyll/schema-dot-org/2018/04/27/how-to-make-your-jekyll-site-structured.html"
          class="read-link main-link"
          itemprop="sameAs"
          target="_blank"
            slot="read-link"
          >Read</a
        ></contexter-box
    >
```

And to make that work, I'll have to insert the following Javascript to make the functionality run with custom HTML elements and add the shadow DOM:

```javascript
		window.contexterSetup = window.contexterSetup ? window.contexterSetup : function() {
			window.contexterSetupComplete = true;
		class ContexterLink extends HTMLAnchorElement {
		constructor() {
			// Always call super first in constructor
			super();

			// Element functionality written in here
		}
		connectedCallback() {
			this.setAttribute("target", "_blank");
		}
		}
		// https://stackoverflow.com/questions/70716734/custom-web-component-that-acts-like-a-link-anchor-tag
		customElements.define("contexter-link", ContexterLink, {
		extends: "a",
		});
		customElements.define(
		"contexter-inner",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();
			// Element functionality written in here
			}
			attributeChangedCallback(name, oldValue, newValue) {

			}
			connectedCallback() {
			this.className = "contexter-box__inner";
			}
		}
		);
		customElements.define(
		"contexter-thumbnail",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();
			// Element functionality written in here
			}
			attributeChangedCallback(name, oldValue, newValue) {

			}
			connectedCallback() {
			this.className = "contexter-box__thumbnail";
			}
		}
		);
		customElements.define(
		"contexter-byline",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();
			// Element functionality written in here
			}
			attributeChangedCallback(name, oldValue, newValue) {

			}
			connectedCallback() {
			this.className = "contexter-box__byline";
			}
		}
		);
		customElements.define(
		"contexter-keywordset",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();
			// Element functionality written in here
			}
			attributeChangedCallback(name, oldValue, newValue) {

			}
			connectedCallback() {
			this.className = "contexter-box__keywordset";
			}
		}
		);
		customElements.define(
		"contexter-linkset",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();
			// Element functionality written in here
			}
			attributeChangedCallback(name, oldValue, newValue) {

			}
			connectedCallback() {
			this.className = "contexter-box__linkset";
			}
		}
		);
		customElements.define(
		"contexter-meta",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();
			// Element functionality written in here
			}
			attributeChangedCallback(name, oldValue, newValue) {

			}
			connectedCallback() {
			this.className = "contexter-box__meta";
			}
		}
		);
		customElements.define(
		"contexter-summary",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();
			// Element functionality written in here
			}
			attributeChangedCallback(name, oldValue, newValue) {

			}
			connectedCallback() {
			this.className = "p-summary entry-summary";
			}
		}
		);
		customElements.define(
		"contexter-box-head",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();

			// Element functionality written in here
			}
			connectedCallback() {
			this.className = "contexter-box__head";
			}
		}
		);
		customElements.define(
		"contexter-box-inner",
		class extends HTMLElement {
			constructor() {
			// Always call super first in constructor
			super();

			// Element functionality written in here
			}
			connectedCallback() {
			}
		}
		);
		// https://developers.google.com/web/fundamentals/web-components/best-practices
		class ContexterBox extends HTMLElement {
		constructor() {
			// Always call super first in constructor
			super();
			this.first = true;
			this.shadow = this.attachShadow({ mode: "open" });
		}
		connectedCallback() {
			if (this.first){
			this.first = false
			var style = document.createElement("style");
			style.innerHTML = `
					:host {
						--background: #f5f6f7;
						--border: darkblue;
						--blue: #0000ee;
						--font-color: black;
						--inner-border: black;
						font-family: Franklin,Arial,Helvetica,sans-serif;
						font-size: 14px;
						background: var(--background);
						width: 600px;
						color: var(--font-color);
						min-height: 90px;
						display: block;
						padding: 8px;
						border: 1px solid var(--border);
						cursor: pointer;
						box-sizing: border-box;
						margin: 6px;
						contain: content;
					}

					// can only select top-level nodes with slotted
					::slotted(*) {
						max-width: 100%;
						display:block;
					}
					::slotted([slot=thumbnail]) {
						max-width: 100%;
						display:block;
					}
					::slotted([slot=header]) {
						width: 100%;
						font-size: 1.25rem;
						font-weight: bold;
						display:block;
						margin-bottom: 6px;
					}
					::slotted([slot=author]) {
						max-width: 50%;
						font-size: 12px;
						display:inline-block;
						float: left;
					}
					::slotted([slot=time]) {
						max-width: 50%;
						font-size: 12px;
						display:inline-block;
						float: right;
					}
					::slotted([slot=summary]) {
						width: 100%;
						margin-top: 6px;
						padding: 10px 2px;
						border-top: 1px solid var(--inner-border);
						font-size: 15px;
						display:inline-block;
						margin-bottom: 6px;
					}
					contexter-meta {
						height: auto;
						margin-bottom: 4px;
						width: 100%;
						display: grid;
						position: relative;
						min-height: 16px;
						grid-template-columns: repeat(2, 1fr);
					}
					::slotted([slot=keywords]) {
						width: 80%;
						padding: 2px 4px;
						border-top: 1px solid var(--inner-border);
						font-size: 11px;
						display: block;
						float: right;
						font-style: italic;
						text-align: right;
						grid-column: 2/2;
						grid-row: 1;
						align-self: end;
						justify-self: end;
					}
					::slotted([slot=archive-link]) {
						font-size: 1em;
						display: inline;
					}
					::slotted([slot=archive-link])::after {
						content: "|";
						display: inline;
						color: var(--font-color);
						text-decoration: none;
						margin: 0 .5em;
					}
					::slotted([slot=read-link]) {
						font-size: 1em;
						display: inline;
					}
					contexter-linkset {
						width: 80%;
						padding: 2px 4px;
						font-size: 13px;
						float: left;
						font-weight: bold;
						grid-row: 1;
						grid-column: 1/2;
						align-self: end;
						justify-self: start;
					}
					/* Extra small devices (phones, 600px and down) */
					@media only screen and (max-width: 600px) {
						:host {
						width: 310px;
						}
					}
					/* Small devices (portrait tablets and large phones, 600px and up) */
					@media only screen and (min-width: 600px) {...}
					/* Medium devices (landscape tablets, 768px and up) */
					@media only screen and (min-width: 768px) {...}
					/* Large devices (laptops/desktops, 992px and up) */
					@media only screen and (min-width: 992px) {...}
					/* Extra large devices (large laptops and desktops, 1200px and up) */
					@media only screen and (min-width: 1200px) {...}
					@media (prefers-color-scheme: dark){
						:host {
						--background: #354150;
						--border: #1f2b37;
						--blue: #55b0ff;
						--font-color: #ffffff;
						--inner-border: #787a7c;
						background: var(--background);
						border: 1px solid var(--border)
						}
					}
				`;
			var lightDomStyle = document.createElement("style");
			lightDomStyle.innerHTML = `
					contexter-box {
						contain: content;
					}
					contexter-box .read-link {
						font-weight: bold;
					}
					contexter-box a {
						color: #0000ee;
					}
					contexter-box img {
						width: 100%;
						border: 0;
						padding: 0;
						margin: 0;
					}
					/* Extra small devices (phones, 600px and down) */
					@media only screen and (max-width: 600px) {...}
					/* Small devices (portrait tablets and large phones, 600px and up) */
					@media only screen and (min-width: 600px) {...}
					/* Medium devices (landscape tablets, 768px and up) */
					@media only screen and (min-width: 768px) {...}
					/* Large devices (laptops/desktops, 992px and up) */
					@media only screen and (min-width: 992px) {...}
					/* Extra large devices (large laptops and desktops, 1200px and up) */
					@media only screen and (min-width: 1200px) {...}
					@media (prefers-color-scheme: dark){
						contexter-box a {
						color: #55b0ff;
						}
					}
			`;
			this.appendChild(lightDomStyle);
			//https://stackoverflow.com/questions/49678342/css-how-to-target-slotted-siblings-in-shadow-dom-root
			this.shadow.appendChild(style);
			// https://developers.google.com/web/fundamentals/web-components/shadowdom
			// https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots
			const innerContainer = document.createElement("contexter-box-inner")
			this.shadow.appendChild(innerContainer)
			// https://javascript.info/slots-composition
			const innerSlotThumbnail = document.createElement('slot');
			innerSlotThumbnail.name = "thumbnail"
			innerContainer.appendChild(innerSlotThumbnail)
			const innerSlotHeader = document.createElement('slot');
			innerSlotHeader.name = "header"
			innerContainer.appendChild(innerSlotHeader)
			const innerSlotAuthor = document.createElement('slot');
			innerSlotAuthor.name = "author"
			innerContainer.appendChild(innerSlotAuthor)
			const innerSlotTime = document.createElement('slot');
			innerSlotTime.name = "time"
			innerContainer.appendChild(innerSlotTime)
			const innerSlotSummary = document.createElement('slot');
			innerSlotSummary.name = "summary"
			innerContainer.appendChild(innerSlotSummary)

			const metaContainer = document.createElement("contexter-meta");
			innerContainer.appendChild(metaContainer)

			const innerSlotInfo = document.createElement('slot');
			innerSlotInfo.name = "keywords"
			metaContainer.appendChild(innerSlotInfo)

			const linkContainer = document.createElement("contexter-linkset");
			metaContainer.appendChild(linkContainer)
			const innerSlotArchiveLink = document.createElement('slot');
			innerSlotArchiveLink.name = "archive-link"
			linkContainer.appendChild(innerSlotArchiveLink)
			const innerSlotReadLink = document.createElement('slot');
			innerSlotReadLink.name = "read-link"
			linkContainer.appendChild(innerSlotReadLink)

			this.className = "contexter-box";
			this.onclick = (e) => {
				// console.log('Click on block', this)
				if (!e.target.className.includes('read-link') && !e.target.className.includes('title-link')) {
				const mainLinks = this.querySelectorAll('a.main-link');
				// console.log('mainLink', e, mainLinks)
				mainLinks[0].click()
				}
			}
			}
		}
		}

		customElements.define("contexter-box", ContexterBox);
}
if (!window.contexterSetupComplete){
	window.contexterSetup();
}
```

You can see here I've made the entire box clickable by capturing any clicks (not on the archive link) and routing them to the Read link

```javascript
	const mainLinks = this.querySelectorAll('a.main-link');
	mainLinks[0].click()
```

I also don't want to re-run this script when there are multiple embeds so I encapsulate it inside a function call with a window level check that is set the first time I set up the script:

```javascript
if (!window.contexterSetupComplete){
	window.contexterSetup();
}
```

I originally set the links in a single element that contained both links. But I realized that I should [slot](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots) them separately, to allow me to actively insert the archive link at another step for my Eleventy site's archive pages.

I had to [fix my access of element properties](https://github.com/AramZS/contexter/commit/291723fedaff8ba161937ce2f14802972e05fc01#diff-ad1cab4880eef9b423964380f642350431350ddddf8f3ffd30572e0875ee2fb0R38), [check the readability object as a backup](https://github.com/AramZS/contexter/commit/291723fedaff8ba161937ce2f14802972e05fc01#diff-ad1cab4880eef9b423964380f642350431350ddddf8f3ffd30572e0875ee2fb0R314) for some of the finalizedMeta data, and [fix the oembed for Twitter](https://github.com/AramZS/contexter/commit/291723fedaff8ba161937ce2f14802972e05fc01#diff-ad1cab4880eef9b423964380f642350431350ddddf8f3ffd30572e0875ee2fb0R494) so [it doesn't show replies in a thread](https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/overview) that already includes replies.

I want to bring images used in the embeds local to the site. [This turned out a lot harder than I expected](https://github.com/AramZS/devblog/commit/7e80d4e9a508e0c0c50f4e58d2417c05a89802b8).

I pulled tweets in easily enough, but realized [I needed to print the author data for the Tweet to really make the archive readable](https://github.com/AramZS/devblog/commit/014f41df54410348ca11a66eb985b088c54467c3).

Now that I have a local archive, I can take advantage of the slot at the point where I build the collection. If I don't have the archive link from Wayback I can use my own site's archive.

```javascript
if (
	!contextData.data.archivedData.link &&
	!contextData.data.twitterObj
) {
	contextData.htmlEmbed =
		contextData.htmlEmbed.replace(
			`</contexter-box>`,
			`<a href="${options.domain}/${options.publicPath}/${contextData.sanitizedLink}" is="contexter-link" target="_blank" class="read-link archive-link" itemprop="archivedAt" slot="archive-link">Archived</a></contexter-box>`
		);
}
```
