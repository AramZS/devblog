---
title: "Part 28: Featured Images"
description: "More devblog"
project: Dev Blog
date: 2021-10-07 22:59:43.10 -4
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

- [ ] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [ ] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [ ] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [ ] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [x] Social Icons

- [ ] SEO/Social/JSON-LD HEAD data

## Day 28

Ok, we're blocked from finishing the various social and search tags by the lack of feature images in the blog. So that's next.

### Featured Images

So I want to have intellegent defaults here as well. I can have defaults at the project level, the site level and the individual post level. For the Devblog project I'll add to the `devblog.json` file `"featuredImage": "radial_crosshair.jpg"`. All my images will be in `../img/` so to keep it DRY let's leave that out of the filepaths.

I'll set the same property at the site level, taking my default image from my GitHub blog.

Ok, for the individual blog posts I guess I'll need a little more detail. Since I'll often be taking photos from Creative Commons I need to have a place to put credit. Ok, so I've got a few things to add to the YAML metadata.

```yaml
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keys."
```

I can add the following block to my `social-header.njk` file now:

{% raw %}
```liquid
{% if featuredImage %}

<meta property="og:image" content="{{site.site_url}}/img/{{featuredImage}}" />
<meta name="twitter:image" content="{{site.site_url}}/img/{{featuredImage}}" />

{% endif %}
```
{% endraw %}

`git commit -am "Day 28 half way done."`

[In my Jekyll site](https://aramzs.github.io/jekyll/social-media/2015/11/11/be-social-with-jekyll.html) I had to code a page-level value with a site-level fallback. [11ty's deep data merge process](https://www.11ty.dev/docs/data-deep-merge/) allows me to just rely on the cascade of settings and JSON files to properly select a default.

Ok, that's the social tags! I'll set an else condition to make sure that there is always an og:type (default to `content="website"`) and we're good to go.

Oh, I want to add the post image to the template too, but only when it is one set at the post level. Being a good web citizen, I should always have alt text on my image, so I'm going to only include it in the post template when I have alt text, that's an easy way to assure not every post has the default image.

I dunno what the right tag is for this? Sometimes I use `aside` but I think I'm supposed to use `figure` right? I'll use that here.

{% raw %}
```liquid
    {% if featuredImageAlt %}
    <figure class="figure preview-image">
        <img src="{{site.site_url}}/img/{{featuredImage}}" alt="{{featuredImageAlt}}">
        {% if featuredImageCaption or featuredImageCredit %}
        <figcaption class="figcaption">
            {% if featuredImageCaption  %}{{featuredImageCaption}}{% endif %}{% if featuredImageCredit  %} | <em><a href="{{ featuredImageLink }}" target="_blank">{{featuredImageCredit}}</a></em> | {% endif %}
        </figcaption>
        {% endif %}
    </figure>
    {% endif %}
```
{% endraw %}

Ok, basic image stuff works!

`git commit -am "Last commit from day 28"`
