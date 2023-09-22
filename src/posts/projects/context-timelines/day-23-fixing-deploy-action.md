---
title: Context Center Timelines - Day 23 - Fix Context Center Deploy action
description: "Let's try the timeline plugin using a new site."
date: 2023-09-22 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - GitHub Actions
  - SSG
  - WiP
---

## Project Scope and ToDos

1. Create timeline pages where one can see the whole timeline of a particular event
2. Give timeline items type or category icons so that you can easily scan what is happening.
3. Allow the user to enter the timeline at any individually sharable link of an event and seamlessly scroll up and down

- [ ] Deliver timelines as a plugin that can be extended by other 11ty users
- [x] Auto-create social-media-ready screenshots of a timeline item
- [x] Integrate with Contexter to have context-full link cards in the timeline
- [ ] Leverage the Live Blog format of Schema dot org
- [x] Allow each entry to be its own Markdown file
- [ ] Handle SASS instead of CSS
- [ ] Fast Scroller by Month and Year
- [ ] Add timelines and individual timeline items to the sitemap
- [ ] Generate images more efficiently.
- [ ] Support a counter that can increment depending on where you are on the timeline.
- [ ] Generate QR codes / Stickers for each timeline
- [ ] /raw/md returns a raw version of a topic (in markdown)
- [ ] /raw/md includes a YAML header with relevant information
- [ ] /raw/json returns a JSON version of a topic
- [ ] /feed/ returns a latest links feed of a topic
- [ ] RSS feed of links
- [ ] RSS feed of new links per topic / timeline
- [ ] Support a header image.

## Day 23

I had my site stop deploying. It looked like some problem having to do with my deploy action and when I went for support to [the repo for the action](https://github.com/peaceiris/actions-gh-pages) I was using it sent me to [GitHub Actions](https://github.blog/2022-08-10-github-pages-now-uses-actions-by-default/).

I read it, seems straighforward, looked at the [examples](https://github.com/actions/starter-workflows/tree/main/pages). There isn't one for Eleventy, so I decided to stitch together the [Next](https://github.com/actions/starter-workflows/blob/main/pages/nextjs.yml) and [Static](https://github.com/actions/starter-workflows/blob/main/pages/static.yml) workflows. Still didn't quite work.

I ended up pulling together a few of the actions as anticipated, but also having to update some packages and fiddle around with the process. A big tripping point was that, for some reason, I needed to make the deploy step (with the deploy action) a separate job. I'm not sure why.

Even then it didn't work. But it did tell me that I could only deploy from the `gh-pages` branch. Ok, weird.

Well, it turned out I had one last step to take. I had to tell GitHub to use Actions instead of deploying from the branch by going to Settings > Pages and finding the Source pulldown and changing it to "GitHub Actions". Once I did that the build worked! Deployment worked! I could even, at last, delete the old `gh-pages` branch. Everything is working and deploying now .

[Check out the new workflow!](https://github.com/AramZS/context-center/commit/80fbcc073e1131b0a3d9f785eba8bbba4e6b0857)

https://github.com/AramZS/context-center/blob/main/.github/workflows/eleventy_build.yml
