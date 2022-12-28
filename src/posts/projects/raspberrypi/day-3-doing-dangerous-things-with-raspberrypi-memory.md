---
title: Doing dangerous things with Raspberry Pi memory settings - Day 3
description: "Let's get a node project up and running"
date: 2022-12-25 22:59:43.10 -4
tags:
  - Node
  - Raspberry Pi
  - SSH
  - Linux
  - Development Tools
  - WiP
  - swapfile
---

## Project Scope and ToDos

1. Be able to host a server
2. Be able to build node projects
3. Be able to handle larger projects

- [ ] Be able to run continually

## Day 3

Ok, it does seem to be that I'm still running out of memory. This is why I wanted to move over to the Raspberry Pi Linux setup. I can start doing things I wouldn't feel comfortable doing with a work machine, like setting up a ludicrous amount of swap memory.

[Looks like this is a swapfile setting](https://manpages.ubuntu.com/manpages/trusty/man8/dphys-swapfile.8.html) I can edit that sets the default max from 2gigs to something higher. Let's try 32 and see if I blow up my machine or my USB stick.

I was able to do a dry run on my Macbook and it worked, but when I try to write the files it all goes to shit.

```sh
npx @11ty/eleventy --quiet --incremental
Image request error Bad response for https://pbs.twimg.com/media/Coe4W7eUEAMxRd2.jpg (404): Not Found
Image request error Bad response for https://pbs.twimg.com/media/B3-EfHwCIAAMDKN.jpg (404): Not Found
Image request error Bad response for https://pbs.twimg.com/media/B3VERMVCMAAdf1U.jpg (404): Not Found

<--- Last few GCs --->

[3594:0x7fd580008000]   536892 ms: Scavenge (reduce) 3826.7 (3948.8) -> 3826.6 (3949.0) MB, 3.9 / 0.0 ms  (average mu = 0.277, current mu = 0.256) allocation failure
[3594:0x7fd580008000]   536923 ms: Scavenge (reduce) 3833.2 (3954.5) -> 3833.1 (3954.5) MB, 4.6 / 0.0 ms  (average mu = 0.277, current mu = 0.256) allocation failure
[3594:0x7fd580008000]   536947 ms: Scavenge (reduce) 3838.1 (3958.8) -> 3838.0 (3958.5) MB, 4.0 / 0.0 ms  (average mu = 0.277, current mu = 0.256) allocation failure


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 0x108e19815 node::Abort() (.cold.1) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 2: 0x107b18aa9 node::Abort() [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 3: 0x107b18c1f node::OnFatalError(char const*, char const*) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 4: 0x107c99877 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 5: 0x107c99813 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 6: 0x107e3ac65 v8::internal::Heap::FatalProcessOutOfMemory(char const*) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 7: 0x107e3ecad v8::internal::Heap::RecomputeLimits(v8::internal::GarbageCollector) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 8: 0x107e3b58d v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 9: 0x107e38aad v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
10: 0x107e45de0 v8::internal::Heap::AllocateRawWithLightRetrySlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
11: 0x107e45e61 v8::internal::Heap::AllocateRawWithRetryOrFailSlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
12: 0x107e0cfce v8::internal::FactoryBase<v8::internal::Factory>::NewRawTwoByteString(int, v8::internal::AllocationType) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
13: 0x1080e7c88 v8::internal::String::SlowFlatten(v8::internal::Isolate*, v8::internal::Handle<v8::internal::ConsString>, v8::internal::AllocationType) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
14: 0x107cb65ad v8::String::Utf8Length(v8::Isolate*) const [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
15: 0x107af3e0b node::Buffer::(anonymous namespace)::ByteLengthUtf8(v8::FunctionCallbackInfo<v8::Value> const&) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
16: 0x108506e8c Builtins_CallApiCallback [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
[1]    3503 abort      npx @11ty/eleventy --quiet --incremental
```

Meanwhile on the Raspberry Pi I was able to get it closer to running it seems, but even a dry-run hits the RAM max. Very strange because `htop` doesn't seem to show it ever hitting max. Is it not able to access the swap space?

The failures here seem to be the important ones?

```sh
 6: 0x10cc46c65 v8::internal::Heap::FatalProcessOutOfMemory(char const*) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 7: 0x10cc4acad v8::internal::Heap::RecomputeLimits(v8::internal::GarbageCollector) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 8: 0x10cc4758d v8::internal::Heap::PerformGarbageCollection(v8::internal::GarbageCollector, v8::GCCallbackFlags) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
 9: 0x10cc44aad v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
10: 0x10cc51de0 v8::internal::Heap::AllocateRawWithLightRetrySlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/Users/zuckerscharffa/.nvm/versions/node/v16.13.1/bin/node]
```
