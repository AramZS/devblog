---
layout: tags
templateName: tag
pagination:
    data: collections.deepProjectPostsList
    size: 1
    alias: paged
permalink: "posts/projects/{{ paged.slug }}/{% if paged.number > 1 %}{{ paged.number }}/{% endif %}index.html"
eleventyComputed:
    title: "Posts from Project: {{ paged.tagName }}{% if paged.number > 1 %} | Page {{paged.number}}{% endif %}"
    description: "Project Posts tagged with {{ paged.tagName }}"
---
