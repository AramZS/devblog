---
title: Hello World Devblog - Pt. 2
subtitle: Getting this dev blog running
description: Part 2 of setting up 11ty deb blog.
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

Ok, looks like I can't use this structure:
{% raw %}
`{{ site.lang | default: "en-US" }}"`
{% endraw %}

So, default values, how should I do them? It [looks like](https://www.11ty.dev/docs/data-cascade/) the answer is to define it as [a data global](https://www.11ty.dev/docs/data-global/). Ok let's try it, place the default in `src/_data/site.json`.

```json
{
	"lang": "en-US"
}
```

Huh... render error on *this* file:

`TemplateContentRenderError ... expected variable end`

Going to remove {% raw %}`{% seo %}`{% endraw %} from the template. I assume it is a template fragment without looking it up but I'm not prepared to figure it out. Still no solve. Good time to commit!

`git commit -am "Template still not working but getting closer"`

Ok, let's start stripping out stuff from the template. The error indicates the problem is in my markdown, but that doesn't make sense, so simpler template. Ok, first, I want the dinky assets folder so it works properly in the template. There are [more ways to configure the passthrough rules](https://www.11ty.dev/docs/copy/#change-the-output-directory) to make this work for me.

`eleventyConfig.addPassthroughCopy({ "dinky/assets": "assets" });`

Ok, passthrough works! But the template still won't render. The error is still in my markdown! At `[Line 49, Column 67]`. What is going on?! That line is empty, it doesn't have columns.

Wait... the line number is likely being calculated after the metadata is removed from the head of the `md` file. Ok... my metadata takes up 10 lines so it is really line *59*. Oh! It's a code sample *from* the template. It's trying to render an njk variable from the markdown file?! That's very dumb.

To Google! "njk picking up code sample of njk code" > [result](https://github.com/11ty/eleventy/issues/791).

Raw tag huh? How does that work exactly? Oh... like [this](https://github.com/11ty/11ty-website/blob/master/src/docs/languages/nunjucks.md).

Ok, works both for blocks and inline, good!

Ok, defaults for posts *have* to be in the `posts` folder's `posts.json`. I cannot seem to set any defaults for posts in the `_data` folder. Or at least I haven't figured out how. But ok, things are rendering now in the right template. Also the assets are being passed out of the `dinky` submodule! This is good. The process works, so now I can start to build in my weirdness.

I still really want to figure out the defaults thing first. How do I make this work?

Ok, [here we go](https://github.com/11ty/eleventy/issues/380#issuecomment-568033456).

So to get a default `description` value in my template I can set it up with a file at `src/_data/description.js` and have the content of that file be `module.exports = "Talking about code";`. Ok, that works!

Yay, 11ty defaults work now! Good place to commit.

`git commit -am "Ok, renders and defaults are working now"`

Hmmm... ok I guess that I picked a bad example plugin, because the one I used [doesn't have a typical footprint](https://www.npmjs.com/package/eleventy-plugin-meta-generator#usage). Well, I'm not going to have a typical footprint I guess. Let's start without that. It runs sync, so I can just call the function during setup mby? Just add `sassBuild();` to the inside of my .eleventy.js function inside of `module.exports = function (eleventyConfig) {`?

Ok... renderSync from `dart-sass` threw an error:

```bash
Receiver: Closure '_renderSync'
Arguments: [Instance of 'PlainJavaScriptObject', Instance of 'JavaScriptFunction']

`` was thrown:
    NoSuchMethodError: method not found: 'call'
```

Lol [documentation error in dart-sass](https://github.com/sass/dart-sass/issues/23#issuecomment-259011350) apparently. Don't pass two functions, because that's an async pattern, instead return the result.

Cool. New error!

`Invalid argument(s): Either options.data or options.file must be set.`

Can I not use multiple files? I guess I need a single file that calls the others [using @use](https://sass-lang.com/documentation/at-rules/use). Last time I used Sass it was @import, but according to docs, that method is out now. Good to know!

Oh, gotta remember paths are relative to execution, so I have to set up paths in both the Sass plugin AND the `@use` relative to the base of the project, where I'm executing the 11ty build process.

Still no css file.

Oh, [lol](https://sass-lang.com/documentation/js-api#outfile)

> Despite the name, Sass does not write the CSS output to this file. The caller must do that themselves.

Ok, gotta do that.

Ok, I want to use `fs` to write the resulting file into `docs/styles/styles.css`. Only, the `styles` directory does not predictably exist so `fs` fails because I have to make that folder. Of course, forgot. Easy enough.

Ok, it works! This is a good place to stop because it is almost midnight.


