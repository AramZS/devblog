---
xxlayout: archives
eleventyExcludeFromCollections: true
xxpagination:
    data: collections.archives
    size: 1
    alias: archive
xxpermalink: "timegate/{{ archive.sanitizedLink }}/index.html"
xxeleventyComputed:
    title: "{{ archive.data.finalizedMeta.title }}"
    description: "{{ archive.data.finalizedMeta.description }}"
    modified: "Last Modified"
---
