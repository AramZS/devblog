---
title: Day 5 - Iterate some dirs cast some hashmaps.
description: "Let's play with using Rust to process private to public notes."
date: 2023-06-12 22:59:43.10 -4
tags:
  - Knowledge Management
  - Notes
  - WiP
  - Build Tasks
  - Rust
  - YAML
---

## Project Scope and ToDos

1. Pull public-marked notes from the notebook to the new repo
2. Create website that treats them like a wiki and links pages together
3. Support the basic YAML in https://github.com/AramZS/notebook/blob/main/README.md

## Day 5

Ok, so I found the path. Now I can try and iterate through the files and folders in that path. First step, is it a folder at all?

```rust
fs::read_dir(note_path)
```

Ok, that should get the dir. But it also consumes the value. I think the best thing to do is `.clone` the variable so it can be used down the line. Now I need to do error handling and have an `else`. I can create a dir if none is found and if one isn't, I'll iterate through the files and folders in the path and find one. Then when I walk through that list I can figure out if it is a file or a folder and if it is a file I can process it with a function. I'll need more complex loops as well so I'll pull this into a function all its own later. For now, let's just get it working.

```rust
    if fs::read_dir(note_path.clone()).is_err() {
        // Create the notes directory if none is found.
        println!("No notes directory found. Creating one now.");
        fs::create_dir(note_path).expect("Failed to create notes directory");
    } else {
        // Parse the notes directory into an iterable object that we can walk through and take actions on.
        fs::read_dir(note_path)
            .and_then(|op| {
                for entry in op {
                    let entry = entry?;
                    let path = entry.path();
                    println!("Name: {}", path.display());
                }
                Ok(())
            })
            .expect("Failed to read notes directory");
    }
```

Ok, look at that. I have a list of directories and files! Now I need to detect if it is a dir or file and take the next step. It [looks like the `fs` library has a `metadata` function](https://stackoverflow.com/questions/30309100/how-to-check-if-a-given-path-is-a-file-or-directory) that I can use to find out! Once I have that path, I can pass it to my function to parse it. I see there are some options for things I can do with that `path` var. Should I be using [OsStr](https://doc.rust-lang.org/std/ffi/struct.OsStr.html)? What's the difference between that and a normal string? Why should I use it? It's pretty unclear.

Wait I just realized that I don't only have a bool value in public. My notes have the public YAML property with a bunch of different properties:

```markdown
- `public:` This note is intended to be published.
	- Notes marked `false` or with no value will never have any part published.
	- Notes marked `true` will have their whole body published along with metadata.
	- Notes marked `partial-public` will have any `:::{public} content :::` content blocks published and no metadata other than title.
	- Notes marked `partial-private` will have all content except for `:::{private} content :::` content blocks published and all metadata.
	- Notes marked `true` will also follow the `private` directives.
```

Ok, so how do I deal--in a strongly typed system--with the fact that I have a value that can be more than one type? Wait... more than that, what happens where the property isn't there? I need to do a check.

It looks like in Rust the best way to parse an object with a set of defined but not consistent properties is a hashmap. The YAML library I'm using has a function to transform the YAML object into a linked hashmap. I can then use that to check for the property and then check the value of the property.

Huh... it's still not working. I have the LinkedHashMap but `contains_key` won't just take a string. It looks like I have to transform my key into a yaml-y string from looking at the code.

```rust
let yamlHashmap = &yamlObj.as_hash().unwrap();
let keycheck = yamlHashmap.contains_key(&Yaml::from_str("public"));
```

Yeah, that works! I can check if the key exists now. And if it does I can start doing stuff with it. But will Rust let me cast it as a bool even when it has a value for the purposes of the first check? Can I do `if !keycheck || false == yamlObj["public"].as_bool().unwrap()`?

Ok, I gotta get off the computer so I'll find out next workday!

`git commit -am "Improving md processer for my notes."`
