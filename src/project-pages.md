---
layout: projects
pagination:
    data: projects
    size: 1
    alias: project
permalink: "projects/{{ project.slug | slug }}/"
eleventyComputed:
  title: "Project: {{ project.projectName }}"
  description: "{{ project.description }}"
---

