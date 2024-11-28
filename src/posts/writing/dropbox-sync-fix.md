---
title: "Fixing the right click context menu in OSX Finder"
description: "Grabbed some open source code and made a few modifications that let me use Spotipy to archive my Liked Songs into another playlist."
date: 2024-11-22 15:30:43.10 -5
tags:
  - dropbox
featuredImage: "dropbox-prefs.png"
featuredImageAlt: "Dropbox Preferences"
featuredImageCredit: "Screenshot of Dropbox preferences"
featuredImageLink: "https://dropbox.com"
---

I have been very slowly setting up a new work computer and keeping track of what is going on by updating my [dotfile repository](https://github.com/AramZS/dotfiles). I installed Dropbox and then I went to open one of my Obsidian vaults I keep synced with Dropbox only to find that it wasn't working because Dropbox hadn't fully downloaded the files. Normally this is an easy solve: I right click on the folder and say "Make available offline". But the menu options weren't available! I searched around, tried a bunch of forum posts' suggestions; even rebooted my computer twice.

All of this and none of it worked! I was at a loss. Then I fiddled around more with Quick Actions > Customize on the folder right click and found the solution. If you too are looking for a solution, here is what it is (adapted from the Apple OSX documentation):

## The Solution

Go to Apple menu  > System Settings, click Privacy & Security in the sidebar, then click Extensions on the right. (You may need to scroll down.) Click Added Extensions and hit the checkboxes to enable Dropbox's Finder Extensions

## The Solution Visualized

Here's the steps with screenshots:

Find the Extensions button on the bottom of Privacy & Security:
![Extensions activation](/img/dropbox-folders-step-one.png)

Once that is open, you can click Added extensions:
![Added extensions area](/img/dropbox-folders-step-two.png)

Then you can activate the Dropbox extensions and everything should work!
![Dropbox extensions checked to activate](/img/dropbox-folders-step-three.png)
