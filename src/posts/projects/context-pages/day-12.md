---
title: "Day 12: Building a block to show link data"
description: "I want to get the data set up in an HTML block a user can style"
date: 2022-2-05 22:59:43.10 -4
tags:
  - Node
  - WiP
  - archiving
  - embeds
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
- [ ] Create link IDs that can be used to cache related content
- [ ] Integrate it into the site to be able to make context pages here.
- [ ] Check if a link is still available at build time and rebuild the block with links to an archived link
- [ ] Use v1 Twitter API to get Gifs and videos

## Day 12

Ok, I want to make it easy to set archives for queries by any user. So that means a predictable ID based on the link text. Could we handle that with a one way hash? We'll leverage the built-in node cryptographic library and [use the most performant approach](https://medium.com/@chris_72272/what-is-the-fastest-node-js-hashing-algorithm-c15c1a0e164e). If we were handling passwords we wouldn't use `sha1` but to create a predictable ID it should be just fine.

I can't use base64 encoding, because that would generate a string with slashes in it, so I'll need to use the `hex` digest. That can give me a nice safe-for-filename structure like `943fae25db612f29a54dc9851ae87f46de959cad`. I can also cover it with tests to make sure the functionality works the way I expect.

`git commit -am "Create unique link IDs"`'

- [x] Create link IDs that can be used to cache related content

Ok, let's create a basic template for link listings. We can mark it up with useful metadata as well, starting with [h-entry](https://microformats.org/wiki/h-entry) and [including Schema.org](https://schema.org/CreativeWork). I'll start by building a basic version of the HTML I want to generate with all the markdown working correctly.

```html
<article id="link-card h-entry hentry" itemscope itemtype="https://schema.org/CreativeWork">
  <div class="thumbnail">
    <img src="" alt="" itemprop="image" />
  </div>
  <div>
    <header>
      <span class="p-name entry-title" itemprop="headline">
        <a href="" itemprop="url">A Tale Of Two Tags</a>
      </span>
    </header>
    <div class="p-author author">
      <span class="p-name" rel="author" itemprop="author">Chandra</span>
    </div>
    <time class="dt-published published" itemprop="datePublished" datetime="2012-06-20T08:34:46-07:00">June 20, 2012</time>
    <summary class="p-summary entry-summary" itemprop="abstract">
      <p>It was the best of visible tags, it was the alternative invisible tags.</p>
      <p>The a tag is perhaps the best of HTML, yet its corresponding invisible link tag has uses too.</p>
    </summary>
    <div itemprop="keywords">
      <span rel="category tag" class="p-category" itemprop="keywords">General</span>
    </div>
    <div>
      <a href="" itemprop="archivedAt">Archived</a>
      <a href="" itemprop="isBasedOn">Read</a>
    </div>
  </div>
</article>
```

Now let's break it down into components that are generated based on what data we get and then I can build them into the template.

At the point of the link-request module I'll want to get some backup values for image and description if I can. So I'll add some DOM walking properties to the object. I want to get the first Image SRC and that's easy enough to get, but notable that `jsdom` doesn't support `innerText` so I'll use `textContent` instead.

There are likely some other things that I could add to that `finalizedMeta` object to make it simpler to build the HTML I want.

`git commit -am "Add more data to finalized meta object"`

Ok, once I have everything passed into the template I want to test it using jsDom to make sure it has all the right stuff passed in.

`git commit -am "Set up creation of link block"`

I'm pretty much ready. I think it's good to take a look at the archive link which isn't really hooked in yet. I can check the request and...

Yup the GET request to the web archive returns the link that gets created by the request. Ok, I can include that in the object and yeah! This looks like it's good to go! Next step is to try integrating it into something.

`git commit -am "Hook in archive url."`
