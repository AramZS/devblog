---
title: "Play to Find Out: On Showing Your (Code) Work"
description: "You can't learn without exploring. Working in the open, while scary, makes for easy collaboration, better results."
date: 2022-1-3 22:59:43.10 -4
tags:
  - 11ty
  - Collaboration
  - Open Source
featuredImage: "play-to-find-out.png"
featuredImageAlt: "White text on black background: Play to Find Out"
---

## How do you solve a problem of unseen-code?

I've [been thinking a lot about how to get better at code when it's in my own side projects](https://twitter.com/Chronotope/status/1390700217838841860). I do these side projects pretty much in isolation. Maybe sometimes I get a comment or, if I tweet about it enough and it's relevant, it might get rolled into some blog post. When that happens it's great! But it doesn't really give me feedback on my work or the quality of it. Without feedback it's hard to improve.

Now, don't get me wrong, I do these projects for myself. I do them because I want to find something out and I need a tool to do it. I do them to learn new things because learning is fun. I do them because I want to create something cool that lets me play in code. These are all core to why I even bother with side projects.

I have a good employer who lets me build in time to do research when I need to learn something professionally and so while learning is an important aspect of working on my code side projects it isn't the core target outcome. But **still**, I don't want to stagnate in these side projects. I want them to get better, I want them to make me better, I want to make *the projects* better, and I want to advance my skills while working them.

At work, when I am putting code together, I get opportunities to talk over ideas, plan architecture, and then of course I get feedback on my approach and technique in pull requests. Sometimes, as we all know, PRs can be frustrating, because I thought I was done or I can disagree with the specifics of an approach, but I always learn something, even if it is just another way to approach how to write code.

This process makes better coders. It makes me a better coder. Exponentially so. I badly miss it when it comes to side projects, but there doesn't really seem to be any formal structures around how to make getting feedback part of the casual coding projects. So I thought about this for a while.

Then three things happened.

### Play To Find Out

One: I started to play more Powered by the Apocalypse (PbtA) Tabletop games. Then I started to write Powered by the Apocalypse games. Then I started to write rulesets for Powered by the Apocalypse games. Which meant reading a lot of other people's PbtA games. I saw and came to appreciate one of the core rules for all Powered by the Apocalypse games is "[Play to Find Out](https://twitter.com/lumpleygames/status/1152247889885876224)".

Play to find Out is deceptively simple, it means that you don't pre-decide the outcomes. It means that games don't go off the rails because they don't have the rails. You have a general endpoint in mind... maybe... but the more important thing is to not be a game "master" in the way D&D games are run, but to be a facilitator. It's to let go of the style of absolute control and realize that sometimes decisions come from outside and are driven by accident and play as much as they are by starting intention.

This was the first idea to build on because it meant that I started thinking about these side projects less as projects that leveraged things I knew and more as opportunities to explore the ecosystems and communities of the projects I built on top of, and potentially contribute back to them. I wasn't just going to go with my favorite tool, or what I wanted to learn, I was also going to go with the flow to some extent, [even if it meant trying a library I neither needed to learn or would get any particular job-relevant knowledge from](https://fightwithtools.dev/posts/projects/devblog/retro-markdown-it/).

I know it seems strange to say this, but this sort of thinking led me towards moving more with the flow of the project and the libraries I used and treating this side project less as an outcome or desired product and more of an exploration. This has led me down some weird roads on this project, but I think has made the process more sustainable and fun.

### Math and Showing Your Work

Two: I started to get more into math. I know that there is generally an expectation that people who work with code are generally "math-y" (for lack of a better term). But that was never my path. I wasn't particularly engaged (and therefore not particularly good) with math in high school or college. I never enjoyed it or could focus on it. However, I've been encountering more complex math and math concepts through my work with the W3C.

I discovered that math was fun to read about and more importantly fun to play with conceptually. This is something I've been doing more. I think there's this image painted as an outcome of learning math in depth of the Math Expert standing at a chalk board working through equations. But I'm starting to think that's not the outcome, but the path. To learn and refine our practice we play towards an outcome with sketching system architecture, or play towards an outcome with pseudo code, both at a whiteboard. Learning Math isn't about getting to the point where you can stand at a white board and do equations, it's about the process of learning through playing at the white board *with* equations.

The problems of my math education feel like they came out of a solutionism approach. So many of the problems that I've had trying to figure stuff out with code stem from same frustrations I had as a kid with math, that there is only one methodology, only one solution, only one way, and I just have to find it like digging up an artifact. But solutionism isn't just a problem in how I learned math, [solutionism is a fundamentally tech problem](https://www.macmillandictionary.com/us/buzzword/entries/solutionism.html). By approaching these problems as problems with ready-made solutions to dig out I cut out collaboration from my work, I block out other viewpoints unlike mine, and I remove the fun from the process of building these side projects, all the exact opposite of what I want to do.

When I learned math, we always had to "show our work". But showing our work wasn't really the point of my math education. "Showing your work" was code for "prove you didn't cheat" and it wasn't about exploring the problem... it was about showing you could recite back the rote methodology. It was an approach that enforced the opposite of what showing your work should be about in that it was trying to enforce the concept that there was only *one* solution to any math problem. In this model it was a field without **play**, it was something to be whipped into you.

No wonder Americans resisted so hard when math educators proclaimed that there might be more than one way to Do Math and that they were going to teach the other way with Common Core. The math education I, and I suspect most other received, was specifically designed to enforce that not only was there only one solution, but there was only one way to get to it. Learning some other approach to math hit a wall that had little to do with pedagogy and everything to do with a dogma that the education system had handed down in math classrooms for decades.

So from this realization, that my math education was injured by a lack of play, I realized that what I needed for my side projects was to spend significantly more time showing my work than showing the resulting product. If I was going to be able to keep track of projects and enjoy my time on them, they had to be a vehicle for play, and the way you play with code is by working through it, sometimes down the wrong path, sometimes down an unexpected one.

### Streaming Code

Three: Then I saw someone who had really encoded the first two realizations I had into their programming process and turned it into not just a way to work but a **resource**. [This very cool thing that Paul Frazee is doing with his work](https://twitter.com/pfrazee/status/1371174362531962880) where he live streams himself coding, working on his project. He talks through what he's doing and the decisions he's making, and opens himself up to feedback from a live and later reviewing audience. This is very much like the writing-circle-style coding approach that I want to create. Even better, it becomes a permanent resource about his work that others can look to through his [dev-vlog](https://ctzn.network/dev-vlog) which links commits he's made during live streams to the actual video where he's making those commits.

I think that, in some regards, streaming oneself doing code is terrifying. It means admitting that you have to look things up, that you don't know everything and that maybe your code isn't always the best. It also means opening yourself up to a community of feedback, for better or worse.

I think my main hesitation with opening up my workflow like this is I worried that process is less interesting, even when I'm just thinking through an approach. I was disabused of this notion [when I watched Helen 侯-Sandí do her bug scrub live streams as part of the WordPress development workflow](https://twitter.com/helenhousandi/status/1306277814551928832). Being at work is interesting, regardless of the work, to those of us who do that type of work.

## Principles of the Dev Blog

So taking these inspirations I decided that what I really needed was a dev blog... heavy on the **log** part.

I could have done a video stream, like a number of other people do. Clearly there [are](https://www.youtube.com/channel/UCSkcL4my2wgDRFvjQOJzrlg) [some](https://www.twitch.tv/williamchyr) [great](https://www.twitch.tv/mvandevander) [examples](https://www.twitch.tv/devwars/videos) out there. But I don't think that model fits for me. I don't code regularly. This is a fun thing to do in my free time and I don't want to make a schedule for it in the way that live streaming seems to require. Also, sometimes I think up something at lunch and jot a note about it and some code down, or I do very little one day, or spread it out over multiple small sessions. My approach for the projects I want to document just doesn't seem to be the right one for live streaming.

It's less of a resource that way too, at least when it isn't attached to a specific project. I want this to be as much reference as a log. Part of the goal here is to create stuff posts that are useful to people. Even if maybe I need to de-index things via robots.txt with some regularity.

So instead, a written blog, which lets me exercise my writing too, which is another practice I enjoy but don't spend enough time doing.

I decided it needs principles

- Commit often: better to save a reasonable mistake then forget it and repeat it.
- Work in the open: with errors and frustration on display.
- Play to learn: work through the problems instead of around them, even if it means sticking with a library that might frustrate me. Define scope but don't define every detail of the end product.
- Document the mistakes.
- Always take the opportunity to contribute: so that means building plugins, making PRs, leaving Issues and taking feedback in my own issues or PRs. Engage in the communities around the code I use even if it means slowing down and breaking from working on a project.
- Work towards readability: The goal should always be to make my work readable in both log and code formats and to make that readability clearer through things like leaving logging in the comments so others can reuse my shown work as much as the end product.
- Write messy, clean another day: Logs should be raw first, and edited and cleaned up on a later date.

And I decided I needed to make [the first project this blog documented the making of the blog itself](https://fightwithtools.dev/projects/devblog/).

So that's what this is about, trying to code but without a solutionism bent, instead with a mind to show my work, to show that this is a process, and not always an easy one. That this type of work is better done with a community, open to input, and out in the open. That I might **fight with my tools** but that's part of the process. Hopefully by opening up that process, I can help others.

Also, I'm just a big [Flobots fan](https://open.spotify.com/album/2mSCSmEjNdJUic3fcqse57?si=8GiAlR9XT2aD1mK54NLQ3Q).
