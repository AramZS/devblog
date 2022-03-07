---
title: "Day 17: Digging deeper into Memento and Restructuring Async Operations"
description: "Am I doing the Memento API right?"
date: 2022-3-06 22:59:43.10 -4
tags:
  - Node
  - WiP
  - archiving
  - embeds
  - Memento
  - async
---

## Project Scope and ToDos

1. Take a link and turn it into an oEmbed/Open Graph style share card
2. Take a link and archive it in the most reliable way
3. When the link is a tweet, display the tweet but also the whole tweet thread.
4. When the link is a tweet, archive the tweets, and display them if the live ones are not available.
5. Capture any embedded retweets in the thread. Capture their thread if one exists
6. Capture any links in the Tweet
7. Create the process as an abstract function that returns the data in a savable way

- [x] Archive links on Archive.org and save the resulting archival links
- [x] Create link IDs that can be used to cache related content
- [ ] Integrate it into the site to be able to make context pages here.
- [ ] Check if a link is still available at build time and rebuild the block with links to an archived link
- [ ] Use v1 Twitter API to get Gifs and videos
- [ ] Pull Twitter images into 11ty archive.
- [ ] Add YouTube DL tool.
- [ ] Use https://github.com/oduwsdl/archivenow?

## Day 17

Ok, so I'm still pretty interested in looking at what I can do with static sites, WARCs and the Memento API. I see I may want to leverage [mock headers](https://stackoverflow.com/questions/14798589/github-pages-http-headers). I found [a sample timemap](http://web.archive.org/web/timemap/json/https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html).

That timemap looks like

```json
[
  [
    "urlkey",
    "timestamp",
    "original",
    "mimetype",
    "statuscode",
    "digest",
    "redirect",
    "robotflags",
    "length",
    "offset",
    "filename"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20201109180955",
    "http://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "text/html",
    "200",
    "S33ZE7G6463ELSCNFYXIYHYXFGHK5HGO",
    "-",
    "-",
    "10524",
    "7139989390",
    "archiveteam_urls_20201109191316_1b954904/urls_20201109191316_1b954904.1604536932.megawarc.warc.zst"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20210308195542",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "text/html",
    "200",
    "S33ZE7G6463ELSCNFYXIYHYXFGHK5HGO",
    "-",
    "-",
    "10353",
    "6333153645",
    "archiveteam_urls_20210309153400_0533dba8/urls_20210309153400_0533dba8.1606352862.megawarc.warc.zst"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20210414035818",
    "http://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "text/html",
    "200",
    "S33ZE7G6463ELSCNFYXIYHYXFGHK5HGO",
    "-",
    "-",
    "11973",
    "8278303",
    "CC-MAIN-2021-17-1618038076819.36-0025/CC-MAIN-20210414034544-20210414064544-00514.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220116021654",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "text/html",
    "200",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "12283",
    "579559352",
    "spn2-20220116023030/spn2-20220116004556-wwwb-spn19.us.archive.org-8002.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220206030455",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "warc/revisit",
    "-",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "916",
    "568112967",
    "spn2-20220206032300/spn2-20220206024053-wwwb-spn24.us.archive.org-8000.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220206185806",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "warc/revisit",
    "-",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "921",
    "812868693",
    "spn2-20220206190643/spn2-20220206182209-wwwb-spn24.us.archive.org-8001.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220206204948",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "warc/revisit",
    "-",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "912",
    "52062476",
    "spn2-20220206214458/spn2-20220206204436-wwwb-spn17.us.archive.org-8002.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220207004047",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "warc/revisit",
    "-",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "918",
    "166550557",
    "spn2-20220207012349/spn2-20220207003218-wwwb-spn17.us.archive.org-8001.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220212181146",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "warc/revisit",
    "-",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "919",
    "805489884",
    "spn2-20220212181059/spn2-20220212172701-wwwb-spn15.us.archive.org-8002.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220218011756",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "warc/revisit",
    "-",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "920",
    "364865488",
    "spn2-20220218015755/spn2-20220218004035-wwwb-spn23.us.archive.org-8000.warc.gz"
  ],
  [
    "io,github,aramzs)/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "20220221162143",
    "https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html",
    "warc/revisit",
    "-",
    "BA22HK45SJSQXS2I5CQUCPDKQJRKFWY4",
    "-",
    "-",
    "912",
    "116301727",
    "spn2-20220221163700/spn2-20220221161222-wwwb-spn07.us.archive.org-8001.warc.gz"
  ]
]
```

I'm not sure I'm any more interested in having multiple dates, but it is notable that this includes multiple formats. I think we need to figure out some better way to handle building these files, especially if I also want to generate WARCs or save more images locally.

Looking at the code I have now there's a lot of repetition and overlap and I'm wondering if I need a larger restructure to really support any complex operation. Yeah. Yeah I do.

Also, I'm still hoping for a way to use GitHub Actions to handle the archive process instead of running things locally.

Let's abstract some stuff into functions and see if we can use Promises differently here.

Also, I have a bunch of transformations being made to the incoming cache object from the contexter plugin, but in retrospect, I don't think that's the right approach. It will make it a lot harder to patch. These modifications should instead be happening when the data is added to the collection, if possible. Though there are some restrictions for the in-moment replacement process I guess. I'm not sure what is best to move actually now that I think about it. Let's try just getting the new async process working.

Hmm I'm not sure I can. Having to not have async in the compiler is really quite a problem.

Ok, well, I noticed that the local images for cards were not getting passed through and I attempted to get Twitter images working, but they really don't in the way I approached it.

That said, I think my actual Context objects are solid now? I think that the actual Contexter library (not the Eleventy plugin) is solid enough to push out to the NPM library, even if it isn't really out of beta. Let's do that now so that I can merge this working branch into my production blog.

Hmm... looks like there is already a `contexter` library on NPM so I'll name it something else. We'll be even more specific and call it `link-contexter`.

Ok, [that is set up](https://www.npmjs.com/package/link-contexter)!

I'm now able to merge this branch of my blog into production!
