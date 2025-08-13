---
title: XYZ Site - Day 14 - Setting up a share button as an eleventy plugin.
description: "Make it easier to share my content online"
date: 2025-08-10 17:59:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - Social Media
  - Web Share API
---

## Project Scope and ToDos

1. Create a versatile blog site
2. Create a framework that makes it easy to add external data to the site

- [ ] Give the site the capacity to replicate the logging and rating I do on Serialized and Letterboxd.
- [x] Be able to pull down RSS feeds from other sites and create forward links to my other sites
- [x] Create forward links to sites I want to post about.
- [ ] Create a way to pull in my Goodreads data and display it on the site
- [ ] Create a way to automate pulls from other data sources
- [x] Combine easy inputs like text lists and JSON data files with markdown files that I can build on top of.
- [x] Add a TMDB credit to footer in base.njk
- [x] Make sure tags do not repeat in the displayed tag list.
- [x] Get my Kindle Quotes into the site
- [ ] YouTube Channel Recommendations
- [x] Minify HTML via Netlify plugin.
- [ ] Log played games

## Day 14

Ok, let's get back at the share button.

The only thing left is to style it. I've got some basic stuff in here but do I want to add an additional button? I think I want to have a [Share Openly](https://shareopenly.org/add/) button.

Easy enough to add the button and the logic, ShareOpenly is very easy to use:

```js
triggerShareOpenly(context) {
	const shareUrl = this.url;
	const shareTitle = this.shareText || this.title;

	const shareLink = 'https://shareopenly.org/share/?url='+encodeURIComponent(shareUrl)+"&text="+encodeURIComponent(shareTitle);

	// Open the share dialog with the specified URL and text
	window.open(shareLink, '_blank');
}
```

We'll add the actual styles that lay it out not in the plugin but in my site CSS, that's how I would expect it to be adopted by others.

I'll re-layout the buttons as a flex layout.

I want to make the share area background just a little bit darker, but I don't want to add another color. I think I can handle an opacity shift with CSS?

Yeah, looks like [there's a way to do this](https://stackoverflow.com/a/44515149) in a straightforward way! I'm not super familiar with this technique, but it does work without me declaring another theme color. Pretty nice.

I made it just slightly darker, to give the whole footer area a gradient style by using the css:

```css
    background-color: var(--background-muted);
    background-image: linear-gradient(hsla(0,0%,0%,.3) 100%,transparent 100%);
```

Buttons are looking better now but the share dialog on the desktop opens in a pretty random place. I'd love to reposition it. I'm not seeing a way though.

This is enough to make it live though! I'll have to figure out the share dialogue positioning later. I'll also add some classes to [make it trackable in Plausible](https://plausible.io/docs/custom-event-goals).

`git commit -am "Get share buttons production ready and add shareopenly"`
