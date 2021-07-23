---
title: Hello World Devblog - Pt. 1
subtitle: Getting this dev blog running
date: 2021-06-12 22:59:43.10 -5
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - WiP
---

# Day 1

I have decided I want a blog to write down some of my decisions as I build various public projects. So, inital requirements:

1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.

So, after being completly put off by the Hugo quickstart page, I decided to go to 11ty. I'd been using 11ty for a very basic build process on another project, so I wanted to see what it would be like for a more complex blog. Everyone I know seems to love 11ty so if I complain about it on Twitter someone will likely give me an answer. This is a requirement I only just realized:

6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.

Ok. 11ty it is.

Ok, first things first. New folder. `git init`.

Oh, it starts new projects with the `master` branch? I don't like that, I like using `main`. I can checkout main and delete master right?

Huh... if you don't have anything committed to any branch and you checkout a new branch the `master` branch ceases to exist. Cool. I guess I don't need to do [this](https://www.git-tower.com/learn/git/faq/git-rename-master-to-main/).

Wait... does 11ty work with GitHub Actions to build? I have no idea. [Looks like yes](https://www.linkedin.com/pulse/eleventy-github-pages-lea-tortay/)... let's move forward.

`npm init -y`

`npm install --save-dev @11ty/eleventy`

Here we go with 11ty! Only...

All the pre-built... ughhh "Themes" or "Starters" (I can't say template here, because searching for "11ty templates", while a logical thing to do, just gives me a ton of pages about using Nunjucks) suck. They all suck hardcore. I mean, they're all single page sites with no clear navigation or nav bar and look barely worked out beyond the Bootstrap Starter Template phase. I can't stand any of them. Is there a secret location for good 11ty themes or is it just that the type of folks most likely to use 11ty lack design skills?

But... I really like the Jekyll dinky theme. All I really need is the CSS and I can pull a copy of its template into whatever. Easy enough in theory (never in practice).

I'm going to pull it in as a submodule. I forgot how to do submodules. [Here we go](https://github.blog/2016-02-01-working-with-submodules/).

`git submodule add git@github.com:pages-themes/dinky.git`

`git submodule update --init --recursive`

Alright, what have we got here.

Sass. We've got Sass. That's going to need to be figured out.

Let's go to the 11ty plugins and see what, if anything, can help me here.

Oh and let's grab some cool looking ones.

`npm install @11ty/eleventy-img`

Huh, some funkyness on the install... because I forgot that, for various complicated reasons, my Node install defaults to 8.*.

Ok. Create the `.nvmrc` file and what's the latest version of node these days? Put `16` in it.

Reboot my console so I take advantage of [the nifty nvm auto-load ZSH script](https://gist.github.com/AramZS/fda9c04a38908789dccdf78bb94e2b45).

Dump package-lock, dump node_modules, `npm install` again.

Plugin install works now.

`npm install @11ty/eleventy-plugin-syntaxhighlight --save-dev`
`npm install @11ty/eleventy-navigation --save-dev`
`npm install @11ty/eleventy-plugin-rss --save-dev`

`npm install eleventy-plugin-sass --save `

Ok, that didn't work. And the whole point of looking at plugins was a SASS processor integrated into the 11ty build process. Not great. What's wrong?

Looks like something with `node-gyp`. Frequently a problem.

Let's check `node-gyp`.

Ok, a whole thing for problems from an upgrade.

Let's do all of [that](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md). XCode needed an update and for some reason updating to Catalina also wiped out my XCode CLI tools... didn't realize that. Reinstall those:

`xcode-select --install`

Ok, cool. Moving on...

Oh, I am looking at the configuration options for `gulp-sass` which get passed into the 11ty plugin and looks like `gulp-sass` is depreciated. So this plugin is not one I want to use. And it looks like there isn't an up to date Sass plugin.

lol.

So, let's assume I'm going to have to write my own plugin. I know nothing about 11ty plugins. Find a real basic one and use that as the template to start a new one.

This [one](https://www.npmjs.com/package/eleventy-plugin-meta-generator) looks pretty simple! So I'm going to keep that tab open for reference as I build out a Sass processor.

[ ] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

[ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

I also saw [a Loader plugin](https://www.npmjs.com/package/eleventy-load)... but it looks way more complicated than I need while also *not doing what I need*, so mark it, move on. Might have something in its code that's useful for later.

[ ] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/blob/master/src/BuildTOC.js) mby?

Ok, back to Sass. Now, I don't want to fk around with building a whole NPM module for this right now, so let's start with the plugin internal to the project.

There does not seem to be a standard pattern for these like there is for layouts, data, etc... so I'm going to imitate the `_{thing}` pattern and make a `_custom-plugins` folder. Maybe someday someone will read this and tell me this is a dumb pattern. Put it in there. Node module structure, `index.js` at the base, `src` folder with the files that actually do stuff.

Ok let's get Sass in here. I want the Javascript library, so read through docs [at their site](https://sass-lang.com/dart-sass).

`npm install sass --save-dev`
`npm install fiber --save-dev`

That 2nd one didn't work... cool, what is Fiber... let's [read about it](https://github.com/laverdet/node-fibers).

> Update [April 13th, 2021] -- Fibers is not compatible with nodejs v16.0.0 or later. Unfortunately, v8 commit dacc2fee0f is a breaking change and workarounds are non-trivial.

*sigh*

Ok, using latest version of Node, clearly a bad choice.

`.nvmrc` changed to `15`. I like 15, I've used 15 for other stuff. Hopefully no problem.

You know... reading node-fiber's documentation... I... don't actually need it anyway. I want `renderSync`, to block the build process of 11ty until the right assets are done.

Whatever... never use latest Node... it always causes problems. I have encountered this time and time again. Clear out package-lock and node_modules.

`npm install`

Ok at this point my process has already become more muddled then I'm comfortable with. Better start documenting it actually. Oh wait, this is a dev blog, I should start documenting it AS A BLOG POST.

I forgot the pattern for 11ty posts' folders in a project. [Here it is](https://github.com/11ty/eleventy-base-blog/tree/master/posts).

Started this file.

Forgot the number of dashes for the metadata format for markdown that 11ty likes because it is not 8:30pm and I have not yet had dinner. I was reading about some feature that mentioned it in the context of merging data from templates with markdown files, I should likely note that.

[ ] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

Ok now:

[x] Write everything down that I've done to this point before it zeroes out of my head.

God bless CLI and browser history.

Ok, back to the Sass plugin. And also: this would be a good time to do a commit huh?

`git commit -am "a real 11ty blog... I don't know wtf I'm doing to make this work yet"`

Ok, `dart-sass`. I don't know what any of these listed options are...

Annoying, since they are emulating the `node-sass` API, it's just a link to the `node-sass` README documentation. Ok, taking a look.

7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

I also would like to have smart CSS, where it only loads the CSS files it needs for a template, so we'd have a main CSS file and then per-template CSS files? That would be cool. Or maybe [this thing](https://github.com/addyosmani/critical#usage)? You know what... table that... let's just render the damn CSS first.

[ ] Decide if I want to render the CSS fancier than just a base file.

Huh... a thought... can I just run any arbitrary function in 11ty as part of the build?

[Looks like](https://www.11ty.dev/docs/data-js/) the `_data` folder can contain functions that output arbitrary files?

Should I do that? I mean... I likely could... but it isn't elegant, it isn't the *right* way. Skip it.

Ok, set it up with the most basic Sass build rules. Let's hold there, I'm going to want to try it out, but first, let's make sure the normal 11ty build works.

Ok, to do that I need a layout in place. Get it in [the right place](https://github.com/11ty/eleventy-base-blog/tree/master/_includes/layouts).

To make sure my CSS works properly, I should prob set up the dinky layout here. `dinky/_layouts`. Ok... only one file, easy enough. And the template syntax looks basically identical. Copy it and paste it into the `_includes/layouts` folder and rename it to `default.njk`.

NOTE: I'm pretty sure that Nunjucks can process HTML files. Do I want to just add a 11ty alias to just pull default.html from dinky in the style of `eleventyConfig.addLayoutAlias("base", "dinky/_layouts/default.html");`? Would that work? Put a pin in that:

[ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

Pull the .eleventy.js return from the [base blog](https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js) and change output to `docs` for Github Pages...

```javascript
		dir: {
			input: ".",
			includes: "_includes",
			data: "_data",
			output: "docs",
		},
```

Wait... it's pulling njk files from the base of the project? Mixing project files with build configuration files? That's HOT NONSENSE. I did that last time, but it was becaause I wanted to build some real basic pages and only a few of them. Not good for a larger project IMO. Create an `src` folder.

`input: "src",`

Crap... what of these folders do I need to move in? I guess `posts`? That is likely it. I'll find out later!

Ok, theoretically should be able to make a build. Moment of truth.

`npx @11ty/eleventy`

It did not pick up the template

Let's try altering the .eleventy.js returned data to include, and I'll move the folder accordingly:

`layouts: "_layouts",`

Still didn't pick it up.

Ok, gotta play around, but good time to commit

`git commit -am "First render, didn't work"`

Time to take a break for dinner.
