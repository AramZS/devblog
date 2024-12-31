---
title: Moving the python for processing Foursquare data into more manageable functions
description: "Maybe I might make this a module later?"
date: 2024-12-30 10:59:43.10 -4
tags:
  - Python
  - Foursquare
  - Location Data
  - Jupyter Notebook
  - Jupyter
  - WiP
---

## Project Scope and ToDos

1. Create a new site
2. Process the Foursquare data to a set of locations with additional data
3. Set the data up so it can be put on a map (it needs lat and long)

- [ ] Can be searched
- [ ] Can show travel paths throughout a day

## Day 3

Moving my work from the Jupyter Notebook into some more useful functions that make it easier to understand what is going on took some adjustments. I want to make the flow simpler and take less code as well. Some accidents along the way, but I think I have it working.

I wanted to flatten the items files as well as use the loop more simply to create a base object that is generic for multiple data files. This means changing some of the downstream functions as well.

I also want to make the whole project as flat as possible while providing some logical divisions for the files based on what needs to be imported and what the functions do.

I also took a look at what to do with the __init__ file:

- [python - What is \_\_init\_\_.py for? - Stack Overflow](https://stackoverflow.com/questions/448271/what-is-init-py-for)
- [What's your opinion on what to include in \_\_init\_\_.py ? : r/Python](https://www.reddit.com/r/Python/comments/1bbbwk/whats_your_opinion_on_what_to_include_in_init_py/)
- [Structuring Your Project — The Hitchhiker's Guide to Python](https://docs.python-guide.org/writing/structure/)
- [python - The Pythonic way of organizing modules and packages - Stack Overflow](https://stackoverflow.com/questions/1801878/the-pythonic-way-of-organizing-modules-and-packages)
- [python - How do I write good/correct package \_\_init\_\_.py files - Stack Overflow](https://stackoverflow.com/questions/1944569/how-do-i-write-good-correct-package-init-py-files)
- [python - What exactly does "import \*" import? - Stack Overflow](https://stackoverflow.com/questions/2360724/what-exactly-does-import-import)

I ended up using it to refine the exposed API like so:

```python
from .process_to_dfs import process_to_dfs, get_place_details
from .pull_in_data_files import pull_in_data_files
```

Ok, got the data retrieval and the processing into dataframes working now!

`git commit -am "Process data files into data frames"`

