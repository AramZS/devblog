---
title: Context Center Timelines - Day 1
description: "Setting up context-rich timelines"
date: 2022-05-13 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - Context
  - WiP
---

## Project Scope and ToDos

1. Create timeline pages where one can see the whole timeline of a particular event
2. Give timeline items type or category icons so that you can easily scan what is happening.
3. Allow the user to enter the timeline at any individually sharable link of an event and seamlessly scroll up and down

- [ ] Deliver timelines as a plugin that can be extended by other 11ty users
- [ ] Auto-create social-media-ready screenshots of a timeline item
- [ ] Integrate with Contexter to have context-full link cards in the timeline
- [ ] Leverage the Live Blog format of Schema dot org
- [ ] Allow each entry to be its own Markdown file
- [ ] Handle SASS instead of CSS

## Setting up a Timeline Plugin?

Ok, so I really love the work that [Molly White](http://www.mollywhite.net) has put in to create timelines in their work. Molly has created a great starting point in [an open-source 11ty-based timeline project](https://github.com/molly/static-timeline-generator) and then [a much more advanced timeline for their coverage of "web3" that is also open-source](https://github.com/molly/web3-is-going-great).

So, I decided to set up a version for myself. I want to build multiple timelines within my context-center site so I set up [a branch to try and set up a way to do that](https://github.com/AramZS/context-center/tree/timeline). My hope is that not only can I set it up for multiple timelines within my own site, but I can also set it up within a plugin that other people (and future sites of mine) can use easily. I haven't really seen templates packaged up this way so this feels like unexplored ground. I think it might be possible, but maybe not! I guess we'll find out.

So first I want to port over Molly's basic timeline work, this gives me a good starting point and lets me avoid the fact that I'm bad at design. I'll set up a timeline plugin and start moving it over. I don't want to deal with trying to do Sass builds inside the plugin so I'll also try to move her Sass work into standard CSS for now.

I've set up a basic plugin structure to start me off and contain the work.

I'll start with the variables.

`git commit -am "Set up first folder and start porting CSS"`
