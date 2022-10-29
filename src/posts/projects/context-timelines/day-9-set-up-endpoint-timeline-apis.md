---
title: Context Center Timelines - Day 9 - Setting up a JSON API for filling in single timeline item pages
description: "Stretching the limits of Nunjucks by using it to create valid JSON."
date: 2022-10-07 22:59:43.10 -4
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

## Day 9

Ok, so to do what I want to do with single Timeline items that can expand into the whole timeline, I'm going to need to have an API with the remaining timeline items. There doesn't seem to be much out there for building JSON using Nunjucks, but I think that's what I'll try to do here.

Setting up a folder for `json` in layouts and using a similar naming style.

The one big problem is default loops have tailing commas. I need some way to avoid that happening.

Jinja, which Nunjucks is based on, [seems to have a `loop.last` variable](https://stackoverflow.com/questions/11974318/how-to-output-a-comma-delimited-list-in-jinja-python-template) that lets you know if you are on the last step of a loop. Nunjucks doesn't seem to have this. But it does [seem to have a `last` filter one can apply to an array to get the last element](https://mozilla.github.io/nunjucks/templating.html#last). Ok, I can use that instead.

```
{% for item in entry.data.tags %}
"{{ item }}"{% if item !== entry.data.tags | last %},{% endif %}
{% endfor %
```

This takes my filters list and outputs them as strings followed by a comma, except for the last one. Looks like this works, even for more complex objects!

Quick note that tripped me up here, if the list is sorted then it needs to be sorted before the `last` filter is applied, like so:

```
{% for filter in filters | sort %}
    "{{ filter }}"{% if filter !== filters | sort | last %},{% endif %}
{% endfor %}
```

This is mostly looking good, but my content text is not being escaped properly. It looks like [I'm not the only one to deal with this](https://www.benjaminrancourt.ca/how-to-generate-a-complete-json-file-with-nunjucks/) and filtering it through ` | dump | safe` does seem to work. I just need to remember to allow it to generate its own quote marks.

Looking good. This is a nice place to take a break. We can go back to the individual timeline items next coding session.

`git commit -am "Set up JSON endpoints for timelines"`
