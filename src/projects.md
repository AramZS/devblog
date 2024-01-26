---
layout: tags
templateName: tag
pagination:
    data: collections.projectsPages
    size: 1
    alias: paged
permalink: "posts/projects/{% if paged.number > 1 %}{{ paged.number }}/{% endif %}index.html"
eleventyComputed:
    title: "All project posts{% if paged.number > 1 %} | Page {{paged.number}}{% endif %}"
    description: "Posts about Projects"
---
