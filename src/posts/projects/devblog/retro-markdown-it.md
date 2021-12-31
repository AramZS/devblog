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
featuredImageAlt: "Screenshot of the Markdown-It test page"
---

## Markdown-It - So Crunchy, So Useful, Such a Pain

I am going to be critical of Markdown-It here, so I want to put this up front: the community was helpful, I got fast feedback on an issue, once I figured it out it was hugely useful. If you've got time and a willingness to figure stuff out yourself and a whole bunch of patience to really explore the tool... well then I couldn't recommend it more. If all you want to do is zero-config your way to a basic Markdown to HTML pipeline, then this should be fine (along with a variety of other tools). But if you want to do some basic modification, like some text-to-fun-CSS or shortcode-style template tags in Markdown itself instead of in something like Eleventy or Nunjucks (this is [a thing I have definitely done](https://glitch.com/edit/#!/thespin?path=markdown-to-col.js%3A20%3A27)), then this likely isn't the Markdown renderer you're looking for.

And like... that's fine. That's totally cool. There's room in the world for more than one Markdown renderer. No one get mad. I'm not insulting any library here. Ok, onward.

### The Frustration

I think it is generous to say that Markdown It's documentation is unclear. [It's very sparse](https://markdown-it.github.io/markdown-it/) and everything about the project is difficult to navigate. At least it isn't misleading, which is good! But even the available in-project resources were difficult to find! The [Markdown-It demo page](https://markdown-it.github.io/) was *really* useful or at least it would have been if I had found it earlier than a month+ into this project. I'm not even totally sure how I got to it? I don't think it is linked on the project readme. Maybe I just went to the URL because I was curious what the site home page was, not expecting anything? It should really be at the top of their readme. Also, [their architecture doc](https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md) was hugely useful, but it was linked as plugin developer docs, so I almost didn't get to it.

The unclear documentation is especially difficult when paired with the standard problems of the Node ecosystem, which is a lot of badly maintained, no longer functioning, libraries. You can see me [wasting a lot of time on day 16 on the supposed Markdown-It Regex plugin](https://fightwithtools.dev/posts/projects/devblog/hello-day-16/). This isn't Markdown It's fault, but it almost put me off using the tool at all.

I already noted that this combination of bad package maintenance, too many blog posts, and misleading resources seems to be especially common in Node for reasons that are unclear to me. Increasingly I think I'm going to rely less on random blogs and plugins and more on just trying to figure out how libraries work by tweezing them apart thru use and logging and **then** maybe code reading (though good inline documentation is even more rare, even on otherwise good projects). I wish that wasn't the case, but I'm not sure what the alternatives are. One would think a more robust community would be an advantage, but it doesn't feel like it is in many mid-size projects' cases.

### Project Feel and Future Use

Now that I've bull-headed my way through learning Markdown It, I finally understand it. The decisions make sense. It's a smart project that is centered on a number of smart decisions that, while they might not be easy to find or initially figure out, all feel right. I understand now why the project is so popular, it's flexible, it's holistic, it's comprehensive. Like all the best libraries getting the hang of it feels like unlocking a super power.

It's likely that, for my future projects where I use Markdown, Markdown-It will be the project I'll use. There may be a few exceptions for extremely simple Markdown parsing, but I think I'll be continuing to use Markdown-It. It's a great tool.

### What I Learned (other than the code in my blog posts)

Working with Markdown-It was a great excuse to stretch my Regex legs and really try for some more complex patterns than I would usually deal with.

Other than that, and [what I learned about being more self-reliant when exploring libraries in the Sass project](https://fightwithtools.dev/posts/projects/devblog/retro-getting-back-to-sass/#what-i-learned-(other-than-the-code-in-my-blog-posts)), I think learning to use Markdown-It was a very code heavy experience. Which isn't at all a bad thing.

It was also great how responsive the project maintainers were. I don't think you can rely on that in every project, but in this case it was a great reminder that GitHub issues, if you follow the instructions and put together your example effectively, are a great place to ask questions and learn stuff, not just mark errors. I think phrasing it as "what's the best practice for using your code" is the right way to go, and an approach I might employ in the future.

Also, all things considered, I validated my approach of trying a new thing just for the sake of it being something different. I had no particular reason to stick with Markdown-It, but I'm glad I did.

### Self-check: Assumptions and Validations

#### Should I **prefer** Markdown-It for future projects?

- I went in with the assumption being no. I assumed this would be a one-off experiment where I'd return to using Showdown later.
- I did not validate this assumption. I will definitely use Markdown-It in the future.

#### Was Markdown-It effective?

- I did not go in with any particular assumptions, but early into the project I was highly frustrated and questioning Markdown It's effectiveness.
- Invalidated. Markdown-It is absolutely effective.

#### Does Markdown-It block collaboration?

- I went in assuming yes.
- This is a mixed bag. People familiar with the project already are out there and seem ready to collaborate, but I'm not sure I established enough information in my writing to make it easy for newcomers to enter my Markdown-It related code and understand what's going on.

#### Does Markdown-It Have Effective Documentation either External or Internal

- I went in with no idea, but feeling no.
- Validated. The documentation for Markdown-It just isn't there, either in the project or the community.

#### Will it be easy to maintain?

- I went in assuming no.
- I... think it will be? Markdown It's structures, once understood, are pretty straightforward, make use of very standardized code and objects, and seem to be very stable and built on well-thought-out architecture.

#### Did learning Markdown-It give me broadly applicable skills?

- I went in assuming no.
- I think the exercise with Regex was very useful, but I'm not sure the rest is. Markdown is a thing I use for personal projects, but not a thing I ever anticipate using for professional projects. While their Token structure makes a lot of sense, it doesn't have a lot of overlap with text/html processing engines I've used.

#### Working on this will allow me to give something back to the community

- I went in assuming no.
- Invalid. I have [contributed one plugin](https://www.npmjs.com/package/markdown-it-find-and-replace) and could easily see myself writing another. There's a lot of cool things Markdown-It can do that I think I could leverage in new ways that the existing community (while large) hasn't done yet.

### Conclusion

What an unexpected delight. After I got through the frustration of decoding how Markdown-It works, getting more advanced features up and running on my blog was just a lot of fun. I don't really know why I barreled forward on using Markdown-It, but I'm glad I did.

**Use of Markdown-It**: *Validated*
