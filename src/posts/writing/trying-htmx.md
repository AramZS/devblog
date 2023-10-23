---
title: "Trying HTMX"
description: "Doing some testing around trying out HTMX for other projects."
date: 2023-10-21 15:30:43.10 -5
tags:
  - Code
  - HTMX
  - trying
featuredImage: "htmx-preview.png"
featuredImageAlt: "HTMX website"
---

## What is HTMX?

From it's [website](https://htmx.org/):

> htmx gives you access to AJAX, CSS Transitions, WebSockets and Server Sent Events directly in HTML, using attributes, so you can build modern user interfaces with the simplicity and power of hypertext

## Why HTMX?

It has been recommended to me a few times and I'm pretty interested in what appears to be a pretty simple way to do single-page-app style behavior without a ton of complex and overly heavy javasscript.

## Step one: the basics

I'm going to [use Glitch to set up a basic HTMX website](https://htmx-preview-one.glitch.me/) where I can play around with some of the core concepts, the ability to swap out content, and gain a better understanding of how to work HTMX.

As I'd hoped, it's pretty straightforward. I can identify basic things to swap, events that cause swapping and even elements that I can replace in response to the swap to allow one page to provide updates to different areas of the page separately.

`hx-get`, `hx-swap`, and `hx-swap-oob` all seem to work really clearly and as expected.

`hx-get` creates a GET request to a URL (relative to the site domain, not the local path, as far as I've been able to tell thus far.) and swaps in the retrieved HTML with the current element (the method can also be `hx-post`). It can instructed how it swaps in the content wtih `hx-swap` and `hx-swap-oob`.

This is pretty cool, and is promising for some things I want to try out.

## Step two: media navigation

One of the key things I want to accomplish is to be able to navigate around a site while a piece of media stays in place and can play uninterrupted. Let's try that.

First I'll set up some basic navigation tests. Good to note that `hx-push-url` is relative to the core domain, not the local path. So if you're on `/test` and you want to go to `/test/2` you need to use `hx-push-url="/test/2"` not `hx-push-url="/2"`. It also looks like it automatically picks up the `<title></title>` tag. I wonder if it picks up everything else that can be in there? I'll have to test it out.

Ok, it requires some hacking on to the process, you have to essentially create a space outside the elements changed by HTMX and then modify it depending on pulling in particular script tags. But it does work! This seems to be the way to go. The other thing I'll have to do is figure out how to queue up separate videos / audio tags  and then swap them in on complete for each video / audio file. It seems like this is the way to go though! I think I can do one more test, to try to make the player queue more complex. If I can do that, and also make it so playing media goes *into* the preserved element from elsewhere on the page, then this will be my solve for a bunch of projects I'd like to try out.

## Step three: multi-play

I think I can make it a better organized multi-play system with a custom HTML element. Let's [remind](https://web.dev/articles/custom-elements-v1) [ourselves](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) of how that works.

I can even use the custom element mount events to inform the page it is ready to receive a playlist item and back it with a timeout if needed. Then I can push stuff to the playlist element and it will have an array to work through.

I'll also have to check the iframe for YouTube's status. Here's [one way to do so](https://stackoverflow.com/questions/7853904/how-to-detect-when-a-youtube-video-finishes-playing) and a [reference](https://developers.google.com/youtube/iframe_api_reference). That'll be the next step. However, so testing around how I can add things in seems to indicate it can work. Just placing a script tag in an HTMX loaded element that does the work of pushing into a playlist seems like it can do the trick. I think I'll base it on user action in the actual sites I'm working on though.
