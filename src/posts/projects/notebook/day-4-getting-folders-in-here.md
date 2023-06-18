---
title: Day 4 - Getting folders in here
description: "Let's play with using Rust to process private to public notes."
date: 2023-05-25 22:59:43.10 -4
tags:
  - Knowledge Management
  - Notes
  - WiP
  - Build Tasks
  - Rust
---

## Project Scope and ToDos

1. Pull public-marked notes from the notebook to the new repo
2. Create website that treats them like a wiki and links pages together
3. Support the basic YAML in https://github.com/AramZS/notebook/blob/main/README.md

## Day 4

I'd like to change `option_to_hold_file` to an ANY? I'm not sure how best to do that, but let's set up to actually do something that needs that process.

Ok, I'm at the point where I need to start scanning folders. Only one thing... I don't want to leak my folder structure from my system, so I need to store it as an environmental variable. What's the best way to do that? Does Rust have some equivalent of dotenv?

Looks like [it does](https://lib.rs/crates/dotenvy)!

Ok, it loads, but I don't see any result. Have I misconfigured it or have I done something wrong?

Looks like the recommended way to run the function is `dotenvy::dotenv()?;` but that only gives the good result not the error. I can drop that question mark and get a `Result` object which I can check for an `ok` or an error.

Cool so now it looks like this:

```rust
let env_result = dotenvy::dotenv();
if (env_result.is_ok()) {
	dbg!(env_result.unwrap());
} else {
	println!("Env tool failed");
	dbg!(env_result.unwrap());
}
```

This does the bad thing I want it to do, which is I want it to freak out and stop execution and tell me what the heck the failure is.

```sh
Env tool failed
thread 'main' panicked at 'called `Result::unwrap()` on an `Err` value: LineParse("\"../../../Dropbox\\ \\(redacted)/redacted path to notes/Notes\"", 20)', src/main.rs:19:25
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

Likely not good error handling, but good at doing what I want, which is to give me a useful error.

Ok, so I *am* calling the function correctly but it doesn't like my string. I pulled that string from the autocomplete for the path by OSX. But perhaps it doesn't need to handle things that way. Ok. let's try some test strings.

Ok, removing the escaping required by OSX terminal does seem to make the string workable for this process. But can it give me a path to query the directory? Let's see!

Fun aside here: Though the rest of the ENV vars come out in alphabetical order when walking the keys, the one this adds gets put at the bottom of the list. Almost thought it didn't work when that happened, glad I checked.
