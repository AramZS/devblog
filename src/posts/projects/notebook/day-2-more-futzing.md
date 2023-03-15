---
title: Day 2 - More Futzing
description: "Let's play with using Rust to process private to public notes."
date: 2023-03-14 22:59:43.10 -4
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

## Day 2

Ok, let's play around with Rust some more and see what we can figure out while futzing around blind. We have to figure out how to handle this object.

```bash
[src/main.rs:91] yaml_test_result = Ok(
    Some(
        Hash(
            {
                String(
                    "aliases",
                ): Array(
                    [
                        String(
                            "Note Publisher",
                        ),
                        String(
                            "NotePub",
                        ),
                        String(
                            "NotePublisher",
                        ),
                        String(
                            "Notebook",
                        ),
                    ],
                ),
                String(
                    "public",
                ): Boolean(
                    true,
                ),
            },
        ),
    ),
)
```

`Ok` is a way to handle error checking. [Useful info on how to deal with it here](https://doc.rust-lang.org/std/result/). It looks like I want to check it, then `unwrap()` it. Ok. I also have to remove the first `dbg!` because it takes ownership of the `yaml_test_result` object.

Next, what to do with `Some`? It appears to be a way to return a legitimate response from a function when it could also potentially respond with a null value, since [there isn't another way to hold that according to stack overflow](https://stackoverflow.com/questions/24771655/what-are-some-and-none). Rust has some useful tools for processing `Some` it seems!

> Ending the expression with ? will result in the Some’s unwrapped value, unless the result is None, in which case None is returned early from the enclosing function.

Hmmmm. That's not quite right. It looks like we prob need to further unwrap it? Perhaps with `unwrap_or_else`? Hmmmm, not sure how to use that. I could just `unwrap` again and deal with the Hash, but that prob isn't good handling.

`git commit -am "Continuing to figure out rust"`
