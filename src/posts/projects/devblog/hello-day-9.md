---
title: "Part 9: Post Data in Templates"
subtitle: Building out more Eleventy Data and places to use it
description: Day 9 of setting up 11ty dev blog.
project: Dev Blog
date: 2021-06-28 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - WiP
  - RSS
  - Nunjucks
---

## Project Scope and ToDos

1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [x] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [ ] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

## Day 9

### RSS Feed and File Type on GitHub

Looks like the RSS feed is correct but being served from Github Pages as "application/octet-stream". I found a Stack Overflow that said it needs a trailing slash. But now that serves it as text/html. Apparently it needs to have an xml ending, but if we want to keep `/rss/` [we need to create an xml file](https://luosky.com/2012/07/24/create-custom-rss-feed-for-octopress/).

`git commit -am "Set an xml index for the rss path"`

That did it! Good to know that Github Pages is *very* dependent on file endings, and if it doesn't get them it defaults `/path-with-no-ending-slash` to a downloadable octet-stream and `/path-with-ending-slash/` to HTML.

### Filling in Post Data and Templates

I want to build some post-only conditionals into a common base template. The goal here is to make my templates as DRY as possible. No code should have to be repeated. Looks like there [are some tools to do that in Nunjucks](https://bryanlrobinson.com/blog/using-nunjucks-if-expressions-to-create-an-active-navigation-state-in-11ty/).

Ok, so I'm going to split this into a few chunks.

First I'm going to establish a base template, one that all the others can pull off of. This can set up the basic HTML structure, my HTML, HEAD and BODY tags. It can also establish the baseline HTML to make the template work, like the wrapper-classed div and the semantic HTML5 tags within.

`git commit -am "Setting up some templates to inheret from."`

Then I'll want to define the areas that the layouts that pull off the base can pull from. Nunjucks seems to do this with `block` tags. So I'll set up some of these block tags in the {% raw %}`<main>`{% endraw %} area to start with.

{% raw %}
```liquid
		<main>
			{% block precontent %}
			{% endblock %}
			<section>
				{% block content %}
				{{ content | safe }}
				{% endblock %}
			</section>
			{% block postcontent %}
			{% endblock %}
		</main>
```
{% endraw %}

With the basics in place, I can actually drop the entire content of `post.njk` and replace it with an `extends` statement.

{% raw %}
{% extends "base.njk" %}
{% endraw %}

The original dinky template was designed for single page sites. So the post template works pretty much unchanged with no issues. But what about my index page? I'm going to want to add stuff to there.

### Post Lists

First of all, I want a chunk of that page that shows my various Work in Progress posts. I've tagged the posts themselves correctly [to create an 11ty collection](https://www.11ty.dev/docs/collections/), but I need to figure out how to call it. And I may want to display it elsewhere, so I'm going to create a component I can easily include that walks through the WiP tag.


{% raw %}
```liquid
<ul>
    {% for post in collections.WiP %}
	<li>{{post.data.title}}</li>
	{% endfor %}
</ul>
```
{% endraw %}

This is a good start, but what if I only want one category of WiP? Or if I want to separate it out into projects? I need to make this more reusable.

But what about sorting? I may need to sort by date and dates are always messy. To make sure I can get them work right, I should start by adding a date to all post templates. I could add it in the post template itself, but I suspect there may be other pages I want to have the date on, so I'm going to handle it with an if/else chain at the base template.

```liquid
	<header>
	{% block header %}

		{% if '/posts' in page.url %}
		<!-- post mode -->
		<time>{{ page.date.toDateString() }}</time>
		{% elif '/projects' in page.url %}
		<!-- projects mode -->
		{% else %}
		<!-- else mode -->
		{% endif %}
		<h1 class="header">{{ title }}</h1>
		<p class="header">{{ description }}</p>

	{% endblock %}
	</header>
```
Oh, these dates aren't great, they seem to be pulling from some info that isn't totally accurate via the 11ty defaults

Surprising no one, dates are a [Common Pitfall](https://www.11ty.dev/docs/pitfalls/). [11ty documentation advises to directly set the date](https://www.11ty.dev/docs/dates/). And I can't just set them any which way, I need to set them [via the YAML date format](https://yaml.org/type/timestamp.html). Once that's done, I can display them using that built-in toDateString function in a way that makes the dates more human readable.

`git commit -am "Adding template parts"`

Ok back to my reusable post list. I started with a pretty basic version, but it looks to me like [the right approach is Macros](https://www.trysmudford.com/blog/encapsulated-11ty-components/).

Huh... that didn't work.

Ok maybe this:

{% raw %}
```liquid
<!-- https://www.11ty.dev/docs/collections/ -->
<!-- Should I use {{ "abcdef" | reverse }} -->
<ul>
	<!-- Collection: {{collectionName}} -->
    {% for post in collections.{{collectionName}} %}
	<li>{{post.data.title}}</li>
	{% endfor %}
</ul>

```
{% endraw %}

Especially with the variable name in the `for` deceleration? I don't know if that works the way I think it does and I may even just need [a shortcode instead](https://www.11ty.dev/docs/languages/nunjucks/#shortcodes). But I'd like to get it working. Let's try just echoing out the passed in value first.

Damn, still no go.

`git commit -am "Get macros in the mix."`
