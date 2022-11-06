---
title: Context Center Timelines - Day 11 - Build on Single Items
description: "Stretching the limits of Nunjucks by using it to create valid JSON."
date: 2022-11-01 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
  - JS
  - JSON
---

## Project Scope and ToDos

1. Create timeline pages where one can see the whole timeline of a particular event
2. Give timeline items type or category icons so that you can easily scan what is happening.
3. Allow the user to enter the timeline at any individually sharable link of an event and seamlessly scroll up and down

- [ ] Deliver timelines as a plugin that can be extended by other 11ty users
- [ ] Auto-create social-media-ready screenshots of a timeline item
- [ ] Integrate with Contexter to have context-full link cards in the timeline
- [ ] Leverage the Live Blog format of Schema dot org
- [ ] Allow each entry to be its own Markdown file
- [ ] Handle SASS instead of CSS
- [ ] Fast Scroller by Month and Year

## Day 11

Ok, so we have single item pages, they are individually linkable, and we have the JSON file we need that has all the data to fill in the timeline.

So, let's set up the page to request the API and use it.

I will set up a single JS file that only loads on this template to handle this process. And to speed up that connection, I'll use the `preload` link hint to set up the requests.

```html
<link rel="preload" href="{{timelinesConfig.jsPath}}/single-item.js" as="script" />
<link rel="preload" href="{{timelinesConfig.domainName}}/{{timelinesConfig.timelineOutFolder}}/{{timelineEntryItem.data.timeline}}/index.json" as="fetch" />
```

I also will want some of the basic data set up to use in my scripts.

```html
<script>
    window.baseItem = "{{- timelineEntryItem.data.title | slugify -}}";
    window.timelineAPI = "{{timelinesConfig.domainName}}/{{timelinesConfig.timelineOutFolder}}/{{timelineEntryItem.data.timeline}}/index.json";
</script>
```

Now we can `fetch` the data for use.

```js
fetch(window.timelineAPI)
.then((response) => response.json())
.then((data) => {
	console.log(data);
});
```

The objects I need reside on `data.items`. The object properties are:

- `content`
- `date`
- `faicon`
- `humanReadableDate`
- `image`
  - Can contain an `Object` with the properties of:
    - `src`
    - `link`
    - `caption`
- `isBasedOn`
- `links`
  - Can contain an `Array` of `Object`s with the properties
    - `href`
    - `linkText`
    - `extraText`
- `slug`
- `tags`
  - This contains an `Array` of strings.
- `title`

Now I have to use JS to translate it to content on the page.

I could prerender some of this stuff, but, as I may have written before, I'm being very intentional here. The goal is a solo page that represents a solo item and so can be SEOed as such, including building and sending the metaphorical link juice to the good publication.

I'm going to [steal a function from an old project](https://github.com/AramZS/HyperRead/blob/master/index.js), which I actually stole from [Paul Frazee](https://paulfrazee.medium.com/) a while ago.

```js
function h(tag, attrs, ...children) {
	var el = document.createElement(tag);
	if (isPlainObject(attrs)) {
		for (let k in attrs) {
			if (typeof attrs[k] === "function")
				el.addEventListener(k, attrs[k]);
			else el.setAttribute(k, attrs[k]);
		}
	} else if (attrs) {
		children = [attrs].concat(children);
	}
	for (let child of children) el.append(child);
	return el;
}

function isPlainObject(v) {
	return v && typeof v === "object" && Object.prototype === v.__proto__;
}
```

There are a lot of complicated JS to HTML functions out there. I don't need any of them. This isn't updating live, I don't care about state management. Simple basic stuff here. This works, it lets me set up nice HTML with attributes and nested elements. Exactly what I need to make this easy.

I think, even though this is pretty basic, it is going to be easier to manage with a custom HTML element. I haven't done this on the main page, though maybe I should, but with setting it up for building with JS, this just seems easier.

