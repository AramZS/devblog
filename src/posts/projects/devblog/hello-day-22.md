---
title: Hello World Devblog - Pt. 22
subtitle: Getting this dev blog running
description: "More devblog"
project: Dev Blog
date: 2021-08-19 22:59:43.10 -4
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

- [x] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

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

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [ ] Show the latest post below the site intro on the homepage.

- [ ] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with l[inks to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [ ] Create Next Day/Previous Day links on each post

- [ ] Tags should be in the sidebar of articles and link to tag pages

- [ ] Create a skiplink for the todo section (or would this be better served with the ToC plugin?)

## Day 22

Ok did the basics of finishing off tags pages. I also want to link to them on the individual posts.

But we don't want to link to tag pages that I removed because they're collections but not what I think of as tags. So the same filter I applied to build out the tag pages themselves needs to be applied to the post template. Luckily, I have it set up already.

```js
	function filterTagList(tags) {
		return (tags || []).filter(
			(tag) =>
				["all", "nav", "post", "posts", "projects"].indexOf(tag) === -1
		);
	}

	eleventyConfig.addFilter("filterTagList", filterTagList);
```

And now I can run my tags list through that filter in the template.

{% raw %}
```liquid
{% block prefooter %}
	<div id="taglist">
		<h6>Tags: </h6>
        <ul>
			{%- for tag in tags | filterTagList -%}
			    <li><a href="{{ site.site_url }}/tag/{{ tag | slug }}">{{ tag }}</a></li>
			{%- endfor -%}
        </ul>
	</div>
{% endblock %}
```
{% endraw %}

I don't like how that looks though, so let's apply some styling. We'll keep it in the semantically correct unordered list HTML, but I want to change the layout. First let's move it to be an `inline-block`. Then let's add some symbols.

Ok we're going to use `:after`. Oh, why is it autocorrecting me to use `::after`?

[Apparently, that's the standard!](https://stackoverflow.com/questions/17684797/should-i-use-single-colons-or-double-colons-for-before-after-first-le) Did not know that. Ok, so I want to have a `|` seperater between each element, along with the list starting with the character. I know the pseudo-classes for this!

```sass
#taglist
    li
        font-size: 10px
        line-height: 6px
        display: inline-block
        &::after
            content: "|"
            margin: 0 3px
        &:first-of-type::before
            content: "|"
            margin: 0
            margin-right: 3px
```

Hmm, even with line-height set low, I'm still seeing a large separation between lines. It doesn't appear to be based on line-height, I'm not sure where the separation is coming from, it isn't in margin or padding in the Computed area of the styles.

I think it is just the nature of using `inline-block` so better to use something else. I'll use `display: block` and `float: left`. Then to make things flow properly without it colliding into the element below it I'll have to add the same to the `ul` container. So final style is like this.

```sass
#taglist
    ul
        display: block
        position: relative
        float: left
        margin-bottom: 12px
        li
            font-size: 10px
            line-height: 12px
            height: 12px
            display: block
            float: left
            margin: 3px 0
            padding: 0
            &::after, &:first-of-type::before
                content: "|"
                font-size: 11px
                font-weight: bold
                margin: 0 3px
            &:first-of-type::before
                margin: 0
                margin-right: 3px
```

### First response!

Ok, I noticed [I have a PR](https://github.com/AramZS/devblog/pull/1) around [my attempt to open a custom environment](https://github.com/11ty/eleventy/issues/1879). Let's see if it solves [my problems from day 11](https://fightwithtools.dev/posts/projects/devblog/hello-day-11/).

First [`pdehaan`](https://github.com/pdehaan) noted I had a dumb error. Let's see if we can get the array of file strings working properly.

Also they ask: Why did I include the normalize function? Well, I can look back [at day 10](https://fightwithtools.dev/posts/projects/devblog/hello-day-10/) and see that the reason is because, [that's what 11ty did](https://github.com/11ty/eleventy/blob/6776e871128cc3f9895edddadc6408db8abd7fde/src/TemplatePath.js#L95). Good to know. It doesn't look like I need it... on Mac at least? But I assume that this has to do with handling weird paths in a multitude of operating systems, so I'll leave it in, just in case I want to develop in another environment.

Ok, let's leave it in place, but correctly fix all the paths.

Good stuff! Looks like it works.

```javascript
[
  '/Users/zuckerscharffa/Dev/fightwithtooldev/src/_includes',
  '/Users/zuckerscharffa/Dev/fightwithtooldev/src/_layouts',
  '/Users/zuckerscharffa/Dev/fightwithtooldev/src',
  '.'
]
```

So, do all the other things that broke when I last tried this work? Nope, let's move on to the other comments in the PR.

Ok, so first, I've got a new error. For some reason, it isn't going down to the `partials` path inside my `_includes` folder. Ok, I tried removing that specific call and it still isn't working, now it can't see `base.njk`, so the `_includes` folder isn't working at all. Let's try the version in the PR.

Huh, ok, does it need *relative* paths, not absolute ones for some reason?

```
[ 'src/_includes', 'src/_layouts', 'src' ]
```

`pdehaan` left off the `.` path, though that is included in the standard 11ty setup. I'll add it back in, just for consistency.

Let's fix the other errors I made, before we dive back into the environment issues in more detail.

Ok, I think I've puilled in all of `pdehaan` suggestions. (Oops I probably should have made a commit after the tags work huh?)

A commit to cover tags changes:

`git commit -m "Get tags pages working"`

Ok now let's commit with the relative file paths working in the suggested way, since everything seems to be working.

Oh, [let's also fix the styles for my PR to the 11ty website while I'm here](https://github.com/11ty/11ty-website/pull/1135). And, while checking the issues involved with the problem, I noticed [my input may have helped push a Nunjucks config option into the eventual 11ty v1 release](https://github.com/11ty/eleventy/issues/895).

His suggestions to add the `or` to the title, while I understand, I want to avoid, as part of the reason I want it to throw errors is specifically to catch stuff like leaving out a title where there needs to be a title.

I tried a bunch of different ways to do it with the structure of code I had before, but [something is wonky](https://github.com/AramZS/devblog/pull/1/files/7a7fdd4e87fe39360c573b23da06606ae5e9b072#r692597530). I'll remove it out of the flow for now so I can deploy.

Going to break for now, gotta eat.

`git commit -am "Finishing off day 22" `
