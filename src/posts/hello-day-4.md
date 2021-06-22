---
title: Hello World Devblog - Pt. 4
subtitle: Getting this dev blog running
description: Part 3 of setting up 11ty deb blog.
project: Dev Blog
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - WiP
---


1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

[ ] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

[ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

[ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/master/src/BuildTOC.js) mby?

[ ] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

[ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

[ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

[ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

[ ] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is how Jekyll accomplishes this, but is there a way to push that into the build process for 11ty?

[ ] Make link text look less shitty. It looks like it is a whole, lighter, font.

[ ] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

# Day 4

Ok, don't have a ton of time to work today, but I've been thinking more about the shitty code blocks.

The core of the problem is that I can't even apply styles the way I want because the code is not being broken down properly.

Here's what I'm getting:

{% raw %}
```html
<pre class="language-markdown">
	<code class="language-markdown">
		<span class="token front-matter-block">
		<span class="token punctuation">---</span><br>
		<span class="token font-matter yaml language-yaml">layout: page</span><br>
		<span class="token punctuation">---</span></span>
	</code>
</pre>
```
{% endraw %}

What I want would look like this:

{% raw %}
```html
<pre>
	<code class="language-markdown" data-lang="markdown">
		<span class="nn">---</span>
		<span class="na">layout</span><span class="pi">:</span> <span class="s">post</span>
		<span class="nn">---</span>
	</code>
</pre>
```
{% endraw %}

See the greater level of styling detail available via the additional span tags?

Ok. So, like I said, surely a lot of people are using 11ty to demo code. Why not take a step back?

Instead of trying to get some increasingly complex markdown processor in play to do this, let's see if there is a code block plugin instead? If anyone uses it I bet 11ty's website does?

[Yup](https://github.com/11ty/11ty-website/blob/master/.eleventy.js#L14)!

[Reading the docs](https://www.11ty.dev/docs/plugins/syntaxhighlight/). Looks like it uses Prism, which I'm also familiar with. I'll try to implement like the 11ty site does.

Ok, that looks a LOT better! I'll have to walk through some examples to make sure it works.

git commit -am "Syntax highlighting actually working now?"