```js

class TimelineItem extends HTMLElement {
	static get observedAttributes() {
		return ["data-buildobj"];
	}
	elBuilder(data) {
		console.log("Set data ", data);
		this.setAttribute("data-tags", data.tags.join(","));
		let timelineIcon = h(
			"div",
			{
				class: `timeline-icon ${data.color}`,
			},
			data?.faicon
				? h("i", {
						class: `fas fa-${data.faicon}`,
						"aria-hidden": "true",
				  })
				: null
		);
		if (data.color) timelineIcon.classList.add(data.color);
		this.appendChild(timelineIcon);

		let timelineDescription = h(
			"div",
			{
				class: "timeline-description",
			},
			h(
				"span",
				{ class: "timestamp" },
				h("time", { datetime: data.date }, data.humanReadableDate)
			),
			h(
				"h2",
				{},
				h(
					"a",
					{ id: data.slug, href: data.slug },
					h("i", { class: "fas fa-link" })
				),
				data.title
			),
			data.image
				? h(
						"div",
						{ class: "captioned-image image-right" },
						h(
							data.image.link ? "a" : "span",
							{},
							h("img", {
								src: data.image.src,
								alt: data.image.alt,
							})
						),
						h("span", { class: "caption" }, data.image.caption)
				  )
				: null,
			data.isBasedOn && data.customLink
				? h(
						"a",
						{ target: "_blank", href: "data.customLink" },
						"Read the article"
				  )
				: null,
			h("span", { class: "inner-description" }),
			data?.links.length
				? h(
						"ul",
						{},
						...(() => {
							let lis = [];
							data.links.forEach((link) => {
								lis.push(
									h(
										"li",
										{},
										h(
											"a",
											{
												href: link.href,
												target: "_blank",
											},
											link.linkText
										),
										` ` + link.extraText
									)
								);
							});
							return lis;
						})()
				  )
				: null
		);
		this.appendChild(timelineDescription);
		let innerContent = this.querySelector(".inner-description");
		innerContent.innerHTML = `${data.content}`;
	}
	connectedCallback() {
		let data = JSON.parse(this.getAttribute("data-buildobj"));
	}
	constructor() {
		// Always call super first in constructor
		super();
		this.setAttribute("aria-hidden", "false");
		this.classList.add("timeline-entry");
		this.classList.add("odd");
		// Element functionality written in here
	}
}

customElements.define("timeline-item", TimelineItem);
```

Originally what I was going to do is set the JSON into the custom element and then use `connectedCallback` to build it when it attaches to the DOM, the `constructor` here for the custom HTML element sets up the element with the basic classes and attributes I need. It really works well here and is straightforward.

This approach is fine, and works with both types of custom HTML elements if I wanted to use the `is: ` based construction of HTML elements. But `div` and this element here is pretty basic and so doesn't need that approach. I also should really construct the element before I attach it, as the DOM would run smoother that way.

Also, something unexpected has happened here, when I ran this with the if statements occasionally casting nulls I discovered something unexpected. `append` seems to cast `null` as a string.

Oh Javascript and your weird casting of various falsys into unexpected stuff.

Ok, so, let's remove the `null` strings from my DOM first. The spread operator `...` turns the passed `children` into an array. So I can use array sanitization technique. Let's just `filter(Boolean)`. `append` may cast `null` weirdly, but `filter` should handle this just fine.

```js
function h(tag, attrs, ...children) {
	var el = document.createElement(tag);
	if (isPlainObject(attrs)) {
		for (let k in attrs) {
			if (typeof attrs[k] === "function")
				el.addEventListener(k, attrs[k]);
			else el.setAttribute(k, attrs[k]);
		}
	} else if (attrs) {
		children = [attrs].concat(children);
	}
	children = children.filter(Boolean);
	for (let child of children) el.append(child);
	return el;
}
```

Bingo, that works!

Now let's set up the custom element with a custom setter to handle the passage of a complex data object into it.

