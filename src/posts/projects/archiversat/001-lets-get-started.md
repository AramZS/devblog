---
title: Let's write a client side ATProto tool for sharing Web Archives, if we can?
description: "Make archives decentralized"
date: 2026-04-20 20:59:43.10 -4
tags:
  - ATProto
  - ATmosphere
  - WARC
  - WARCs
  - BlueSky
  - decentralization
  - archives
  - archiving
  - WiP
---
## Project Scope and ToDos

1. Log in to ATProto
2. Post archives to a PDS.

- [ ] Remember my login.

## Day 1

So, I didn't have enough time to participate in the [SteamPlace VOD JAM](https://blog.stream.place/3micfu6ifyk2a/l-quote/6.0_0-6.0_124) but looking at it made me realize that you can put some sizable files on a PDS. Together with the shitty situation for web archives, it has me thinking: why not host your own archives on your own PDS?

Let's try some stuff with this project. [PNPM](https://pnpm.io/installation) and [the client-side ATProto setup](https://www.npmjs.com/package/@atproto/oauth-client-browser) to start. I'll start this one in typescript too. Let's also keep an eye on simple apps like [Flushes](https://github.com/atpota-to/flushes.app/tree/main) as a reference.

Gotta `brew install pnpm` and then off we go...

Since I particularly dislike dealing with oauth, I think now is a good time to run an experiment that I've been avoiding. Work is asking us to deal with AI code authoring more and more of my coworkers and my team are working with it. There's no way to really get a good handle on this without trying to use it. So, I'm going to try to experiment with using Copilot for this project.

I've asked it to use Vite, and a very simple non-SvelteKit Svelte site setup. I think this is important to avoid any situation where the code truly gets too far away from me while I'm working with so much new stuff.

A simple command is enough for it to set up a starter Svelte site, but that's no surprise, I could find a million demos of something like that.

I asked it to talk me through how to alter the HEAD-level metadata with Svelte, something I haven't done before (I've only barely played around with Svelte in the past). It was able to talk me through using `<svelte:head>` pretty well, with or without a script block like

```html
<script lang="ts">
  let section = "Home";
</script>

<svelte:head>
  <title>{section} — Archivers AT</title>
</svelte:head>
```

Next I want it to set up a request for oAuth with ATProto. I did some research and it is clear for a client-side-only application like this what I need to use is the [`"@atproto/oauth-client-browser"` package](https://www.npmjs.com/package/@atproto/oauth-client-browser). I also took a look at [the basic application Flushes](https://flushes.app/), which is fun and let me think about [a simple app and how to handle structuring it](https://github.com/atpota-to/flushes.app).

Providing some beginning file structure and suggestive filenames, I can ask the VS Code Copilot chat tool to set up a basic oauth flow. It takes some poking, but I am able to get this working!

There's not a lot of explicit documentation and I want to understand this flow better, so I've asked it for explicit inline documentation with:

> This needs more inline documentation. Can you start with App.svelte and add inline documentation for every custom named function?

I had to carefully ask it for docs for each individual file to avoid it drifting too far off task.

With all this set up, the next trick will be to get it doing more than just showing my DID. I need it to do stuff like remember my login and ask for more permissions to write to the PDS.
