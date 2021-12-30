---
title: Getting back to SASS
description: "Setting this devblog up ran me through a Sass refresher course, and presented an opportunity. But I'm not sure it was worth it"
date: 2021-12-28 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Retros
  - Sass
  - SCSS
  - 30m
featuredImage: "sass-logo.png"
featuredImageCredit: "Sass project logo is in the public domain."
featuredImageLink: "https://en.wikipedia.org/wiki/Sass_(stylesheet_language)"
featuredImageAlt: "Sass project logo."
---

## Back Into Sass

I've dipped my toe in and out of Sass many times over the years. This, though, is the most I've focused on it in a while.

### Rebuilding my build process from scratch

I think it was pretty wild to basically have to re-figure-out what is essentially a CSS build process from scratch with the end of Node Sass. It was a real slow down. Also, hardly the first time I have had to do that for a Sass project. It feels like I've had to rebuild my Sass build process every time I've worked on it. I'm also not sure when the split between SCSS and SASS formats happened? Perhaps it has always been there and I've just forgotten... or my build tools took care of it for me? It was easy enough to change grooves, but weird.

On the flip side, Dart Sass in Node seems to be significantly simpler than its predecessor. I will give it this: it is definitely an improvement. Once I was able to struggle through the meager documentation and log my way towards how it functioned I was able to get it working well enough and able to do some flexible things with it. Obviously, once I got the hang of it I was able to really get it working for me; well enough that I was able to write an Eleventy plugin based on my code and approach. It works so well and is so much clearer to me code-wise than the Node Sass alternative I was even ready to [submit it](https://github.com/11ty/11ty-website/pull/1257#pullrequestreview-841555379) to the [Eleventy plugin directory](https://www.11ty.dev/docs/plugins/).

### Leveraging best practices

I don't know if I used Sass as well as I could. I'd hoped to find some way to do intelligent code splitting, but the build process Dart Sass has doesn't interact with 11ty in a way I could see that happening automatically, and so I ended up doing it manually. I also am not sure I fully took advantage of Sass features. I could likely do something better in regards to variables, mixins, etc... but having built my CSS by hand on my last few projects, I think it likely would have been simpler to have done that for this project and maybe stitch the files together for ease of managing my rules.

There's just a lot of advanced CSS features that are native now. Features like `calc`, CSS variables, and the ever growing list of nifty pseudo-selectors seems to make **unnecessary** much of the stuff I once relied on Sass to do.

### Project feel and future use

Compounding the issue, it doesn't feel like the Sass project is especially stable these days. It was extremely disconcerting to discover that one of their main rendering functions had apparently been marked for depreciation over the course of this project (about 10 minor versions in half a year). Especially considering that this switch to a new function didn't maintain the interface of the previous function which, as far as I can see, is one which most Sass projects would have used. Worse, the transition didn't seem to be clearly documented.

Perhaps this is all just a result of my distance from Sass over the last few years, where I was either ending up using hand-cranked CSS or I was going to go the CSS-in-JS route. But it doesn't feel that way. My last Sass project was in June of last year. It really makes me doubt if I should go the Sass route in the future. With Eleventy especially I feel like I could likely find or build a CSS compression + source map process that would be just as effective performance-wise and easier to use. It might be worth it to try, or to look into one of the fancy frameworks like [Tailwind](https://tailwindcss.com/) or a CSS-in-JS [process](https://lit.dev/) that doesn't feel gross and renders out to one or more stylesheets (though those seem to be hard to find).

### What I Learned (other than the code in my blog posts)

I think one of the major things I learned working on the Sass part of this project is how *bad* the reliance on the community to provide documentation is. In trying to get this to work I encountered:

- a ton of malfunctioning code examples;
- a plugin that looks like it should work, was only 10 months old, but is completely non functional;
- a full on [documentation error in the core Dart Sass library](https://fightwithtools.dev/posts/projects/devblog/hello-day-2/);
- some misleading blog posts with bad, old or just wrong info;
- a major depreciation mid-project;

None of this makes me feel great about reusing Sass but also I think it highlights a major realization:

A lot of these modern projects like Sass provide [really](https://twitter.com/Chronotope/status/1472118035205042178) [bare](https://twitter.com/Chronotope/status/1374369144100024322) [minimum](https://twitter.com/Chronotope/status/1419441920951169027) documentation. I think they rely on the community to write about their libraries and then have those show up in search. And a lot of them do have communities that **do** write about their use of the code libraries and how to do interesting stuff with them but...

**All that is pointless if you change your library so frequently and radically as to invalidate community-generated materials.**

This isn't just a Sass problem, it seems to be a major issue I've seen a lot ever since React started becoming popular. I don't know why this is the case, maybe it comes from some mother projects, maybe it's just a Node community tendency? I'm not sure what it is but it *is* annoying.

It means that there are a ton of well-meaning developer bloggers (like myself now!) who write posts that are "this is how to do x" without a lot of information about why, or how they navigated the library to figure out how to do X, or how others might learn for themselves. Without better docs in the actual library site the end result is that picking up any of these packages new is made *harder* when there are more people blogging about the library because it is so easy to burn time on frustrating dead ends. I think I'll do a Markdown It retro as well, but a notable overlap is that the period I gave myself to work on it without referring to developer blogs or Stack Exchange was the time I was most productive in unlocking the library's value. There are just too many out-of-date blogs and false leads. The best source material ends up being Github Issues, which at least are easy to search and sort by date.

The two main things I took away from this to apply to my own projects are:

I should apply extensive documentation and examples in the core project documentation. It's nice when your project is popular enough that people start writing about it, but it's a mistake to act in a way that assumes those resource exist or are kept up to date. Sadly, blog posts don't have a filter that checks them for forward compatibility. Instead, I need to keep documentation for my own projects verbose, up to date, and explanatory.

The second take away is for how I blog here on this and future projects. I endeavored here not just to document what I did but also how I figured it out; what bad processes and incorrect assumptions I made; and how I taught myself the correct way forward. I think that for this type of blog that information is far more useful than a bunch of minimally documented code samples of "How to do X". Even when the code itself might no longer be usable because of library changes my process will hopefully still be useful to future developers.

### Self-check: Assumptions and Validations

#### Should I **prefer** Sass for future projects?

- I went in with the assumption being yes. I made a beeline for Sass both because of preference and experience.
- I did not validate this assumption. I should not start future projects with the assumption that Sass is the best tool for the job.

#### Was Sass effective?

- I went in assuming yes.
-  Validated. It was effective. It was easy to build with, I was able to fly with it once I learned how. I **can** use it for projects like this. I don't know if it saved me time, but it didn't feel like it took up a ton of extra time.

#### Does Sass block collaboration?

- I went in assuming no.
- Validated. It was easy to form Site Maps once I nosed out a few errors. I think it creates easy to read code on both site maps and Github. It's hard to be final on this without hearing from others, but I think it worked out.


#### Sass is a broad project with good documentation either on it's site or through self-documentation

- I went in assuming yes.
- Invalidated. See above. But also it turned out that getting a good VS Code plugin *significantly* helped the process.

#### Sass will be easy to maintain

- I went in assuming yes.
- Unclear. I stumbled on errors in the docs, at least two cases of depreciation, and one feature that was marked as for future use only. Major changes in Sass meant I basically had to starting over for everything but writing the style rules themselves. We'll have to see if the project gets leveled out, but for now it worries me for something like this where I want to do minimal maintenance of the project's core code.

#### Did learning Sass give me broadly applicable skills that I could use elsewhere?

- I went in assuming yes.
- Unclear. One of the major things I noticed looking up CSS info was that people seem to be frequently moving to Tailwind or CSS-in-JS techniques. I'm not sure I appreciate either from an abstract or best practices perspective, but it doesn't speak to Sass skills being broadly applicable. Maybe I'll see a lot of users on the plugin I built and come back to this and say that the answer is yes later.


#### Sass will help me do smart code splitting

- I went in assuming yes.
- Invalid. It really didn't. I had to build that functionality on top entirely myself.

#### Working on this will allow me to give something back to the community

- I went in assuming no.
- Invalid. It turned out that Eleventy's Sass plugin, though not even a year old, wasn't really working anymore. I built a new one. Maybe people will use it? It turned out that there were big things I needed to learn myself and ways I could take what I learned and make it broadly applicable. If everything else had been bad, this would have made using Sass worth it all on its own. It's good to give back.

### Conclusion

Using Sass more may not be in my future, but I think it was a worthwhile process to go through for this project. At some future point I may switch the relatively simple CSS I'm maintaining for this project to just plain CSS files, but right now I think it'll be good to keep iterating using Sass. There are clearly others who want to use it. Continuing to have it in this project will help me maintain my plugin and help the wider community.

**Use of Sass**: *Validated*
