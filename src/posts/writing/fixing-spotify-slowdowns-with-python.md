---
title: "Using Python to fix my broken Spotify account by cleaning out Liked Songs"
description: "Grabbed some open source code and made a few modifications that let me use Spotipy to archive my Liked Songs into another playlist."
date: 2024-05-30 15:30:43.10 -5
tags:
  - Code
  - Python
  - music
  - Spotify
  - Spotipy
featuredImage: "python-record.jpg"
featuredImageAlt: "An old Monty Python audio record. Get it?"
featuredImageCredit: "Vintage Vinyl LP Record Album - Monty Python, Monty Python's Previous Record-Another Monty Python Record (2-LP Set), Kama Sutra Records, Catalog KSBS 2611-2, Genre - Non-Music (Comedy, Dialogue), USA, Released 1972 (Front Album Cover) - Photo by Joe Haupt, Used under Creative Commons CC-BY-SA"
featuredImageLink: "https://flickr.com/photos/51764518@N02/37841555536/in/photolist-27qzeHv-KQN9yC-kNHY-2mdn8Yo-ZDVS5G-YDsDzb"
---

So a few years back, I noticed that my Spotify mobile app (Android) seemed to really be struggling. I am a pretty heavy Spotify user and I listen to a lot of different music so even slight slowdowns really annoy me. I went back and forth with Spotify Support a bit but the whole thing was some weird mystery.

## The first time

I tried app settings, I tried reinstalling, I tried all sorts of stuff and, to Spotify's credit, they were really helpful. But none of it worked.

Then I wondered: could it be the *amount* of music I've liked? I don't know how Spotify uses the liked/saved songs, but presumably they have something to do with how it decides to recommend things to me. I imagine that, especially with the Smart Shuffle feature, if I was going to have quick, easy recommendations for users--even when they were offline--the Liked Songs list might come in handy, I might want to preload it, or query it occasionally, or in some other way process that list.

Now, I don't know if that's what was happening on my app, but I do know one thing: the minute I dropped a few thousand songs off my Liked List, dropping it below six thousand, the app started speeding up. All the connection problems, slow loading, and inability to access other Spotify-enabled devices? Gone like magic. (And no, it isn't because I had my Liked Songs list downloaded and it was taking up too much memory, I don't download that list.)

Whatever the reason, clearly the size of the Liked Songs list has some impact on the performance of the Android app. So I kept cleaning it up by making a copy of the list into a named playlist and deleting a bunch of songs off the Liked list.

## The second time

Then I forgot to do it for a while. Then something changed in the Spotify app. I could no longer make a copy of my Liked list easily, I couldn't select large swaths of it and copy them and I couldn't Ctrl-A select all and copy that to a different playlist. It seemed that with my Liked Songs list over 10,000 tracks it was just beyond Spotify's ability to handle playlist operations.

The app was slowed down again, and I couldn't do the needed cleanup without permanently losing the record of songs I had liked!

## Open source salvation

In comes [Alberto Redondo](https://herbort.me/).

I was searching for ways to use the Spotify API to solve this problem, which I suspected was related to the way the UI lazy-loads track items. I couldn't find much help in the forums, but [I did find Alberto's `spotipy-scripts` repository](https://github.com/albertored11/spotipy-scripts), thanks to its well put-together README, which wrapped the Python Spotify API tool [Spotipy](https://spotipy.readthedocs.io/en/2.24.0/) with a few useful utility scripts.

I got it working in my terminally misconfigured local Python environment and pulled new env variables in for a new Spotify app. Then I was able to use their scripts easily and, after a bit of digging around I found out that Spotipy did support accessing the Liked Songs list.

There were a few trip-ups:

- I needed to request an additional role
- Playlists normally allow you to query 100 items, but the Liked Songs list seems to limit you to 50.
- Spotipy has a unique function of `current_user_saved_tracks` for accessing Liked Songs mirroring Spotify's unique API endpoint for that list.
- I did end up hitting an API limit hand having to back off for a little bit.

But after I had that all figured out, I was able to create a new playlist in Spotify and copy all the Liked Songs into that playlist!

After that I was able to remove a few thousand tracks from my Liked Songs list and as soon as I did my app was working nicely again.

## Contributing my work back to the project

I put my function up on [a branch](https://github.com/AramZS/spotipy-scripts/tree/archive-saved) in my own GitHub (along with documentation) as [a forked repo](https://github.com/AramZS/spotipy-scripts) and [opened a PR against Alberto's repository](https://github.com/albertored11/spotipy-scripts/pull/2). Hopefully they'll find it useful and accept it. In any case, I have a tool now to solve this in the future.

## See it for yourself

You can see how [it works in the PR's code](https://github.com/albertored11/spotipy-scripts/pull/2/files). You can [pull my version from my fork](https://github.com/AramZS/spotipy-scripts/tree/archive-saved).

## Spotify, how does it work?

I don't know how the Liked Songs list works, or why this fixes my app, but I have my suspicions. Judging by the impact on speed and how it only happens when I open the app, I think that it is likely that the Spotify app does some sort of check or operation on the Liked Songs list when it starts up or regains focus. If so, then yeah, slimming that list down would have a big impact.

Previously, [I explored how to get the most out of Spotify's recommendations](https://aramzs.github.io/fun/2020/11/09/spotify-asks-listeners-to-hack-its-algorithm.html?ab=123213).
