---
title: Hello World Devblog - Pt. 32
description: "More devblog"
project: Dev Blog
date: 2021-11-12 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - WiP
  - SEO
  - SMO
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
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

- [x] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

<s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

</s>

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [ ] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [ ] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [x] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [x] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [x] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [x] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [x] Social Icons

- [x] SEO/Social/JSON-LD HEAD data

## Day 32

### Projects Page

I realized that at some point I'm going to have too many projects to fit on the home page, so I [need to limit the number that show up and set up a page to list the overall projects](https://github.com/AramZS/devblog/issues/4).

I want it to sit at `/projects` so I'll create a MD file to handle that and a template to handle this specific page type.

```yaml
---
layout: project-list
pagination:
    data: projects
    size: 1
    alias: project
permalink: "projects/"
eleventyComputed:
  title: "Project List"
  description: "A list of projects that Aram Zucker-Scharff has documented working on."
---
```

I'll start with the project page as the template. Then I can take the loop through the projects object from the front page.

{% raw %}
```liquid
				{% for project in projects %}
					<li class="capitalize-first">
						<a href="{{project.url}}">{{project.title}}</a> | <span>Days worked: {{project.count}}</span> | <span>Status: {{project.complete}}</span> <!-- last updated:  {{project.lastUpdatedPost}} -->
					</li>
				{% endfor %}
```
{% endraw %}

Ok this is good. To make this easy to debug I should put the link on the front page. So to do that I need to do two things, break the project `for` loop, and add a link to the new projects page.

Hmm, [it doesn't look like there is actually a `break` in Nunjucks](https://github.com/mozilla/nunjucks/issues/296). Perhaps I should try altering the array?

Can I use an if check like ` if loop.index < 6` in the for statement? No that doesn't work. Looks like the `if` check [is only for properties of the looped object](https://stackoverflow.com/questions/22150273/how-can-i-break-a-for-loop-in-jinja2).

Ah, no, that's not it at all. That doesn't work. Ah, ok, the best thing to do here is to slice the array before looping it. Instead of a `break` for this situation, we use slice.

`for project in projects | slice(5)`

Yup, that worked!

And I'll remove the dots on the li elements.

```css
    #all-projects
        li
            list-style: none
```

Ok, did a little touching up of the formatting, and now we've got that page. Good to go.

### Preview Images on Lists

Ok, next thing I wanted to check off is including the image on some of the post preview pages. Let's start with the tag pages.

First I'll set up a stand-alone Sass file for the post preview component. Then I'll add a containing class to the post-summary component itself.

Then I'm going to pull the post image HTML out of `post.njk` and into its own file in the `partials` folder. This way I can reuse the basic HTML structure of the image across the site.

Ok, had to make sure my styles are in place but it looks good. I may want to modify the styles a little bit, it isn't perfect and I may want to play with it a bit.

Now I want to add it to the front page as well. But I'll save that until the next day of working on this project.