```js

class TimelineItem extends HTMLElement {
	elBuilder(data) {
		console.log("Set data ", data);
		this.setAttribute("data-tags", data.tags.join(","));
		let timelineIcon = h(
			"div",
			{
				class: `timeline-icon ${data.color}`,
			},
			data?.faicon
				? h("i", {
						class: `fas fa-${data.faicon}`,
						"aria-hidden": "true",
				  })
				: null
		);
		if (data.color) timelineIcon.classList.add(data.color);
		this.appendChild(timelineIcon);

		let timelineDescription = h(
			"div",
			{
				class: "timeline-description",
			},
			h(
				"span",
				{ class: "timestamp" },
				h("time", { datetime: data.date }, data.humanReadableDate)
			),
			h(
				"h2",
				{},
				h(
					"a",
					{ id: data.slug, href: data.slug },
					h("i", { class: "fas fa-link" })
				),
				data.title
			),
			data.image
				? h(
						"div",
						{ class: "captioned-image image-right" },
						h(
							data.image.link ? "a" : "span",
							{},
							h("img", {
								src: data.image.src,
								alt: data.image.alt,
							})
						),
						h("span", { class: "caption" }, data.image.caption)
				  )
				: null,
			data.isBasedOn && data.customLink
				? h(
						"a",
						{ target: "_blank", href: "data.customLink" },
						"Read the article"
				  )
				: null,
			h("span", { class: "inner-description" }),
			data?.links.length
				? h(
						"ul",
						{},
						...(() => {
							let lis = [];
							data.links.forEach((link) => {
								lis.push(
									h(
										"li",
										{},
										h(
											"a",
											{
												href: link.href,
												target: "_blank",
											},
											link.linkText
										),
										` ` + link.extraText
									)
								);
							});
							return lis;
						})()
				  )
				: null
		);
		this.appendChild(timelineDescription);
		let innerContent = this.querySelector(".inner-description");
		innerContent.innerHTML = `${data.content}`;
	}
	set itembuild(data) {
		this.elBuilder(data);
	}
	constructor() {
		// Always call super first in constructor
		super();
		console.log("Custom Element Setup");
		this.setAttribute("aria-hidden", "false");
		this.classList.add("timeline-entry");
		this.classList.add("odd");
		// Element functionality written in here
	}
}
```

Now I can pull the individual objects out of the JSON endpoint and set them up with a very simple set, `itemDOMObj.itembuild = item;`. See how cool it is that I can just set the object into the DOM element and it sets up the rest?

Now, to make this as efficent as possible I want to set the DOM elements up as fast as possible and then place them on the page as soon as the DOM is ready. For that, I need to use `DOMContentLoaded` right after I've finished building my objects. I could use `onload`, but only one function can be set to that property. If I use it then I might forget down the line and replace the function by accident. Using the Event Listener is the way to go.

First I set up the objects.

```js
let preload = () => {
	fetch(window.timelineAPI)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			let homeItemFound = false;
			window.timelinePrepends = [];
			window.timelineAppends = [];
			const TimelineEl = customElements.get("timeline-item");
			data.items.forEach((item) => {
				console.log("process this data", item);
				let itemDOMObj = new TimelineEl(); // document.createElement("timeline-item");
				// itemDOMObj.setAttribute("data-buildobj", JSON.stringify(item));
				itemDOMObj.itembuild = item;
				if (item.slug == window.timelineHomeItemSlug) {
					homeItemFound = true;
				} else {
					if (!homeItemFound) {
						window.timelinePrepends.push(itemDOMObj);
					} else {
						window.timelineAppends.push(itemDOMObj);
					}
				}
			});
			console.log(document.readyState);
			if (document.readyState != "loading") {
				console.log("Document ready");
				singleItemPageFill();
			} else {
				document.addEventListener(
					"DOMContentLoaded",
					singleItemPageFill
				);
			}
		});
};
```

I have to set up placing these on the page and I'm going to use `scrollIntoView()` on the DOM element to keep it centered. There will be some movement inside the viewport, but it will be very minimal (I hope).

```js
function singleItemPageFill() {
	/* We have JS! */
	console.log("onload trigger");
	var root = document.documentElement;
	root.classList.remove("no-js");

	let container = document.querySelector("section article.timeline");
	let homeItem = document.getElementById(window.timelineHomeItemSlug);
	container.prepend(...window.timelinePrepends);
	homeItem.scrollIntoView();
	container.append(...window.timelineAppends);
	homeItem.scrollIntoView();
	homeItem.querySelector(".timeline-description").style.border =
		"2px solid var(--border-base)";
	console.log("Build complete");
	reflowEntries();
	// Clean up
	document.removeEventListener("DOMContentLoaded", singleItemPageFill);
}
```

Ok, we're good to go! It fills in great!

`git commit -am "Getting standalone timeline item pages working and using variables more actively throughout"`
