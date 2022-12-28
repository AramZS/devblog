---
title: Doing dangerous things with Raspberry Pi memory settings - Day 3
description: "Let's get a node project up and running"
date: 2022-12-26 22:59:43.10 -4
tags:
  - Node
  - Raspberry Pi
  - SSH
  - Linux
  - Development Tools
  - 11ty
  - WiP
---

## Project Scope and ToDos

1. Be able to host a server
2. Be able to build node projects
3. Be able to handle larger projects

- [ ] Be able to run continually

## Day 3

Problem still not resolved. I'm starting to think maybe a hack is needed to Eleventy to make it work. Let's fiddle!

I'm trying my own changes with `graceful-fs` but I want to [try the fix that is currently in a PR](https://github.com/11ty/eleventy/pull/2633). To do that I'll [need](https://stackoverflow.com/questions/8088795/installing-a-local-module-using-npm) [to](https://stackoverflow.com/questions/19094630/how-do-i-uninstall-a-package-installed-using-npm-link) [use](https://dev.to/erinbush/npm-linking-and-unlinking-2h1g) [`npm link`](https://docs.npmjs.com/cli/v9/commands/npm-link).

Hmm, I've got some good logging changes I did with `nano` on my Raspberry Pi. Let's get [setup with GitHub to commit some changes](https://github.com/cli/cli/blob/trunk/docs/install_linux.md) and [set](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key) [up](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key) [GPG](https://homepages.inf.ed.ac.uk/da/id/gpg-howto.shtml).

Noting that the command I needed to key my key ID for use here is `gpg --list-keys --with-colons --with-fingerprint` with the ID being the first long sequence on the `pub` line. (I can copy one over with `scp` although I ended up just genning a new one for that machine.)

Also need to setup and add an [SSH Key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).
