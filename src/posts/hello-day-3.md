---
title: Hello World Devblog - Pt. 3
subtitle: Getting this dev blog running
description: Part 3 of setting up 11ty dev blog.
project: Dev Blog
tags:
  - Starters
  - 11ty
  - Node
  - Sass
  - WiP
---


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

[ ] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

[ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

## Day 3

Ok, so I'm at day 3 and everything is working at a basic level. I need an index/entry page and some ways to present posts in lists. I also am not a huge fan of the `site/posts/post-name` structure.

[ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

There's also an open question of Why Nunjucks? I'm not the biggest fan of Nunjucks, outside of the 11ty community that seems to be heavily invested into it, not many people seem to be using it. Documentation is (as we've already seen) sorta iffy and its relatively low adoption makes it harder to get questions answered.

I also haven't quite gotten syntax highlighting to work for `njk` files in VS Code, which is *very* frustrating and often turns me off from using something.

I could, at this point, switch to Mustache, which I'm [already pretty familiar](https://glitch.com/edit/#!/thespin?path=server.js) with. Mustache also has the advantage of having template tags that are more similar to Jekyll and more familiar to Javascript users. But, unless I hit a real bad obstacle I don't think I will, for two reasons. First, the point of this is to learn something new! Second, when I last tried 11ty to basically generate a few quick pages from a common template, it had terrible trouble rendering with Mustache, even with the instructions from their site. I've got other things to complicate first, can save that for later. If I get everything working, I might come back to this issue.

Ok, [got Nunjucks syntax highlighting to properly work](https://marketplace.visualstudio.com/items?itemName=ronnidc.nunjucks) for now!

Stepping back it looks like the rendered site in the `docs` folder is generally looking ok. There's one issue, my passthrough of assets includes an `assets/css` folder with an entirely useless sass file that would be public-facing. So I'm going to have to do subdirectories of assets instead. Should be easy enough.

Huh... it doesn't clean up the now defunct `css` folder. Is there a build tool to clean things up?

[Looks like it doesn't ship with 11ty](https://github.com/11ty/eleventy/issues/19). But there [are other solutions that people have done](https://github.com/11ty/eleventy/issues/744).

I like [the solution that defines the site configuration earlier](https://github.com/11ty/eleventy/issues/744#issuecomment-800323968), it seems generally useful. I'll give it a try.

That works! Deleting the whole folder and building it all new seems super inefficient, but there doesn't seem to be another way to handle things.

One other throught now occurs. I saw that the dinky template uses some sort of build version number passed by github on build to cachebreak. I'm not sure how that works or if it can work the same way for 11ty. Perhaps I need to pass a datetime stamp for each build instead? Something to figure out later.

[ ] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is how Jekyll accomplishes this, but is there a way to push that into the build process for 11ty?

`git commit -am "Self-cleaning builds"`

11ty build is now stable enough that I might be able to develop with `npx @11ty/eleventy --serve` and check in on it. Let's see what it looks like.

Gotta adjust my CSS output path to match the template file's.

Ok, content is rendering as escaped HTML. That's not right at all.

Ahhh, apparently (here we are at poorly documented Nunjucks again...) my content tag needs to be {% raw %}`{{ content | safe }}`{% endraw %}.

Ok, it's working now! Good signs! Hmmm. I was hoping that 1-space empty brackets would be rendered as a checkbox, as in Github-flavored markdown. But apparently not. How difficult would that be to fix?

Hmmm also some other problems:

[ ] Make link text look less shitty. It looks like it is a whole, lighter, font.
[ ] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

I [have syntax highlighting styles](https://github.com/AramZS/aramzs.github.io/blob/master/_sass/_syntax-highlighting.scss) I like on my Github user Pages site. Let's just reuse it.

Huh... why doesn't the plugin for building Sass re-trigger on watch? [Looks like there's a way to fix that](https://www.11ty.dev/docs/events/#beforewatch).

Ugh... apparently the Sass syntax has changed significantly since the last time I used it and also since it was set up in my other site. I'll need to correct.

*sigh*

Ok [it's changed a lot](https://stackoverflow.com/questions/56858150/i-am-gettiing-an-error-expected-new-line-while-compiling-sass). And the Sass build tools are dickishly specific about spaces over tabs. Need to add a new section to my `.editorconfig`.

```

[*.sass]
indent_style = space

```

Ok, I tried building the extendable [placeholder](https://sass-lang.com/documentation/style-rules/placeholder-selectors) into a standalone Sass file and a standalone Scss file and [it looks right](https://sass-lang.com/documentation/at-rules/extend#placeholder-selectors). But `@extend %vertical-rhythm` still isn't working.

My ordering looks correct!

```sass
@use '_sass/base-syntax-highlighting'
@use '_sass/syntax-highlighting'
```

What's going on?

First error is a depreciation error. It *shouldn't* be a problem, but let's just get rid of it.

```bash
DEPRECATION WARNING: Using / for division is deprecated and will be removed in Dart Sass 2.0.0.

Recommendation: math.div($spacing-unit, 2)

More info and automated migrator: https://sass-lang.com/d/slash-div
```

Alrighty. [Go to the docs and do what it says](https://sass-lang.com/documentation/breaking-changes/slash-div). Side comment... this is dumb. Why is it *easier* to do this type of math with standard CSS (where it would be `calc()`) than it is with Sass. Why is Sass harder to use now than it was when I got deep into it years ago? Grrrrr.

OMG why does this documentation start off with `// Future Sass, doesn't work yet!`?!?! Why would you start off a documentation file with a suggested solution that **doesn't work**?!

Ok. Down to one error. Still not importing the placeholder, why not?

Oh no. This is [A Problem](https://github.com/sass/dart-sass/issues/1042#issuecomment-656338728). Apparently the move to @use has not synced well with the old ways of using mixins, imports and placeholders?

The answer seems to be that you can't have a master file import a variables and expect them to be picked up by downstream files `@use`ed by that master file, instead you have to import them directly into the file you inted to use? I could have sworn that worked differently before? That isn't how it seems to work in my Jekyll site, perhaps there is a better way to do this?

[ ] Why is the logic around `@use` not working how I expect it to? Is there a better way?

Ok, I'm... not sure the styles are applying. Let's replicate a markdown block from my other site and see if it looks good.

```markdown
---
layout: page
---
```

It doesn't look good, but looking at the HTML markup... it looks like the problem is 11ty's processing and output of the actual markup.

:/

What does Jekyll use?

> Confusingly, GitHub Pages renders Markdown differently than GitHub does. GitHub uses its own Markdown processor; GitHub Pages uses jekyll-commonmark.

lol [thanks](https://www.markdownguide.org/tools/github-pages/).

Looks like [Markdown-It](https://www.npmjs.com/package/markdown-it) is [a popular choice](https://www.11ty.dev/docs/languages/markdown/) on 11ty to switch to commonmark.

Oh no, [it doesn't ship with syntax highlighting](https://www.npmjs.com/package/markdown-it#syntax-highlighting).

Ok, `highlight.js` is still not applying good tags. Is it an 11ty issue, or is it that I need to use Pygments, which is apparently the code syntax highlighting engine that Github Pages uses? Ok, how does that work in Node? There [is a package, let's read up](https://www.npmjs.com/package/pygments)!

I am concerned that it hasn't been update in 5 years. You know what? let's try https://highlightjs.org/ and see if I can force it to build better styles.

Oh no... white text on bright red background. This is a bad sign.

Ok, this looks like it actually should work ok though, what is going on? I'm going to add some `console.log` statements.

```javascript
	let options = {
		html: true,
		breaks: true,
		linkify: true,
		langPrefix: "language-",
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					console.log("Syntax highlight good", lang);
					return hljs.highlight(lang, str).value;
				} catch (__) {
					console.log("Syntax highlight fail", lang);
				}
			}

			return ""; // use external default escaping
		},
	};
	eleventyConfig.setLibrary("md", markdownIt(options));
	eleventyConfig.setLibrary("markdown", markdownIt(options));
```

Ok, they aren't triggering. No logging, this isn't working.

The eleventy website has good syntax highlighting. [How are they doing it](https://github.com/11ty/11ty-website/blob/master/.eleventy.js)?

Ok, there's a lot going on there and I need a break. Break time.

`git commit -am "Trying to get better syntax highlighting" `
