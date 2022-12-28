---
title: Getting NPM install running on Raspberry Pi - Day 2
description: "Let's get a node project up and running"
date: 2022-12-24 22:59:43.10 -4
tags:
  - Node
  - Raspberry Pi
  - SSH
  - Linux
  - Development Tools
  - WiP
---

## Project Scope and ToDos

1. Be able to host a server
2. Be able to build node projects
3. Be able to handle larger projects

- [ ] Be able to run continually

## Day 2

Ok, I've got a complicated project here to run `npm install` on. Let's see if it works.

Ok, so I've got my big project on the Raspberry Pi and NPM install seems to have worked despite throwing a bunch of errors. But now I've got

`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`

There is [a suggested way forward](https://stackoverflow.com/questions/54137165/fatal-error-ineffective-mark-compacts-near-heap-limit-allocation-failed-javas), let's try it.

I'm going to add this as a command to my `package.json`.

`"start:heavy": "NODE_OPTIONS=--max-old-space-size=16384 npm run start",`

Ok, let's give that a try.

Nope, still maxing out. In fact, now it does so immediately. Oh, I see. [I've made the allowed use of RAM more than the 8gigs in my Raspberry Pi 4](https://stackoverflow.com/questions/53230823/fatal-error-ineffective-mark-compacts-near-heap-limit-allocation-failed-javas).

Hmmm, still getting `FATAL ERROR: Committing semi space failed. Allocation failed - JavaScript heap out of memory`.

This seems to be a memory issue. I think I can increase the memory fast by using a USB key as swap space? Let's try that.

```sh
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    1 119.2G  0 disk
├─sda1        8:1    1   200M  0 part
└─sda2        8:2    1   119G  0 part /media/zs/BigStick
mmcblk0     179:0    0  29.7G  0 disk
├─mmcblk0p1 179:1    0   2.4G  0 part
├─mmcblk0p2 179:2    0     1K  0 part
├─mmcblk0p5 179:5    0    32M  0 part
├─mmcblk0p6 179:6    0   256M  0 part /boot
└─mmcblk0p7 179:7    0  27.1G  0 part /
```

Ok, I've reformatted my BigStick [using the instructions at addictive tips](https://www.addictivetips.com/ubuntu-linux-tips/use-swap-space-on-usb-drive-in-rasbian-linux/). It worked pretty well so far, but I did have to [change the type to Linux Swap which is noted as 82 instead of 83 here](https://www.computernetworkingnotes.com/linux-tutorials/how-to-create-swap-partition-in-linux.html).

I rebooted and it looks like, by using `free -m` I can see I've added about 2 gigs of swap, not the whole stick. Why is that the case?

```sh
               total        used        free      shared  buff/cache   available
Mem:            7898         244        7160          35         493        7393
Swap:           2047           0        2047
```

It [looks like that's the max using the tools I used](https://forums.raspberrypi.com/viewtopic.php?t=150141). But lets try leaving it here and rerunning my commands.

Well, it definitely used the swap space and I don't think I ever saw it run out of Memory, but it still failed. New error this time though! Let's reproduce here in full:

```sh

<--- Last few GCs --->

[3171:0x40cd090]  1578766 ms: Scavenge 2040.1 (2088.9) -> 2039.9 (2088.9) MB, 26.5 / 0.1 ms  (average mu = 0.874, current mu = 0.340) external memory pressure
[3171:0x40cd090]  1578831 ms: Scavenge 2039.9 (2088.9) -> 2039.7 (2088.9) MB, 63.4 / 0.1 ms  (average mu = 0.874, current mu = 0.340) external memory pressure
[3171:0x40cd090]  1582402 ms: Mark-sweep 2041.7 (2090.6) -> 2026.5 (2085.1) MB, 3102.0 / 2.0 ms  (average mu = 0.783, current mu = 0.292) allocation failure GC in old space requested


<--- JS stacktrace --->

FATAL ERROR: NewSpace::Rebalance Allocation failed - JavaScript heap out of memory
Aborted
```

New error is good!
