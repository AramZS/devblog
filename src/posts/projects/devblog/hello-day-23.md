---
title: Hello World Devblog - Pt. 23
subtitle: Getting this dev blog running
description: "More devblog"
project: Dev Blog
date: 2021-08-28 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - WiP
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

- [ ] Show the latest post below the site intro on the homepage.

- [ ] Tags pages with Pagination

- [ ] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [ ] Create Next Day/Previous Day links on each post

- [ ] Tags should be in the sidebar of articles and link to tag pages

- [ ] Create a skiplink for the todo section (or would this be better served with the ToC plugin?)

- [ ] Next/Previous post on post templates from projects

## Day 23

Huh, pretty sure RSS feeds should be in reverse chronological order, right?

`git commit -m "Reverse chronological order on feeds."`

### Fix Tag Styling

Ok, going to fix the tag styling so it works on all sizes.

`git commit -am "Fix post tag section styling"`

### Activate Table of Contents

Ok, [let's try the Table of Contents Plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) real quick. Then I'll need to get the pagination working for tag pages.

I'm going to grab the style from the Wikipedia table of Contents, including their nifty little trick of setting the container to `display: table` to have it size with the contained text.

Interesting, my Day 1 and Day 2 posts seem to be breaking, with the following error: `attempted to output null or undefined value`. Looks like it is because there's only an `h1` tag generated out of that markdown. Because of that, it seems to be printing it twice.

It looks like the issue is in [how the code is processing the headers](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/master/src/BuildTOC.js#L20). But I'm not seeing exactly what it is.

Whatever the problem is, it seems like adding `h1` to the set of tags is working. I just need to make sure to use the right headers at the right time when writing my markdown.

I want to have the style working a little better now. That means including the same constant for mobile mode so the TOC can have different header spacing on mobile and desktop. Can I move it to a standalone Sass file?

Ok, easy enough to theoretically work. I can move the variable decleration into `constants.sass` and then import it using `@use 'constants'`.

Hmmm. That didn't work. [It looks like it should](https://stackoverflow.com/questions/17598996/sass-use-variables-across-multiple-files/61500282#61500282).

I think [maybe I need to rename the files to have underscores at the beginning](https://alistapart.com/article/getting-started-with-sass/).

Hmm... [looks like the variables are namespaced now](https://stackoverflow.com/questions/60012955/how-to-use-a-sass-variable-across-multiple-pages-using-use)? Renamed the file to `_variables` as well. Yup, that seems to have solved the issue.

Now when I want to use variables inside the `variables` file I have to refer to them as follows:

`@media (max-width: variables.$mobile-width)`

`git commit -m "Add table of contents to posts"`

### Tag Pages

Ok, next we need to paginate the tag pages. I took the structure for the deepTagList from the `vredeburg` theme so I'm going to look to their structure for pagination as well.

Hmm, just pulling it in doesn't seem to work, but doesn't throw any useful errors either.

My [block rendering](https://mozilla.github.io/nunjucks/templating.html) doesn't seem to be working as expected?

Here are my blocks:

{% raw %}
```liquid
<section id="content">
  {% block content %}
  	{{ content | safe }}
  {% endblock %}
</section>
<section id="postcontent">
  {% block postcontent %}
    <!-- postcontent -->
    Post Content Test
  {% endblock %}
</section>
```
{% endraw %}

And my extending template:

{% raw %}
```liquid
{% block content %}
    <h2>Posts tagged: {{paged.tagName}}</h2>
    <div id="post-summary-list">
        <ul>
        {%- for post in paged.posts %}
            <li>{% include "partials/post-summary.njk" %}</li>
        {%- endfor %}
        </ul>
    </div>
{% endblock %}

{% block postcontent %}
    <div class="pagination-block">
        Pages:
        {% if collections.tagList[paged.tagName] > site.paginate %}
            <!--Pagination-->
            {% include "partials/pagination.njk" %}
        {% endif %}
    </div>
{% endblock %}
```
{% endraw %}

But for some reason the content of `postcontent` is showing up in the `content` block.

Is there an open tag somewhere?

([Found out that I was copying code with newline controls in it, not a problem, but good to know.](https://symfony.com/blog/better-white-space-control-in-twig-templates))

Gotta stop here.


