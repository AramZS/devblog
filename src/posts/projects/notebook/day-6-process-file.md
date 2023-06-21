---
title: Day 6 - Process YAML to decide if the file is public.
description: "Let's play with using Rust to process private to public notes."
date: 2023-06-20 22:59:43.10 -4
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

## Day 6

Ok I want to try out my new function. That means getting everything up and running. Looks like I have one issue, my use of the new `md_file_transformer` function isn't working for my processing. I have to deal with turning the `PathBuf` output I'm getting from the directory walk into a string I can process. I thought I could use `to_str` but I guess not. Let's take a look at [PathBuf](https://doc.rust-lang.org/std/path/struct.PathBuf.html). Huh. Docs say `to_str` should work. Yet, the Rust compiler isn't working. Hmmm, it says `expected struct "std::string::String" found enum "Option<&str>"`.

Ok, so I need to transform it into a string. Looks like [there are a few options](https://stackoverflow.com/questions/37388107/how-to-convert-the-pathbuf-to-string). I'll use `path.into_os_string().into_string().unwrap()`. It doesn't look like the best way to do it, especially if the user is on a Windows machine, but I'm not sure what the best alternative is. I suspect there is a way to pass the `PathBuf` direction into `read_to_string` in `fs`. But I can fiddle with that later, I'd like to move on from this for now.

Ok, that got me to the next problem. `if !keycheck || false == yamlObj["public"].as_bool().unwrap() {` doesn't work if the value isn't a boolean. Oh yeah, I could use a `match` process, similar to Javascript `switch`. Ok, I want to further symplify it a bit. I'll set up another function to do the actual writing of the file in the `match`.

Ok, I think I've gotten it working:

```rust
let keycheck = yamlHashmap.contains_key(&Yaml::from_str("public"));
// as_hash().unwrap().contains_key("public");
dbg!(&yamlObj["public"]);

// Check if variable is true
if !keycheck {
	// Not a public ready file.
} else {
	match yamlObj["public"].as_str().unwrap() {
		"true" => public_file_transform(single_file_path, markdown_input, "public"),
		"partial-public" => {
			public_file_transform(single_file_path, markdown_input, "partial-public")
		}
		"partial-private" => {
			public_file_transform(single_file_path, markdown_input, "partial-private")
		}
		"false" => println!("Public is false"),
		_ => println!("Public is not an expected value"),
	}
}
```

Now I'll have to build out `public_file_transform` to do the actual work of processing and copying the file. I'm not sure it makes sense to pass the markdown value for the public argument in this way. It might be a bit repetitive, after all I have to do a bunch of processing of the YAML data anyway inside the function. At the very least perhaps I should pass the YAML object into `public_file_transform`? I'll have to think if this is the best way to handle it. Perhaps I should just set a variable to the value of public after I've decided to continue and otherwise return early? I'll have to fiddle with it later.

`git commit -am "Continue setting up decision-making if file is public"`
