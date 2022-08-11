---
title: Context Center Timelines - Day 5 - Making Templates More Useful and Accessible to Site Developers.
description: "Setting up better versions of the timeline templates that can be extended by the site in use"
date: 2022-08-10 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - Context
  - Nunjucks
  - WiP
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

## Day 5

I realized that extending sites using the plugins, including my own, might want to insert stuff in the templates, like a nav.

Thankfully, Nunjucks templates in 11ty can do some really interesting things.

I was hoping I could treat it like it was all in one location. However, it doesn't seem to be the case. I can create a filepath to it from my site directory like:

```liquid
{% include "../../_custom-plugins/timelinety/src/layouts/timeline-base.njk" %}
```

Oh, but the actual `js` block (that starts and ends with `---`) that can be at the top of the `njk` file has to *only* be at the top of the top most template file. So I can't use or extend a template that contains that. I'll have to further destructure my templates so that I can use them effectively.

Now I have `timeline.njk` which can be used by someone who wants an out-of-the-box timeline. It looks like this:

```njk
---js
{
    eleventyComputed: {
        applyThis: {
            timelineCheck: function(siteContext){
                if (siteContext){
                    console.log(siteContext.timeline, "Global check")
                }
            },
        },
        title: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.title

            return '';
        },
        description: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.description

            return '';
        },
        tags: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.tags

            return [];
        },
        categories: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.categories

            return '';
        },
        filters: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.filters

            return [];
        },
        date: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.date

            return "Last Modified";
        },
        header: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.header

            return [];
        },
        color: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.color

            return 'grey';
        },
        shortdate: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.shortdate

            return false;
        },
        lastUpdatedPost: function(siteContext){
            if (siteContext?.timeline)
                return siteContext.timeline.lastUpdatedPost

            return false;
        },
    }
}
---
{% include "./timeline-wrapper.njk" %}

```


`timeline-wrapper.njk` which can be extended by someone who wants to use it in their own template and even has some nice Nunjucks blocks that can be used to overwrite the header or the nav. They'll have to pull in their own version of the `---js` block of course.

```njk
<!DOCTYPE html>
<html lang="en" class="no-js">
    <head>
    {% block head %}

        {% include "./head.njk" %}

    {% endblock %}
    </head>
    <body>
    {% block nav %}
        <!-- <nav><a href="{{timelinesConfig.domainName}}">Return to Home</a></nav> -->
    {% endblock %}
    {% include "./timeline-base.njk" %}
    </body>
</html>
```

I have the previously created `head.njk` that I cas use as the default setup for the HEAD element. Then I have `timeline-base.njk` and that has the core timeline setup, which itself has the previously set up `timeline-entry.njk`.

It's a little complicated, but I think that's the best way to handle the logical file separations and also allow future developers to extend it.

Ok, but now I need to reorganize my styles a little so I can get the Nav in there and have it look the same as the rest of the site.

That will mean pulling out the nav styles into their own SASS file that I can include in the timeline SASS file, as well as grabbing some of the color rules on `:root` and some of the other style rules on the base SASS. This will essentially allow me to encapsulate the nav.

`git commit -am "Restructure timeline templates and SASS code to support new configuration."`
