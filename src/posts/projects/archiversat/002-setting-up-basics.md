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

- [x] Remember my login.
- [ ] List records
- [ ] Upload a warcz or warc blob
- [ ] List records with links to uploaded blobs.
- [ ] Load the archive viewer to allow the user to review their own archives.

## Day 2

Ok, so it is currently retaining my log in! That's good.

I think, in order to get anything really working, it seems I can't auth into any real permissions from the local. I'm not sure how people do local testing? But I will set up a file at `https://archiving.at/.well-known/oauth-client-metadata.json` with the right permissions.

I went through a number of prompts to figure out everything and it wasn't really great at figuring it out on its own. It seemed to have a lot of trouble figuring out the scopes. I don't blame it, I also had a lot of trouble wrapping my head around scopes, even with [reading](https://atproto.com/specs/oauth) up [on them](https://atproto.com/specs/permission). I ended up using the Lexicon Garden [OAuth Scope Builder](https://lexicon.garden/scope-builder?scope=atproto+blob:application/zip+blob:application/warc+repo:test.record.activity+repo:test.foo.bar?action%3Dcreate%26action%3Dupdate+rpc:app.bsky.actor.getProfile?aud%3Ddid%253Aweb%253Aapi.bsky.app%2523bsky_appview) with some test lexicons to figure out how the scopes worked.

I also needed to poke around on my own to figure out how to access profile information set up for Bluesky, but I was able to figure it out. There's a need for specific XRPC methods and requesting permission to access them that had to get added to the client-metadata document.

Finally, after all that, I was able to set up to pull my test record and list it. A good place to leave off.

`git commit -am "Trying to get data displayed on to the page"`

### Prompt Log:

Q: Can you set up a metadata JSON with the correct permissions served from the base of the domain? I'll upload it and serve it from the domain archiving.at

Compacted conversation

I'll create an OAuth client metadata JSON file for you to serve from archiving.at. Let me generate the file with the write permissions (transition scopes) configured:

Done! I've created oauth-client-metadata.json with the write permissions configured. Here's what you need to do:

Upload the file to https://archiving.at/.well-known/oauth-client-metadata.json (serving the exact file at that path)

Ensure proper headers: When serving, set the Content-Type header to application/json

Build with environment variable: When building the app for production, set:

Deploy to archiving.at and the OAuth flow will automatically:

Request the three write transition scopes (repo writes, create posts, upload blobs)
Use DPoP-bound access tokens for enhanced security
Notes on the metadata:

logo_uri points to https://archiving.at/logo.png — update or remove if you don't have a logo there
The redirect_uris expects your app served at https://archiving.at/auth/callback — if your callback path differs, update that
For local dev, leave VITE_CLIENT_ID unset and it'll use loopback mode with base atproto scope only
Anything you'd like to adjust in the metadata before uploading?

Q: The document is requesting the right scopes to be able to write, read and upload blobs to the PDS?

Yes, the metadata is correctly requesting all the necessary scopes. Here's the breakdown:

Read Access:

✓ atproto — baseline scope that grants read access to public data (profiles, posts, feeds, etc.)
Write Access:

✓ transition:com.atproto.repo.applyWrites — enables writing batches of records to the user's repo
✓ transition:com.atproto.repo.createRecord — enables creating individual records (posts, custom objects, etc.)
Blob Uploads:

✓ transition:com.atproto.repo.uploadBlob — enables uploading binary objects (images, media, etc.)
All three transition scopes are declared in your oauth-client-metadata.json:

This covers exactly what you requested: read capabilities (baseline atproto), write capabilities to the repo, and blob uploads. Once you upload this file to https://archiving.at/.well-known/oauth-client-metadata.json and set VITE_CLIENT_ID="https://archiving.at/.well-known/oauth-client-metadata.json" at build time, users will be prompted to grant all these permissions during login.

*NOTE: None of these are the right scopes except for `atproto`*

Q: Great. Can you move the oauth-client-metadata.json file to the static folder and set it up to be served through the vite build process into the correct folder? I think it would need to be in the static folder right?

Perfect! You already have a static folder. I'll:

Update vite.config.ts to explicitly use static as the public directory
Create the .well-known/ directory structure
Move the metadata file there
Now I'll move the metadata file to the correct location:

Done! I've:

✓ Updated vite.config.ts to explicitly set publicDir: "static"
✓ Created .well-known directory
✓ Moved oauth-client-metadata.json to oauth-client-metadata.json
✓ Removed the old file from the root
When you run pnpm build, Vite will copy everything from static to your dist root, so oauth-client-metadata.json will end up at dist/.well-known/oauth-client-metadata.json — exactly where it needs to be when deployed to archiving.at/.well-known/oauth-client-metadata.json.

Q: Great, I've uploaded the file. Can we use that instead of the burned in metadata in oauth.ts?

Done! I've simplified oauth.ts to fetch the metadata remotely instead of burning it in. Now:

When VITE_CLIENT_ID is set to https://archiving.at/.well-known/oauth-client-metadata.json, the OAuth client will automatically fetch your full metadata (scopes, redirect URIs, etc.) from that URL at runtime
When VITE_CLIENT_ID is unset, it falls back to loopback mode for local development
The metadata JSON file you uploaded is now your single source of truth—no need to keep it in sync in the code anymore.

Q: Ok, now that we've god this set up with the metadata file and it is online can you set the oauth request to ask to write to the PDS?

I’m checking the current OAuth client and login request path so I can switch the request to the production write scopes without reintroducing the old metadata mismatch.

I found the controlling path: the login component already has the write scopes, but it only enables them when VITE_CLIENT_ID is set. I’m going to make production auto-use your hosted metadata URL on archiving.at, keep loopback behavior locally, and validate with a build.

The scope gate is now driven by the actual client configuration instead of just an env check. Next I’m running a focused build to catch any Svelte or TypeScript issues from that change.

The build failure is local and expected: Svelte rejected the top-level await I introduced. I’m fixing that by switching to a normal static import in the same slice, then rerunning the build.

Yes. The login flow now requests the write-capable scope set whenever the app is running on archiving.at or VITE_CLIENT_ID is explicitly set.

I changed src/lib/oauth.ts so the hosted metadata URL is used automatically on the production domain, and I changed src/app/auth/login/Login.svelte to use a shared WRITE_SCOPE value instead of a separate env-only check. That means the auth request now asks for:

atproto
transition:com.atproto.repo.applyWrites
transition:com.atproto.repo.createRecord
transition:com.atproto.repo.uploadBlob
pnpm build passes. The only remaining note is a Vite warning about chunk size and a now-ineffective dynamic import because src/app/auth/login/Login.svelte statically imports src/lib/oauth.ts while other files still dynamic-import it. If you want, I can clean that import pattern up next.

*NOTE: Again, not the right scope*

Q: Is it possible to get the write capability in this app while it is running locally now that there is a domain set up?

I’m checking the current metadata and local OAuth setup to answer this against the actual redirect and client configuration you have now.

Yes, but not with the current metadata as-is.

Right now your hosted metadata at static/.well-known/oauth-client-metadata.json only allows this redirect URI:

https://archiving.at/auth/callback
And your local app in src/lib/oauth.ts runs on 127.0.0.1, so even if it uses the hosted client_id and asks for write scopes, the OAuth server will send the callback back to archiving.at, not your local dev server.

So the practical answer is:

Yes, local write-capable auth is possible if your local app is reachable at an allowed redirect URI.
No, your current setup does not allow that yet.
Your options are:

Add a local callback URI to the hosted metadata, such as http://127.0.0.1:5173/auth/callback, if the provider accepts it for this client.
Use a public tunnel like Cloudflare Tunnel or ngrok, then add that tunneled callback URL to the metadata.
Run the app locally under https://archiving.at with local DNS/hosts mapping plus HTTPS termination, so the current redirect URI already matches.
The cleanest dev setup is usually option 2. You keep the hosted metadata, add one temporary public callback URL, and point local Vite through that tunnel.

If you want, I can make the app support this cleanly by:

Adding an env-driven dev callback origin/client ID path.
Updating the metadata strategy so local+tunneled development can request write scopes without touching production behavior.

Q: Before you get to that I am testing the auth process on the domain and it isn't working. I get the following error:
`[ { "code": "invalid_type", "expected": "array", "received": "undefined", "path": [ "redirect_uris" ], "message": "Required" } ]`

I’m checking the OAuth client constructor path against the library’s expected config shape, because that error strongly suggests the client is validating clientMetadata locally before any remote fetch happens.

The failure is clear now: BrowserOAuthClient does not fetch remote metadata from { client_id }. It validates clientMetadata immediately, and redirect_uris is required. I’m updating the client creation path to use the library’s async BrowserOAuthClient.load(...), which is the code path that fetches your hosted metadata correctly.

I’ve confirmed the root cause and the one-hop fix: the app must construct the browser client through the async load path when using your hosted HTTPS client ID. I’m updating that slice and the three call sites that currently assume the client is synchronous, then I’ll rebuild.

The constructor path is fixed and all current callers now await the client. I’m validating with a build next; if that passes, this specific auth error should be gone.

The previous validation hit an environment quirk: pnpm build launched the dev script instead of the build script in this terminal context. I’m running vite build directly to get the actual compile result for the changed slice.

The error came from src/lib/oauth.ts: the app was constructing BrowserOAuthClient with only { client_id }, but this library validates clientMetadata immediately and requires redirect_uris. That meant it never reached the remote metadata fetch path.

I changed the client setup to use BrowserOAuthClient.load({ clientId }) when the hosted HTTPS client ID is in use, and updated the existing call sites in src/app/auth/login/Login.svelte, src/app/auth/callback/Callback.svelte, and src/app/App.svelte to await the client before calling signIn, callback, init, or restore.

Validation passed with pnpm exec vite build. The previous redirect_uris validation error should be resolved now, and the production domain should use the hosted metadata correctly. If auth still fails, the next thing to inspect is the callback request/response itself rather than client construction.

Q: The page at /auth/callback no longer works

The Callback component's client.callback(params) call is the likely culprit — after switching to the async load() path, the library is now managing redirect_uri internally via findRedirectUrl(), but we're bypassing that by calling callback() directly without a redirect_uri. The library's init() method handles both callback detection and redirect_uri resolution automatically — let me switch to that.

Updated Callback.svelte and ran build command
Build passes. The fix replaces the manual client.callback(params) approach with client.init(), which is what the library intends for this flow. Specifically:

init() reads the state+code params from the URL automatically
It calls findRedirectUrl() internally to resolve the correct redirect_uri from the loaded metadata (https://archiving.at/auth/callback)
It handles the token exchange with the correct redirect_uri included — which is what was missing before
The old manual callback(params) path was passing params without a redirect_uri, which the auth server would reject because the original authorization request included one.

Q: It's still getting a 404 on https://archiving.at/auth/callback
Remember this is a Single Page App. The landing page at App.svelte should have the routing in place to handle the callback.

Let me check the current routing and deployment config.

The SPA routing in App.svelte is fine — it already handles /auth/callback. The 404 is a server-side problem: the host doesn't know to serve index.html for unknown paths. The solution is a _redirects file (Netlify) or _headers/vercel.json depending on your host. Let me check what's in the project first.

Analyzing your answers... *NOTE: the system provided me with a poll here*

Q: How is archiving.at hosted/deployed?
A: Netlify
For Netlify, a _redirects file in static telling it to serve index.html for all paths is all that's needed.

Created _redirects

Vite will copy that file to dist/_redirects on build. When Netlify sees /*, it serves index.html with a 200 (not a redirect), the SPA loads, and isCallback in App.svelte fires correctly for /auth/callback.

Rebuild and redeploy and the /auth/callback 404 will be gone.

Q: Ok, great. Now it isn't requesting the full set of WRITE_SCOPE scopes

I’m going to verify the runtime scope selection logic and adjust hostname/client-ID detection so production domains like www.archiving.at still trigger the write scope request.

I found the bug: write scope is only enabled when location.hostname === "archiving.at", so it silently falls back to atproto on www.archiving.at or other subdomains. I’m broadening that detection and then validating with a build.

Fixed. The app was only enabling WRITE_SCOPE on the exact host archiving.at, so if you were on www.archiving.at it downgraded to just atproto.

I updated oauth.ts:14 to treat both the apex and subdomains as production hosts:

archiving.at
*.archiving.at (including www.archiving.at)
That means getConfiguredClientId() now uses your hosted client metadata URL on those hosts, and Login.svelte:14 will request the full WRITE_SCOPE again.

Build validation passed with pnpm exec vite build.

If you want, I can also add a temporary debug log in login showing the exact scope string being sent, then remove it after you confirm in browser network tools.

Q: I'd like to test this locally. How would I map a subdomain to my local host file to do testing with the correct callback logic?

Yes. The clean way is:

Map a hostname to 127.0.0.1 in hosts
Serve your local app on that hostname with HTTPS
Ensure the OAuth metadata redirect_uris includes that exact callback URL
For your current setup, easiest is to map the real domain locally so callback logic matches exactly.

Use this:

Then verify:

It should resolve to 127.0.0.1.

Important part: HTTPS
OAuth callback on https://archiving.at/auth/callback needs TLS locally. HTTP won’t behave like production and may fail OAuth/security checks.

Practical local TLS setup:

Install mkcert
Generate certs for archiving.at and www.archiving.at
Run Vite with HTTPS cert/key (or run Caddy/Nginx on 443 proxying to Vite)
Minimal Vite direction (if you want I can wire this in code):

Set server.host = "0.0.0.0" (or hostname)
Set server.https with the generated cert/key
Visit https://archiving.at:5173 (or proxy to 443)
One more critical check:
Your metadata currently has redirect URI https://archiving.at/auth/callback (no port).
So if you test on :5173, callback URI won’t match unless metadata includes the ported URI too.

Best match strategy:

Run local HTTPS on 443 for archiving.at
Keep redirect URI as https://archiving.at/auth/callback exactly
If you want, I can set up a ready-to-run local config next (hosts + mkcert + Vite/Caddy commands) tailored to your machine.

Q: Please add useful console logging across this file

I’m checking the current OAuth helper before editing so the logging lands on the actual control points that decide client ID selection and client construction.

Read oauth.ts

I’ve got the control points: redirect handling, client-ID selection, and cached client creation. I’m adding logs there so you can see exactly which branch runs, which client ID is selected, and whether the cached client or remote-load path is being used.

Edited
oauth.ts+52-5
The logging is in place at the decision points that matter for auth debugging. I’m running a quick build now to make sure the added instrumentation didn’t break the module.

I added targeted logging in src/lib/oauth.ts around the parts that actually control auth behavior:

localhost to 127.0.0.1 redirect
archiving-domain detection
VITE_CLIENT_ID vs hosted client ID vs loopback fallback
write-scope client availability
first-time client creation vs cached reuse
success and failure of BrowserOAuthClient initialization
Build validation passed with pnpm exec vite build.

When you test locally, the console should now tell you exactly which client ID path is being used and whether the app is loading remote metadata or falling back to loopback. If you want, I can also add one matching log in the login component to print the exact scope string being passed to signIn().

Q: Can you add displaying the user's username and avatar under the DID display in the app?

I'll add a section below the DID that displays a smaller avatar and the username (handle). Let me update the markup and add corresponding styles.

Q: Add code to this file that will take a session created using oauth.ts and use `getProfile({ actor: agent.accountDid })` to get the profile data to fill in to the app display

Done. I added a getUserProfile() function to src/lib/getBskyData.ts that:

Takes an OAuthSession from your OAuth client
Creates an Agent with that session
Calls agent.getProfile({ actor: agent.accountDid }) to fetch the profile
Returns ProfileViewDetailed | null with error handling
You can now call getUserProfile(session) from your callback or auth components to populate the app display. The function includes JSDoc documentation and error logging.

Build validation passed cleanly with pnpm exec vite build.

Q: Great! Use the output from getUserProfile to fill in the state infromation for displayName, handle and avatar

I'll update the Callback component to use the new getUserProfile function and simplify the profile fetching logic:

Now I'll update the App.svelte to extract the user data from the profile object in the onAuthSuccess handler:

The App.svelte's onAuthSuccess handler is already correctly extracting displayName, handle, and avatar from the profile. Let me validate that the callback changes compile cleanly:

Done! I updated src/app/auth/callback/Callback.svelte to:

Import the new getUserProfile function from getBskyData
Replace the inline profile-fetching logic with a single call to getUserProfile(session)
Pass the profile data to onAuthSuccess
The App.svelte component already extracts displayName, handle, and avatar from the profile and displays them in the user-summary section you added earlier. The whole flow is now cleaner and the profile fetching logic is centralized.

Build validation passed with pnpm exec vite build.

Q: In the DIV with the class list-records, when the user is signed in, retrieve all test.record.activity entries from their PDS and list them.

I’m checking the current signed-in view and the nearest data-access code so I can wire record listing into the existing authenticated state instead of inventing a parallel flow.

I’ve narrowed this to the authenticated view and one missing data helper. I’m checking the ATProto client’s listRecords shape first so I can add the smallest working fetch path and then render it in the existing list-records container.

The code search agent missed the actual workspace path, so I’m querying the installed package directly for the listRecords signature and response shape before I edit.

I have the needed shape: agent.com.atproto.repo.listRecords({ repo, collection }) returns { records } with uri, cid, and value. I’m going to add one helper for test.record.activity, then wire the signed-in view to fetch and render those records in list-records.

I’ve got the controlling path: fetch the signed-in session via the existing OAuth client, call com.atproto.repo.listRecords for test.record.activity, and render the returned records in the existing container. I’m wiring that into App.svelte and adding a small helper in getBskyData.ts, then I’ll run a build.

The records helper and authenticated rendering path are in place. I’m running a focused build now to catch any typing or Svelte issues before we stop.

The feature builds, but Svelte surfaced a local cleanup issue: App.svelte still has old .user-summary styles with no matching markup. I’m removing that dead CSS and rerunning the same build so the touched slice is clean.

The signed-in view now fetches and lists test.record.activity records from the user’s PDS inside the existing list-records container.

I added getActivityRecords(session) to src/lib/getBskyData.ts, which creates an authenticated Agent and calls agent.com.atproto.repo.listRecords({ repo, collection: "test.record.activity" }). In src/app/App.svelte, the app now restores the signed-in session after auth success, loads those records, and renders each entry with its AT URI and JSON payload. It also handles loading, empty, and error states, and clears the records on sign-out.

Validation passed with pnpm exec vite build. The only remaining build note is the pre-existing dynamic-import warning around src/lib/oauth.ts.
