---
title: "Investigating Generation Techniques part 2"
description: "Getting a start on a command line generator for an Eleventy site for PBTA games."
date: 2022-06-07 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - WiP
  - CLI
  - TTRPG
  - Yargs
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

## Day 3

Ok so let's take a look at the CLI arguments we can pull out.

`yargs(argv).argv` will return an object with `--command` and `--arguing=withyou` listed as object properties like:

```javascript
{
	command: true,
	arguing: 'withyou'
}
```

Next I want to use that to pass a base folder to start making my directories.

NPM `fs` has the tools and I can use `mkdirSync` here after I use `replace` to transform the path. But I don't have the rights. I need to `chown` the folder.

To do that I'll need to get the current user and their ID and group ID. Looks like the easiest way to do that is with the `os` package in Node.

```javascript
const { dirname, join } = require('path');
const { mkdirSync, existsSync, chownSync } = require('fs');
const { userInfo } = require('os');

const getUserId = () => {
	const userInfoObj = userInfo();
	return userInfoObj.uid
}

const getGroupId = () => {
	const userInfoObj = userInfo();
	return userInfoObj.gid
}

const createFolders = (folder, pathName) => {
	console.log('Create folders on base', folder)
	chownSync(folder, getUserId(), getGroupId());
```

I should be able to create the initial folder as a separate function though.

`git commit -am "Create the initial folder setup"`
