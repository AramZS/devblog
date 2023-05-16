---
title: Day 3 - Back at it
description: "Let's play with using Rust to process private to public notes."
date: 2023-05-10 22:59:43.10 -4
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

Ok, I think I've got stuff basically working!

`git commit -am "Adding more conventions."`

So I got the object, I can read metadata out of the file. Now I need to do something with that file! Step one, let's copy that file! I may want to edit it at the point of copying it over. I've read the file into a variable, so that should be the first step. Now how to write it?

First I want to check if the YAML public value is true. Hey, is this my first Rust `if` statement? I think so. Ok, so we cast it as `bool` and unrap it is what I'm seeing. Let's try that.

```rust
    if yamlObj["public"].as_bool().unwrap() {
        println!("Public is true");
    }
```

Hey, it works! Ok, now I want to write it.

Ok, just like `node` there's a clearly labeled `fs` library. Looks like it has a basic `write` function. Let's give it a try!

I've been passing everything (pretty much) by reference. But I'm actually done with this variable, so good behavior would be to actually clear it out when I'm done with it. So I should pass it not by reference, right? Let's try that. I've used `expect` in the past to handle errors, but the documentation says it isn't the preferred way to handle it. It looks like [there is chaining to handle errors](https://doc.rust-lang.org/std/result/) instead. Hmmm, whatever the syntax is supposed to be here, I'm not getting it right. I'll [have](https://doc.rust-lang.org/rust-by-example/error/option_unwrap/and_then.html) [to look](https://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/error-handling.html) [around](https://dev.to/nathan20/how-to-handle-errors-in-rust-a-comprehensive-guide-1cco).

Ok, it might not be the right error handling process for this. It looks like [perhaps](https://dev.to/nathan20/how-to-handle-errors-in-rust-a-comprehensive-guide-1cco) I could use a `?` after to early return an error. But that's not great, I want to do something with the error. So a control structure for that appears to be [match](https://doc.rust-lang.org/book/ch06-02-match.html). It looks like [this is the suggested way to handle errors in a recoverable way](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html).

```rust
    if yamlObj["public"].as_bool().unwrap() {
        println!("Public is true");
        let write_result = fs::write("../src/notes/README.md", file_contents);
        let written_file = match write_result {
            Ok(file) => file,
            Err(error) => panic!("Problem opening the file: {:?}", error),
        };
    }
```

Hey, look at that, I wrote a file! It works!

`git commit -am "Write a file, heck yes"`

And yeah, if `public` is `false` it won't write the file. Good first step!

Ok, what happens if `public` is not a bool, but is instead one of the directives I'm planning to use? How do I take a value that may or may not be a bool and handle it, optionally turning it into a `bool` or using it like a `bool`? I think the right answer is using `match`?

Maybe not, I think I can use [`Any`](https://doc.rust-lang.org/std/any/trait.Any.html) and either [`downcast`](https://doc.rust-lang.org/std/any/trait.Any.html#method.downcast-1) it or [handle it in a `Box`](https://doc.rust-lang.org/std/boxed/struct.Box.html#method.downcast).
