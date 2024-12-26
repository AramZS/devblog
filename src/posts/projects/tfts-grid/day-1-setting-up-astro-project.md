---
title: Setting up a new site to get more hands on with Astro - Day 1
description: "Rebuilding an old site that broke, a wiki for a game I run."
date: 2024-12-23 22:59:43.10 -4
tags:
  - Node
  - Javascript
  - Astro
  - HTMX
  - HTML
  - TTRPG
---

## Project Scope and ToDos

1. Create a new site

- [ ] Can be searched

## Day 1

Going through the Astro Vercel setup

### Usage with Vercel

- [@astrojs/vercel | Docs](https://docs.astro.build/en/guides/integrations-guide/vercel/)
- [On-demand rendering | Docs](https://docs.astro.build/en/guides/on-demand-rendering/)
- `npx vercel login`
- Build locally
	- `npx vercel build`
- **Note**: Vercel serverless currently (12/08/24) only works with Node 18. Make sure to use Node 18. - [Serverless Function contains invalid runtime error](https://vercel.com/guides/serverless-function-contains-invalid-runtime-error)

### Trying plugins

I'm also interested in trying out more plugins with Astro. Here's some of the ones I'm looking at

#### Plugins

- [@astrojs/mdx | Docs](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [@astrojs/partytown | Docs](https://docs.astro.build/en/guides/integrations-guide/partytown/)
- [@astrojs/sitemap | Docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [@astrojs/alpinejs | Docs](https://docs.astro.build/en/guides/integrations-guide/alpinejs/)
- Interesting - [Share state between Astro components | Docs](https://docs.astro.build/en/recipes/sharing-state/)

