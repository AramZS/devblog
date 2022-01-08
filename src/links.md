---
layout: tags
templateName: tag
eleventyExcludeFromCollections: true
pagination:
    data: collections.deepLinkPostsList
    size: 1
    alias: paged
permalink: "links/{% if paged.number > 1 %}{{ paged.number }}/{% endif %}index.html"
eleventyComputed:
    title: "All Links{% if paged.number > 1 %} | Page {{paged.number}}{% endif %}"
    description: "List of links relevant to this site"
---
