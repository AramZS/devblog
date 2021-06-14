---
title: Hello World Devblog - Pt. 2
subtitle: Getting this dev blog running
tags:
  - Starters
  - 11ty
  - Node
  - Sass
---

# Day 2

Ok, day 2. Let's restate the requirements and todos!


1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

[ ] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

[ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

[ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/master/src/BuildTOC.js) mby?

[ ] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

[ ] Decide if I want to render the CSS fancier than just a base file.

[ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

Ok, so why isn't it picking up the layout from either `_layouts/post.njk` or `_layouts/default.njk`? Maybe I need to define a default [at the data level](https://www.11ty.dev/docs/data-template-dir/)? Or do I need to move it to `src` even if I define the location in the returned configuration?

Moving it into `src` doesn't seem to do anything. But it looks like all the files I configure into 11ty in the returned object do need to be in there, so apparently I can't set a default layout in the `data` folder?

Adding a template to `src/posts/posts.json`

```json
{ "layout": "layouts/post.njk" }
```

Ok, yay, an error!

`Error You’re trying to use a layout that does not exist layouts/post.njk (undefined)`

Because I defined a path to layouts in the config, I don't need to include it?

```json
{ "layout": "post.njk" }
```

Yup, now I have an error in the template!

Ok, looks like I can't use this structure: `{{ site.lang | default: "en-US" }}"`

So, default values, how should I do them? It [looks like](https://www.11ty.dev/docs/data-cascade/) the answer is to define it as [a data global](https://www.11ty.dev/docs/data-global/). Ok let's try it, place the default in `src/_data/site.json`.

```json
{
	"lang": "en-US"
}
```

Huh... render error on *this* file:

`TemplateContentRenderError ... expected variable end`

Going to remove `{% seo %}` from the template. I assume it is a template fragment without looking it up but I'm not prepared to figure it out. Still no solve. Good time to commit! 
