---
title: Day 1 - We try new things.
description: "Let's play with using Rust to process private to public notes."
date: 2023-03-09 22:59:43.10 -4
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

## Day 1

I have a private Notes file, but I want to start making some of those files public so other people can use the notes files that might be helpful. I also want to connect with folks involved in the [Fellowship of the Link](https://www.fellowshipofthelink.org/) project who are putting together similar notes and personal knowledge management sites.

I also want to move forward with learning new things! So let's start with something cool - Rust. Everyone is doing stuff with Rust lately. I want to pick it up. Ok. So [we start at the beginning](https://www.rust-lang.org/learn/get-started).

Let's go with the basics!

`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

`1` to do a basic install.

I want to add it to `zsh`, which is my CLI tool of choice.

I can add it to my `export PATH=` setup. Just slip `$HOME/.cargo/env` in there.

Ok. `cargo new notebox`. Set it up.

It isn't running however.

`xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun`

[Looks like I may need to update xcode](https://developer.apple.com/forums/thread/711512).

Ok that works.

Next: we'll need to [read some files](https://blog.logrocket.com/how-to-read-files-rust/) and parse some Markdown!

Let's [look](https://lib.rs/search?q=commonmark) at [some options](https://crates.io/keywords/markdown)

I think, for the sake of trying stuff out here, we'll try [`pulldown-cmark`](https://lib.rs/crates/pulldown-cmark) and [`comrak`](https://github.com/kivikakk/comrak).

For `pulldown-cmark` we'll try one of their [examples](https://github.com/raphlinus/pulldown-cmark/blob/master/examples/string-to-string.rs).

```rust
use pulldown_cmark::{html, Options, Parser};

fn main() {
    let markdown_input: &str = "Hello world, this is a ~~complicated~~ *very simple* example.";
    println!("Parsing the following markdown string:\n{}", markdown_input);

    // Set up options and parser. Strikethroughs are not part of the CommonMark standard
    // and we therefore must enable it explicitly.
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    let parser = Parser::new_ext(markdown_input, options);

    // Write to String buffer.
    let mut html_output: String = String::with_capacity(markdown_input.len() * 3 / 2);
    html::push_html(&mut html_output, parser);

    // Check that the output is what we expected.
    let expected_html: &str =
        "<p>Hello world, this is a <del>complicated</del> <em>very simple</em> example.</p>\n";
    assert_eq!(expected_html, &html_output);

    // Write result to stdout.
    println!("\nHTML output:\n{}", &html_output);
}
```

Ok, that worked! A good sign. Let's pull the document file we want out of the file and into the string. We'll start with the README.

What can I learn from reading the code while I do this?

Well, it looks like one can do Rust typed. `: &str` at the end of the var decleration seems to indicate an expected type. It [isn't a normal string](https://doc.rust-lang.org/std/primitive.str.html), not like what I get out of the `fs::read_to_string` function though. I can expect a [`String`](https://doc.rust-lang.org/std/string/struct.String.html) out of the `fs` function it seems.

However, the Markdown parser expects the simpler type of string. I'll need to transform it. Looks like there's an easy way to handle this issue listed in the docs:

> `String` implements `Deref<Target = str>`, and so inherits all of `str`’s methods. In addition, this means that you can pass a String to a function which takes a &str by using an ampersand (&)

Ok! This works:

```rust
use pulldown_cmark::{html, Options, Parser};
use std::fs;

fn main() {
	let file_contents: String = fs::read_to_string("../README.md")
        .expect("LogRocket: Should have been able to read the file");
    let markdown_input: &str = &file_contents;
    println!("Parsing the following markdown string:\n{}", markdown_input);

    // Set up options and parser. Strikethroughs are not part of the CommonMark standard
    // and we therefore must enable it explicitly.
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    let parser = Parser::new_ext(markdown_input, options);

    // Write to String buffer.
    let mut html_output: String = String::with_capacity(markdown_input.len() * 3 / 2);
    html::push_html(&mut html_output, parser);

    // Check that the output is what we expected.
    // let expected_html: &str =
    //     "<p>Hello world, this is a <del>complicated</del> <em>very simple</em> example.</p>\n";
    // assert_eq!(expected_html, &html_output);

    // Write result to stdout.
    println!("\nHTML output:\n{}", &html_output);
}
```

But it doesn't parse out the YAML headmatter which isn't great!

Between `pulldown_cmark` being old and not seeming to be interested in supporting `YAML` and the fact that there doesn't appear to be a big community interested in resolving that problem I'm not particularly inclined to resolve this issue.

Let's try the next tool.

Looking at the ways it can be rendered now. Interesting. I hadn't realized it but `println!` takes a string and has a way to deliver an argument into the string at the position of `{}`;

Ok, this works:

```rust
extern crate comrak;
use comrak::{markdown_to_html, parse_document, format_html, Arena, ComrakOptions};
use comrak::nodes::{AstNode, NodeValue};
use std::fs;

fn main() {
	let file_contents: String = fs::read_to_string("../README.md")
        .expect("LogRocket: Should have been able to read the file");
    let markdown_input: &str = &file_contents;
    // println!("Parsing the following markdown string:\n{}", markdown_input);

	// The returned nodes are created in the supplied Arena, and are bound by its lifetime.
	let arena = Arena::new();

	let root = parse_document(
		&arena,
		"This is my input.\n\n1. Also my input.\n2. Certainly my input.\n",
		&ComrakOptions::default());

	fn iter_nodes<'a, F>(node: &'a AstNode<'a>, f: &F)
		where F : Fn(&'a AstNode<'a>) {
		f(node);
		for c in node.children() {
			iter_nodes(c, f);
		}
	}

	iter_nodes(root, &|node| {
		match &mut node.data.borrow_mut().value {
			&mut NodeValue::Text(ref mut text) => {
				let orig = std::mem::replace(text, vec![]);
				*text = String::from_utf8(orig).unwrap().replace("my", "your").as_bytes().to_vec();
			}
			_ => (),
		}
	});

	let mut html = vec![];
	format_html(root, &ComrakOptions::default(), &mut html).unwrap();

	let result = String::from_utf8(html).unwrap();

	assert_eq!(
		result,
		"<p>This is your input.</p>\n\
		 <ol>\n\
		 <li>Also your input.</li>\n\
		 <li>Certainly your input.</li>\n\
		 </ol>\n");

	let basic_result = markdown_to_html("Hello, **世界**!", &ComrakOptions::default());
	assert_eq!(basic_result,
		 "<p>Hello, <strong>世界</strong>!</p>\n");

	println!("\nHTML output:\n");
	println!("{}", result);

	println!("\nBasic HTML output:\n{}", basic_result);
}
```

Both ways allow you to render HTML. It looks good! Now let's take a look at the YAML parsing processs.

Hmmmm, I tried adding:

```rust
	let file_result = markdown_to_html(markdown_input, &ComrakOptions::default());
	println!("\nFile HTML output:\n{}", file_result);
```

But the output seems to just include the YAML frontmatter as HTML. Not at all what I had hoped. Ok is there a way to handle this using the Comrak package? Yeah! [It looks like I wasn't the only one looking at doing this](https://whoisryosuke.com/blog/2022/create-a-markdown-editor-using-rust-and-react/)!

Ok, looking through how this works and realizing this changes in place.

I think I can zero out all the text and just output the FrontMatter in theory [to process](https://lib.rs/crates/yaml-rust). I suppose I could just pull it out. [It looks like someone else has tried that](https://github.com/azdle/rust-frontmatter/blob/master/src/lib.rs).

The problem is that I want to replace in-place the various blocks. The way this seems to be done in Rust is with `std::mem::replace(blocks, vec![]);`. But when the block does not have a `vec` type but instead a more complex type it will refuse to run the program. Perhaps I can just pull it out outside the function?

No, that doesn't work.

I want to try to figure this out using the tool at hand. I think it would be interesting. How can I best zero out those blocks? Could I use `std::mem::forget`?

Doesn't seem to work.

Oh look though I can do `*text = vec![];` to eliminate the Text nodes. I'm guessing it reassigns it back to the node effectively?

It looks like I *could* replace it with a default using `Default::default()` or `std::mem::take`, but there's no way to do so right now because the crate doesn't define a default state. Interesting!

Ok, well, this is almost enough for now. Let's try that frontmatter package: `cargo add frontmatter`.

```rust
    let yaml_test_result = frontmatter::parse(markdown_input);
    dbg!(yaml_test_result);
```

Looks like it works? I don't know the `dbg` output what is shown when I do `cargo run` in the CLI well enough to fully understand what is happening here.

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

Ok, well, I found out a whole bunch of random interesting stuff about Rust, so mission accomplished in that sense! We'll get back to processing this later.

`git commit -am "Wild and potentially useless experementation"`
