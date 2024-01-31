---
title: "Aggregation, Amplification, and Archiving | Fellowship of the Link"
description: "What can neobooks tell us about a future robust eternal web?"
date: 2024-1-31 12:30:43.10 -5
tags:
  - archiving
  - Collaboration
  - Open Source
  - embeds
  - Fellowship of the Link
  - linking
  - transclusion
---

I've been meeting with the [Fellowship of the Link](https://www.fellowshipofthelink.org/) for a while now and a lot of what we've discussed has inspired some of the choices, considerations or directions I've gone on with my projects.

## Neobooks

We had a recent discussion on the 24th of January, 2024, where we discussed the idea of [neobooks](https://anagora.org/co-write-a-neobook) and the assembly of parts into whole publications that reminded me a lot of the [Proceedings of THATCamp](http://proceedings.thatcamp.org/about/index.html) project I worked on a while back. I think that leads me to think a little more about nuggets of data and content and how their assembly can be leveraged to their benefit and to create useful things. The idea of a book artifact at the end of the process is, I think, a good one. But, building on some of our previous discussions, I'm particularly interested in how these online neobooks, as artifacts of an aggregation process, provide other properties.

## Transclusion

We've talked a lot about the power of linking, [digital gardens](https://www.technologyreview.com/2020/09/03/1007716/digital-gardens-let-you-cultivate-your-own-little-bit-of-the-internet/), and more recently about approaches to transclusion, especially in [Obsidian](https://medium.com/workings/true-transclusion-in-obsidian-6d2e05235bd). Transclusion is, I think, an important element in this, especially depending on the variety of ways something might be considered transcluded.

Transclusion could be, mechanically, an iframe, a replica, something that looks like a more traditional reference or perhaps something like I do with archiving on [PressForward](https://pressforward.org/) sites and the [Context.Center](https://context.center).

## Amplification

On the web, depending on how we process it, there's an opportunity (and for me, a preference) for any composed or aggregated element to be both archive, and aggregation. There's even ways that can leverage structured data, using `[hasPart](https://schema.org/hasPart)` for the overall document and [`isPartOf`](https://schema.org/isPartOf) for nugget-documents to clearly link them all together. Once these different elements have clear links to each other, both through metadata and on-page linking, they naturally amplify each other. Crawlers will examine all parts and connect them to each other in a number of contexts, and the reinforcing links back and forth will raise the "link juice" of each part. Making sure that the parts note their relationship to the whole, and the whole to the parts, is a key part of this. I'd have to double check but, beyond using canonical tagging, we'd likely want to use the `sameAs` property to make sure that the area where the parts are assembled doesn't look like replication to any machines. Having prominent linking between the two that is human visible will also be helpful. We talked about webmentions for this and, though I have some misgivings at the implementation level, I agree that's the best way to automate this.

## The Eternal Web and Agility

Does crawling even matter is the obvious question. Some participants will almost certainly reject the primacy of Google (even if I believe it is unavoidable) and ask -- why bother? I think the answer here is that more entities crawl than Google. I have been thinking a lot about the question of what makes for a long-lasting web, what fights effectively not just against linkrot, but against corporate rot. We can't really depend on any system we don't own to last, but also we can't depend on our own systems to last. One day we die and the domains we use will stop getting paid for and the links will die. There has to be some hybrid between the two. I've been thinking about this as "The Eternal Web", a future state where what we put online can absolutely outlast us.

This has driven a lot of my movement towards static site generators; as well as the use of the [Internet Archive](https://archive.org) and [Webrecorder](https://webrecorder.io). Static sites and their content have an intrinsic portability that anything database driven lacks. I think a good indication of that is the cost of [100-year WordPress](https://wordpress.com/100-year/). It's a cool idea but the difficulty of maintaining and securing WordPress makes a long lasting iteration of a WordPress site a difficult proposition. I think we can take as an absolute: if it has to query a database to load the page, it will one day fail to work at all. But even when my domains fail, my sites will continue to be accessible through GitHub, along with all the information on it. When GitHub dies there is still the possibility that my sites can be maintained by interested parties without too much work. The sites are all static HTML and therefore inherently portable.

### Own Your Archive

This gets to the importance of agility in this process. The work of assembly has to be fast, quick, and detachable. The other guarantee for long lasting life for a website is when it is replicated. So we should have fast, paired, process of aggregation and archiving. The best way to really keep the web alive is not just to depend on the Internet Archive, which may one day fail, or be sued out of existence, but to make sure that everyone has their own copy of the parts of the web they think are important.

We often talk of the importance of owning your own platform, but I think it is equally important to own your own archive. As we look towards an increasingly unsure future, what we can guarantee of the web is the parts of it we keep near to us. I imagine a world where a layer lives between us and the wider web that requires less energy to access, less data to absorb and can easily be shared with those physically near us. This will also be a kind of amplification.

To reach this end, our approach has to be agile. Assembly of nuggets should include automatically the means of amplification and archiving. The goal should be to make this all quick, easy, and also easy to access purely locally, without a connection to anything but a local network. The best web is one that is massively replicated and this seems a clear path towards that practice.

## The Long Watch

[The Long Now](https://en.wikipedia.org/wiki/Long_Now_Foundation) project, with its tendency towards conservatism, it's bias towards corporate entities as reservoirs of knowledge and practice (even though every example we have shows that not to be a reliable approach) and it's insistence on a money basis makes its sustainability goals questionable, and the world they might create if they did succeed even more so. It will never be capable of creating a truly useful archive or system of civilization amplification because both require the type of aggregation that is inherently disruptive of the present systems of copyright and intellectual property in a way that its libertarian capitalist leanings forbid it from pursuing.

Instead of a top-down, hierarchical, corporate idea of preservation and future building, I think we need to consider a community approach, one highly decentralized that can also be worked with locally.

We should consider even more broadly than we have thus far: what does it mean to have a community-first web, a localized library archive of the things that matter, and how can we build it together. Where we need to go is towards a type of toolset that can let anyone stand watch over the web and preserve it, not just centrally, but for themselves and the people around them. But also one that can connect with any other such system, build links of replication and amplification, and provide a web that doesn't require any central authority to last forever.

**This is an early draft**
