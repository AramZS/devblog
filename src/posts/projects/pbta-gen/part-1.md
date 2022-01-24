---
title: "Let's build a generator for Powered by Apocalypse Game Books"
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

## Day 1

Ok, so I want to be able to quickly generate sites that can host my ideas around Powered by the Apocalypse games. I have a bunch of fun ideas for doing focused small TTRPG games on top of the system and I'd like to be able to test if they work by quickly generating the framework of these games and then filling in what I want.

I think that the best way to handle this is to have a way to quickly set up Eleventy sites with the correct structure and base data. In the same way that Eleventy has a CLI command to set up sites, I would like to have a version of that which sets up stuff in the same way.

I'd also like to be able build out individual scenarios for these games within a folder.

I've never done a node-based CLI tool. So let's try and do that!

I'll take a look at Eleventy and how it works. I can [see the `cmd.js` entry poin](https://github.com/11ty/eleventy/blob/master/cmd.js)t but I'm not sure how it works. I think it's worth it to look a little more at general NPM CLI behavior.

First thing to know is that these are `npx` style commands. NPX commands come in at the folder level of the project. The structure it seems to enter through is the `package.json` file and the `bin` property:

```javascript
  "bin": {
    "pbtaGen": "./cmd.js"
  },
```

Ok now that it is working, I'll get to work on reading out the files.

`git commit -am "Starting file readout"`
