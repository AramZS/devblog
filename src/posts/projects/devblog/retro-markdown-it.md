---
title: Brute Forcing My Way Through Markdown-It
description: "I'm not sure why I decided to challenge myself with a different markdown parser than I usually use, but I'm glad I did."
date: 2021-12-30 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Retros
  - Markdown
  - Markdown-It
  - 30m
featuredImage: "markdown-it-test-page.png"
featuredImageCredit: "Screenshot"
featuredImageLink: "https://markdown-it.github.io/"
featuredImageAlt: "Screenshot of the Markdown It test page"
---

## Markdown It - So Crunchy, So Useful, Such a Pain

I am going to be critical of Markdown-It here, so I want to put this up front: the community was helpful, I got fast feedback on an issue, once I figured it out it was hugely useful. If you've got time and a willingness to figure stuff out yourself and a whole bunch of patience to really explore the tool... well then I couldn't recommend it more. If all you want to do is zero-config your way to a basic Markdown to HTML pipeline, then this should be fine (along with a variety of other tools). But if you want to do some basic modification, like some text-to-fun-CSS or shortcode-style template tags in Markdown itself instead of in something like Eleventy or Nunjucks (this is [a thing I have definitely done](https://glitch.com/edit/#!/thespin?path=markdown-to-col.js%3A20%3A27)), then this likely isn't the Markdown renderer you're looking for.

And like... that's fine. That's totally cool. There's room in the world for more than one Markdown renderer. No one get mad. I'm not insulting any library here. Ok, onward.

### The Frustration

I think it is generous to say that Markdown It's documentation is unclear. [It's very sparse](https://markdown-it.github.io/markdown-it/) and everything about the project is difficult to navigate. At least it isn't misleading, which is good! But even the available in-project resources were difficult to find! The [Markdown It demo page](https://markdown-it.github.io/) was *really* useful or at least it would have been if I had found it earlier than a month+ into this project. I'm not even totally sure how I got to it? I don't think it is linked on the project Read Me. Maybe I just went to the URL because I was curious what the site home page was, not expecting anything? It should really be at the top of their Read Me. Also, [their architecture doc](https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md) was hugely useful, but it was linked as plugin developer docs, so I almost didn't get to it.

The unclear documentation is especially difficult when paired with the standard problems of the Node ecosystem, which is a lot of badly maintained, no longer functioning, libraries. You can see me [wasting a lot of time on day 16 on the supposed Markdown It Regex plugin](https://fightwithtools.dev/posts/projects/devblog/hello-day-16/). This isn't Markdown It's fault, but it almost put me off using the tool at all.

I already noted that this combination of bad package maintenance, too many blog posts, and misleading resources seems to be especially common in Node for reasons that are unclear to me. Increasingly I think I'm going to rely less on random blogs and plugins and more on just trying to pull apart how libraries work by tweezing them apart through use and logging and then maybe code reading (though good inline documentation is even more rare, even on otherwise good projects). I wish that wasn't the case, but I'm not sure what the alternatives are. One would think a more robust community would be an advantage, but it doesn't feel like it is in many mid-size projects' cases.
