---
title: Markdown It Find and Replace as Plugin
description: "More devblog"
project: Dev Blog
date: 2021-11-26 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - Markdown-It
  - NPM
  - Mocha
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
---

## Project Scope and ToDos

1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [x] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

<s>
- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).
</s>

- [x] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

<s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

</s>

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [x] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

<s>

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

</s>

- [x] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [x] Posts should be able to support a preview header image that can also be shown on post lists.

- [x] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [x] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [x] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [x] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [x] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [x] Social Icons

- [x] SEO/Social/JSON-LD HEAD data

## Day 40

Ok, so I want to make my pretty simple but very useful Markdown-it short phrase replacer into a stand alone NPM package that others can use.

I need to set up the project, add the package.json file, the .npmignore file, the README and the other chunks of the initial setup.

The other thing I need to do is set it up so that a developer can pass in the patterns and replacement rules. So no more using a function outside of the exported function. Instead I need to let others pull it in. I also want to add some test coverage. I've always used Jest for testing, but never Mocha, so [let's try doing that](https://mochajs.org/#installation)! I'll review the docs.

Good thing I wish they called out with more emphasis:

> Passing arrow functions (aka “lambdas”) to Mocha is discouraged. Lambdas lexically bind this and cannot access the Mocha context.

I want to start testing, but that will mean a devDependency for markdown-it. It also made me realize [I need to define a `peerDependencies` object](https://nodejs.org/es/blog/npm/peer-dependencies/).

```json
"peerDependencies": {
  "markdown-it": "*"
}
```

I want to test that the errors being thrown are working as expected, so [I'm going to grab `expect.js`](https://github.com/Automattic/expect.js).

Using that I need to initiate the function I want to dump and error into the `expect` statement. And I need it to explicitly match a regex pattern (feeding a string in apparently doesn't work).

Ok, this works!

```javascript
it("should not initiate without an array", function () {
	expect(() => mdProcessor(options).use(plugin, {})).to.throwException(
		/Markdown-It-Find-and-Replace requires that options\.replaceRules be an array\./
	);
});
```

Let's throw some more tests on there!

Ok, it works.

Oh, and in writing the tests I realized I don't have a setup for when it starts a sentence or token content or when it ends one! I can fix that tho with a few more regexs.

Ok, plugin looks good. Tests work. You know what's sort of strange, I've never created an NPM module that I've also published before. I guess this is the first time! [Let's go](https://docs.npmjs.com/creating-a-new-npm-user-account)!

I already have an NPM account I created earlier, so that part is easy.

I'll reformat my author property to match their requirements.

I tried pulling it into this project and it looks like it works, so I think the code is good to go.

`npm publish --access public`

Ok, that was easy!

I'll pull it in to this project and see if that version works.

And it does!

Awesome, made it into a module that hopefully some other people will find useful!

I'll add some documentation and update that and we're done! Very useful!

`git commit -am "Switching to use my newly published markdown-it plugin"`
