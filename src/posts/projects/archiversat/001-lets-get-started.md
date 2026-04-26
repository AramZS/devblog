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

`git commit -am "Attempting additional scope requests with ID metadata"`

### Prompt Log:

- Set up to render a very basic page here
- swap this flow that uses index.html to a version of the site that renders with tsx files.
- Wait, instead of using React, can we use svelte?
- Why is this using index.html at the base of the project instead of in the app folder?
	- Educational response was:

> That's a Vite convention. Unlike most bundlers, Vite treats index.html as the application entry point and serves it from the project root. It needs to be there so Vite can:
>
> 1. Resolve the `<script src="/src/app/main.ts">` path relative to the project root.
> 2. Serve it directly at http://localhost:5173/ during dev without any redirect.
> 3. Use it as the build entry during vite build.
>
> You can move it into a subfolder by setting root in vite.config.ts, but the default and most common Vite setup keeps index.html at the project root. It's intentional, not an oversight.

- How do I allow the page to set the parent's `<title>` tag?
- This needs more inline documentation. Can you start with App.svelte and add inline documentation for every custom named function?
- Great, now do the same for the Login.svelte file.
- I want this oauth to add some additional permission scopes, specifically the ability to write to the user's repo, writing posts, and uploading blobs.
- Please output the CLI result regardless of if it failed. Now rerun the rg command.
	- At this time I realized it was trying to use `rg` to search for text in the module, which seems like a good idea to me, I hadn't used it before, so this was a good opportunity for me to look it up and experiment with it.
- Ok, rg just needed to be installed. Let's try again: I want this oauth to add some additional permision scopes, specifically the ability to write to the user's repo, writing posts, and uploading blobs.
- Try again but remember that in this library what we are looking at is called grant_types in the node_modules/@atproto/oauth-client-browser package.
- The login flow isn't working, it is emitting the following error: "OAuth "invalid_request" error: Invalid authorization request: Expected array, received string at body.authorization_details, or Required at body.request, or Required at body.request"
- Looks like it is almost there. Still getting an error though: OAuth "invalid_scope" error: Scope "transition:com.atproto.repo.applyWrites" is not declared in the client metadata
- Wait a moment. It's good to have the option to honor VITE_CLIENT_ID but I want to burn the metadata into the application by setting it into clientMetadata when we set up new `BrowserOAuthClient({` in the oauth flow.
- Hi, I want to make the use of VITE_CLIENT_ID optional so I can run this locally.
- Well this is working now but is there no way to locally request those particular write scopes?
	- Educational response was:

> Short answer: not in pure loopback mode.
>
> When you run as a loopback client on 127.0.0.1 or ::1 with local default metadata, the OAuth server uses constrained metadata behavior, and those transition write scopes are not generally configurable there.
>
> What does work for local development with write scopes:
>
> 1. Run the app behind a public HTTPS tunnel (for example ngrok or Cloudflare Tunnel).
> 2. Host your client metadata JSON at a public URL.
> 3. Put the transition scopes in that metadata scope field.
> 4. Set VITE_CLIENT_ID to that metadata URL.
> 5. Use the tunneled app URL in redirect_uris.
>
> So:
>
> 1. Local loopback only: basically no custom write-scope request.
> 2. Local app via tunnel + public metadata: yes, you can request those write scopes.

