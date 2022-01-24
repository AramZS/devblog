---
title: "Investigating Generation Techniques"
description: "Getting a start on a command line generator for an Eleventy site for PBTA games."
date: 2021-11-30 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - CLI
  - TTRPG
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
---

## Project Scope and ToDos

1. Be able to use a CLI command to generate the framework for a Powered by the Apocalypse Game Book
2. Be able to copy a file list and folder structure into a new file list and folder structure.
3. Activate the generated folders and files as an Eleventy site.
4. Generate a scenario within an existing project using a CLI command.

- [ ] Be able to generate the book as an EPUB

## Day 2

So last time I was able to get a command in the project to run with the CLI command `npx ./` in the project which triggers the file listed in the `package.json` file at

```javascript
  "bin": {
    "pbtaGen": "./cmd.js"
  },
```

I want to set up the basics of an Eleventy site in here as well. Basically setting up an empty version of the site.

First I'm going to reconfigure this file structure to make it clearer what is going on in the repo.

`git commit -am "Reconfigure file positions to make it easier to build and give this project a clearer structure."`

I'm also set up a generated-site `package.json` prep with a `package.js` file to pull from.

I now want to be able to test my own project by using the markdown templates folder to generate the initial files I'll have for spawning the starter site, so that means having more than one command I can trigger by passing an argument to the CLI command.

Ok, there [is an NPM package that might make this easy](https://blog.logrocket.com/creating-a-cli-tool-with-node-js/), called [commander](https://www.npmjs.com/package/commander). But that seems to be a bit more than I might need.

It looks [like my package can have more than one command](https://blog.bitsrc.io/how-to-build-a-command-line-cli-tool-in-nodejs-b8072b291f81), which is a good place to start, but I also need to pass arguments to it. It looks like there might [be a package for that](https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs).

It looks like I can capture any CLI arguments using `process.argv`. NPM module [`yargs` can parse it](https://www.npmjs.com/package/yargs). [Eleventy appears to use a argv parser called `minimist`](https://www.npmjs.com/package/minimist).

Though I could do some basic parsing myself too, without having to rely on another package?

```javascript
process.argv.filter((arg) => { return !!arg.match(/--/) })
```

I'd have to check what advantages they bring and if they're worth it.

Ok, useful! I think the next step is to generate a basic site and we'll see how it works from there. I can then build more of the basic files in there and see how they work with the render process.

I'll need to walk the folders and then get all the files from inside. [This function looks good](https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search).

Ok, got it working. Didn't realize that the `/g` applied over multiple checks for a regex object and I had to remove it, but figured it out.

`git commit -am "Set up file set walk"`
