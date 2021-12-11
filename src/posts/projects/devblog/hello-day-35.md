---
title: Hello World Devblog - Pt. 35
description: "More devblog"
project: Dev Blog
date: 2021-11-12 22:59:43.10 -4
tags:
  - Starters
  - 11ty
  - Node
  - WiP
  - Markdown-It
featuredImage: "close-up-keys.jpg"
featuredImageCredit: "'TYPE' by SarahDeer is licensed with CC BY 2.0"
featuredImageLink: "https://www.flickr.com/photos/40393390@N00/2386752252"
featuredImageAlt: "Close up photo of keyboard keys."
---

## Project Scope and ToDos

1. Static Site Generator that can build the blog and let me host it on Github Pages
2. I want to write posts in Markdown because I'm lazy, it's easy, and it is how I take notes now.
3. I don't want to spend a ton of time doing design work. I'm doing complicated designs for other projects, so I want to pull a theme I like that I can rely on someone else to keep up.
4. Once it gets going, I want template changes to be easy.
5. It should be as easy as Jekyll, so I need to be able to build it using GitHub Actions, where I can just commit a template change or Markdown file and away it goes. If I can't figure this out than fk it, just use Jekyll.
6. I require it to be used by a significant percent of my professional peers so I can get easy answers when something goes wrong.
7. I want source maps. This is a dev log site which means whatever I do with it should be easy for other developers to read.

- [x] Also [the sitemap plugin](https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap) looks cool. Should grab that later.

- [ ] So does the [reading time one](https://www.npmjs.com/package/eleventy-plugin-reading-time).

- [x] Also [this TOC plugin](https://github.com/jdsteinbach/eleventy-plugin-toc/) mby?

- [x] Use [Data Deep Merge](https://www.11ty.dev/docs/data-deep-merge/) in this blog.

- [x] Decide if I want to render the CSS fancier than just a base file and do per-template splitting.

<s>

- [ ] Can I use the template inside of dinky that already exists instead of copy/pasting it?

</s>

<s>

- [ ] Is there a way to have permalinks to posts contain metadata without organizing them into subfolders?

</s>

- [x] How do I cachebreak files on the basis of new build events? Datetime? `site.github.build_revision` is [how Jekyll accomplishes this](https://github.com/jekyll/github-metadata/blob/master/docs/site.github.md), but is there a way to push [that](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) [into the build process](https://stackoverflow.com/questions/54310050/how-to-version-build-artifacts-using-github-actions) for 11ty?

- [x] Make link text look less shitty. It looks like it is a whole, lighter, font.

- [x] Code blocks do not have good syntax highlighting. I want good syntax highlighting.

- [x] Build a Markdown-it plugin to take my typing shortcuts `[prob, b/c, ...?]` and expand them on build.

- [ ] See if we can start Markdown's interpretation of H tags to [start at 2, since H1](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#multiple_h1) is always pulled from the page title metadata. If it isn't easy, I just have to change my pattern of writing in the MD documents.

- [x] Should I [explore some shortcodes](https://www.madebymike.com.au/writing/11ty-filters-data-shortcodes/)?

- [x] Order projects listing by last posted blog in that project

- [x] Limit the output of home page post lists to a specific number of posts

- [x] Show the latest post below the site intro on the homepage.

- [x] Tags pages with Pagination

- [x] Posts should be able to support a preview header image that can also be shown on post lists.

- [ ] Create a Markdown-It plugin that reads the project's repo URL off the folder data file and renders commit messages with [links to the referenced commit](https://stackoverflow.com/questions/15919635/on-github-api-what-is-the-best-way-to-get-the-last-commit-message-associated-w). (Is this even possible?) (Is there a way to do it with eleventy instead?)

- [x] Create Next Day/Previous Day links on each post / Next/Previous post on post templates from projects

- [x] Tags should be in the sidebar of articles and link to tag pages

- [x] Create a skiplink for the todo section (or would this be better served with the ToC plugin?) - Yes it would be!

- [x] Add a Things I Learned section to the project pages that are the things I learned from that specific project.

- [x] Add a technical reading log to the homepage

- [x] [Hide](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty) empty sections.

- [x] Add byline to post pages

- [x] Have table of contents attach to sidebar bottom on mobile

- [x] Support dark mode

- [x] Social Icons

- [x] SEO/Social/JSON-LD HEAD data

## Day 35

Ok, I got my first plugin for Markdown-It working! This is great! Let's try the GitHub plugin

First let's [try some API requests in the terminal](https://docs.github.com/rest).

Looks like there [is an endpoint for searching commits](https://docs.github.com/en/rest/reference/search#search-commits).

Ok, so a search of `https --auth AramZS:[token] https://api.github.com/search/commits?q=repo:AramZS/devblog+day+32` results in:

```json

{
    "incomplete_results": false,
    "items": [
        {
            "author": {
                "avatar_url": "https://avatars.githubusercontent.com/u/748069?v=4",
                "events_url": "https://api.github.com/users/AramZS/events{/privacy}",
                "followers_url": "https://api.github.com/users/AramZS/followers",
                "following_url": "https://api.github.com/users/AramZS/following{/other_user}",
                "gists_url": "https://api.github.com/users/AramZS/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/AramZS",
                "id": 748069,
                "login": "AramZS",
                "node_id": "MDQ6VXNlcjc0ODA2OQ==",
                "organizations_url": "https://api.github.com/users/AramZS/orgs",
                "received_events_url": "https://api.github.com/users/AramZS/received_events",
                "repos_url": "https://api.github.com/users/AramZS/repos",
                "site_admin": false,
                "starred_url": "https://api.github.com/users/AramZS/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/AramZS/subscriptions",
                "type": "User",
                "url": "https://api.github.com/users/AramZS"
            },
            "comments_url": "https://api.github.com/repos/AramZS/devblog/commits/f738429d2fd507f2076240c68f6704b645cb468d/comments",
            "commit": {
                "author": {
                    "date": "2021-11-21T23:19:18.000-05:00",
                    "email": "Aram.Zucker-Scharff@washpost.com",
                    "name": "Aram Zucker-Scharff"
                },
                "comment_count": 0,
                "committer": {
                    "date": "2021-11-21T23:19:18.000-05:00",
                    "email": "noreply@github.com",
                    "name": "GitHub"
                },
                "message": "Merge pull request #6 from AramZS/day-32\n\nDay 32",
                "tree": {
                    "sha": "9ddafc9982b34cbab840ba81f0139c21eb43b5aa",
                    "url": "https://api.github.com/repos/AramZS/devblog/git/trees/9ddafc9982b34cbab840ba81f0139c21eb43b5aa"
                },
                "url": "https://api.github.com/repos/AramZS/devblog/git/commits/f738429d2fd507f2076240c68f6704b645cb468d"
            },
            "committer": {
                "avatar_url": "https://avatars.githubusercontent.com/u/19864447?v=4",
                "events_url": "https://api.github.com/users/web-flow/events{/privacy}",
                "followers_url": "https://api.github.com/users/web-flow/followers",
                "following_url": "https://api.github.com/users/web-flow/following{/other_user}",
                "gists_url": "https://api.github.com/users/web-flow/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/web-flow",
                "id": 19864447,
                "login": "web-flow",
                "node_id": "MDQ6VXNlcjE5ODY0NDQ3",
                "organizations_url": "https://api.github.com/users/web-flow/orgs",
                "received_events_url": "https://api.github.com/users/web-flow/received_events",
                "repos_url": "https://api.github.com/users/web-flow/repos",
                "site_admin": false,
                "starred_url": "https://api.github.com/users/web-flow/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/web-flow/subscriptions",
                "type": "User",
                "url": "https://api.github.com/users/web-flow"
            },
            "html_url": "https://github.com/AramZS/devblog/commit/f738429d2fd507f2076240c68f6704b645cb468d",
            "node_id": "MDY6Q29tbWl0Mzc2NzA2MzI2OmY3Mzg0MjlkMmZkNTA3ZjIwNzYyNDBjNjhmNjcwNGI2NDVjYjQ2OGQ=",
            "parents": [
                {
                    "html_url": "https://github.com/AramZS/devblog/commit/b0f64c92e21f230ee13692a99e347f0eed5678da",
                    "sha": "b0f64c92e21f230ee13692a99e347f0eed5678da",
                    "url": "https://api.github.com/repos/AramZS/devblog/commits/b0f64c92e21f230ee13692a99e347f0eed5678da"
                },
                {
                    "html_url": "https://github.com/AramZS/devblog/commit/cf3dc12d4183c10b51426d9bd45867ea37854481",
                    "sha": "cf3dc12d4183c10b51426d9bd45867ea37854481",
                    "url": "https://api.github.com/repos/AramZS/devblog/commits/cf3dc12d4183c10b51426d9bd45867ea37854481"
                }
            ],
            "repository": {
                "archive_url": "https://api.github.com/repos/AramZS/devblog/{archive_format}{/ref}",
                "assignees_url": "https://api.github.com/repos/AramZS/devblog/assignees{/user}",
                "blobs_url": "https://api.github.com/repos/AramZS/devblog/git/blobs{/sha}",
                "branches_url": "https://api.github.com/repos/AramZS/devblog/branches{/branch}",
                "collaborators_url": "https://api.github.com/repos/AramZS/devblog/collaborators{/collaborator}",
                "comments_url": "https://api.github.com/repos/AramZS/devblog/comments{/number}",
                "commits_url": "https://api.github.com/repos/AramZS/devblog/commits{/sha}",
                "compare_url": "https://api.github.com/repos/AramZS/devblog/compare/{base}...{head}",
                "contents_url": "https://api.github.com/repos/AramZS/devblog/contents/{+path}",
                "contributors_url": "https://api.github.com/repos/AramZS/devblog/contributors",
                "deployments_url": "https://api.github.com/repos/AramZS/devblog/deployments",
                "description": null,
                "downloads_url": "https://api.github.com/repos/AramZS/devblog/downloads",
                "events_url": "https://api.github.com/repos/AramZS/devblog/events",
                "fork": false,
                "forks_url": "https://api.github.com/repos/AramZS/devblog/forks",
                "full_name": "AramZS/devblog",
                "git_commits_url": "https://api.github.com/repos/AramZS/devblog/git/commits{/sha}",
                "git_refs_url": "https://api.github.com/repos/AramZS/devblog/git/refs{/sha}",
                "git_tags_url": "https://api.github.com/repos/AramZS/devblog/git/tags{/sha}",
                "hooks_url": "https://api.github.com/repos/AramZS/devblog/hooks",
                "html_url": "https://github.com/AramZS/devblog",
                "id": 376706326,
                "issue_comment_url": "https://api.github.com/repos/AramZS/devblog/issues/comments{/number}",
                "issue_events_url": "https://api.github.com/repos/AramZS/devblog/issues/events{/number}",
                "issues_url": "https://api.github.com/repos/AramZS/devblog/issues{/number}",
                "keys_url": "https://api.github.com/repos/AramZS/devblog/keys{/key_id}",
                "labels_url": "https://api.github.com/repos/AramZS/devblog/labels{/name}",
                "languages_url": "https://api.github.com/repos/AramZS/devblog/languages",
                "merges_url": "https://api.github.com/repos/AramZS/devblog/merges",
                "milestones_url": "https://api.github.com/repos/AramZS/devblog/milestones{/number}",
                "name": "devblog",
                "node_id": "MDEwOlJlcG9zaXRvcnkzNzY3MDYzMjY=",
                "notifications_url": "https://api.github.com/repos/AramZS/devblog/notifications{?since,all,participating}",
                "owner": {
                    "avatar_url": "https://avatars.githubusercontent.com/u/748069?v=4",
                    "events_url": "https://api.github.com/users/AramZS/events{/privacy}",
                    "followers_url": "https://api.github.com/users/AramZS/followers",
                    "following_url": "https://api.github.com/users/AramZS/following{/other_user}",
                    "gists_url": "https://api.github.com/users/AramZS/gists{/gist_id}",
                    "gravatar_id": "",
                    "html_url": "https://github.com/AramZS",
                    "id": 748069,
                    "login": "AramZS",
                    "node_id": "MDQ6VXNlcjc0ODA2OQ==",
                    "organizations_url": "https://api.github.com/users/AramZS/orgs",
                    "received_events_url": "https://api.github.com/users/AramZS/received_events",
                    "repos_url": "https://api.github.com/users/AramZS/repos",
                    "site_admin": false,
                    "starred_url": "https://api.github.com/users/AramZS/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/AramZS/subscriptions",
                    "type": "User",
                    "url": "https://api.github.com/users/AramZS"
                },
                "private": false,
                "pulls_url": "https://api.github.com/repos/AramZS/devblog/pulls{/number}",
                "releases_url": "https://api.github.com/repos/AramZS/devblog/releases{/id}",
                "stargazers_url": "https://api.github.com/repos/AramZS/devblog/stargazers",
                "statuses_url": "https://api.github.com/repos/AramZS/devblog/statuses/{sha}",
                "subscribers_url": "https://api.github.com/repos/AramZS/devblog/subscribers",
                "subscription_url": "https://api.github.com/repos/AramZS/devblog/subscription",
                "tags_url": "https://api.github.com/repos/AramZS/devblog/tags",
                "teams_url": "https://api.github.com/repos/AramZS/devblog/teams",
                "trees_url": "https://api.github.com/repos/AramZS/devblog/git/trees{/sha}",
                "url": "https://api.github.com/repos/AramZS/devblog"
            },
            "score": 1.0,
            "sha": "f738429d2fd507f2076240c68f6704b645cb468d",
            "url": "https://api.github.com/repos/AramZS/devblog/commits/f738429d2fd507f2076240c68f6704b645cb468d"
        },
        {
            "author": {
                "avatar_url": "https://avatars.githubusercontent.com/u/748069?v=4",
                "events_url": "https://api.github.com/users/AramZS/events{/privacy}",
                "followers_url": "https://api.github.com/users/AramZS/followers",
                "following_url": "https://api.github.com/users/AramZS/following{/other_user}",
                "gists_url": "https://api.github.com/users/AramZS/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/AramZS",
                "id": 748069,
                "login": "AramZS",
                "node_id": "MDQ6VXNlcjc0ODA2OQ==",
                "organizations_url": "https://api.github.com/users/AramZS/orgs",
                "received_events_url": "https://api.github.com/users/AramZS/received_events",
                "repos_url": "https://api.github.com/users/AramZS/repos",
                "site_admin": false,
                "starred_url": "https://api.github.com/users/AramZS/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/AramZS/subscriptions",
                "type": "User",
                "url": "https://api.github.com/users/AramZS"
            },
            "comments_url": "https://api.github.com/repos/AramZS/devblog/commits/b0db043f14feb1ef6f9f00cad61e2fedcac6e958/comments",
            "commit": {
                "author": {
                    "date": "2021-11-21T23:17:06.000-05:00",
                    "email": "aramzs@hacktext.com",
                    "name": "Aram Zucker-Scharff"
                },
                "comment_count": 0,
                "committer": {
                    "date": "2021-11-21T23:17:06.000-05:00",
                    "email": "aramzs@hacktext.com",
                    "name": "Aram Zucker-Scharff"
                },
                "message": "Finishing off day 32",
                "tree": {
                    "sha": "b945b859b8c261d75bd02e107e1f0f3d3769aebe",
                    "url": "https://api.github.com/repos/AramZS/devblog/git/trees/b945b859b8c261d75bd02e107e1f0f3d3769aebe"
                },
                "url": "https://api.github.com/repos/AramZS/devblog/git/commits/b0db043f14feb1ef6f9f00cad61e2fedcac6e958"
            },
            "committer": {
                "avatar_url": "https://avatars.githubusercontent.com/u/748069?v=4",
                "events_url": "https://api.github.com/users/AramZS/events{/privacy}",
                "followers_url": "https://api.github.com/users/AramZS/followers",
                "following_url": "https://api.github.com/users/AramZS/following{/other_user}",
                "gists_url": "https://api.github.com/users/AramZS/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/AramZS",
                "id": 748069,
                "login": "AramZS",
                "node_id": "MDQ6VXNlcjc0ODA2OQ==",
                "organizations_url": "https://api.github.com/users/AramZS/orgs",
                "received_events_url": "https://api.github.com/users/AramZS/received_events",
                "repos_url": "https://api.github.com/users/AramZS/repos",
                "site_admin": false,
                "starred_url": "https://api.github.com/users/AramZS/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/AramZS/subscriptions",
                "type": "User",
                "url": "https://api.github.com/users/AramZS"
            },
            "html_url": "https://github.com/AramZS/devblog/commit/b0db043f14feb1ef6f9f00cad61e2fedcac6e958",
            "node_id": "MDY6Q29tbWl0Mzc2NzA2MzI2OmIwZGIwNDNmMTRmZWIxZWY2ZjlmMDBjYWQ2MWUyZmVkY2FjNmU5NTg=",
            "parents": [
                {
                    "html_url": "https://github.com/AramZS/devblog/commit/ae757146534498b1eb1429564f38c310a8697440",
                    "sha": "ae757146534498b1eb1429564f38c310a8697440",
                    "url": "https://api.github.com/repos/AramZS/devblog/commits/ae757146534498b1eb1429564f38c310a8697440"
                }
            ],
            "repository": {
                "archive_url": "https://api.github.com/repos/AramZS/devblog/{archive_format}{/ref}",
                "assignees_url": "https://api.github.com/repos/AramZS/devblog/assignees{/user}",
                "blobs_url": "https://api.github.com/repos/AramZS/devblog/git/blobs{/sha}",
                "branches_url": "https://api.github.com/repos/AramZS/devblog/branches{/branch}",
                "collaborators_url": "https://api.github.com/repos/AramZS/devblog/collaborators{/collaborator}",
                "comments_url": "https://api.github.com/repos/AramZS/devblog/comments{/number}",
                "commits_url": "https://api.github.com/repos/AramZS/devblog/commits{/sha}",
                "compare_url": "https://api.github.com/repos/AramZS/devblog/compare/{base}...{head}",
                "contents_url": "https://api.github.com/repos/AramZS/devblog/contents/{+path}",
                "contributors_url": "https://api.github.com/repos/AramZS/devblog/contributors",
                "deployments_url": "https://api.github.com/repos/AramZS/devblog/deployments",
                "description": null,
                "downloads_url": "https://api.github.com/repos/AramZS/devblog/downloads",
                "events_url": "https://api.github.com/repos/AramZS/devblog/events",
                "fork": false,
                "forks_url": "https://api.github.com/repos/AramZS/devblog/forks",
                "full_name": "AramZS/devblog",
                "git_commits_url": "https://api.github.com/repos/AramZS/devblog/git/commits{/sha}",
                "git_refs_url": "https://api.github.com/repos/AramZS/devblog/git/refs{/sha}",
                "git_tags_url": "https://api.github.com/repos/AramZS/devblog/git/tags{/sha}",
                "hooks_url": "https://api.github.com/repos/AramZS/devblog/hooks",
                "html_url": "https://github.com/AramZS/devblog",
                "id": 376706326,
                "issue_comment_url": "https://api.github.com/repos/AramZS/devblog/issues/comments{/number}",
                "issue_events_url": "https://api.github.com/repos/AramZS/devblog/issues/events{/number}",
                "issues_url": "https://api.github.com/repos/AramZS/devblog/issues{/number}",
                "keys_url": "https://api.github.com/repos/AramZS/devblog/keys{/key_id}",
                "labels_url": "https://api.github.com/repos/AramZS/devblog/labels{/name}",
                "languages_url": "https://api.github.com/repos/AramZS/devblog/languages",
                "merges_url": "https://api.github.com/repos/AramZS/devblog/merges",
                "milestones_url": "https://api.github.com/repos/AramZS/devblog/milestones{/number}",
                "name": "devblog",
                "node_id": "MDEwOlJlcG9zaXRvcnkzNzY3MDYzMjY=",
                "notifications_url": "https://api.github.com/repos/AramZS/devblog/notifications{?since,all,participating}",
                "owner": {
                    "avatar_url": "https://avatars.githubusercontent.com/u/748069?v=4",
                    "events_url": "https://api.github.com/users/AramZS/events{/privacy}",
                    "followers_url": "https://api.github.com/users/AramZS/followers",
                    "following_url": "https://api.github.com/users/AramZS/following{/other_user}",
                    "gists_url": "https://api.github.com/users/AramZS/gists{/gist_id}",
                    "gravatar_id": "",
                    "html_url": "https://github.com/AramZS",
                    "id": 748069,
                    "login": "AramZS",
                    "node_id": "MDQ6VXNlcjc0ODA2OQ==",
                    "organizations_url": "https://api.github.com/users/AramZS/orgs",
                    "received_events_url": "https://api.github.com/users/AramZS/received_events",
                    "repos_url": "https://api.github.com/users/AramZS/repos",
                    "site_admin": false,
                    "starred_url": "https://api.github.com/users/AramZS/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/AramZS/subscriptions",
                    "type": "User",
                    "url": "https://api.github.com/users/AramZS"
                },
                "private": false,
                "pulls_url": "https://api.github.com/repos/AramZS/devblog/pulls{/number}",
                "releases_url": "https://api.github.com/repos/AramZS/devblog/releases{/id}",
                "stargazers_url": "https://api.github.com/repos/AramZS/devblog/stargazers",
                "statuses_url": "https://api.github.com/repos/AramZS/devblog/statuses/{sha}",
                "subscribers_url": "https://api.github.com/repos/AramZS/devblog/subscribers",
                "subscription_url": "https://api.github.com/repos/AramZS/devblog/subscription",
                "tags_url": "https://api.github.com/repos/AramZS/devblog/tags",
                "teams_url": "https://api.github.com/repos/AramZS/devblog/teams",
                "trees_url": "https://api.github.com/repos/AramZS/devblog/git/trees{/sha}",
                "url": "https://api.github.com/repos/AramZS/devblog"
            },
            "score": 1.0,
            "sha": "b0db043f14feb1ef6f9f00cad61e2fedcac6e958",
            "url": "https://api.github.com/repos/AramZS/devblog/commits/b0db043f14feb1ef6f9f00cad61e2fedcac6e958"
        },
        ...
    ],
    "total_count": 4
}
```

So I can even use a more precise search and get back more useful results, like: `https --auth AramZS:[token] https://api.github.com/search/commits?q=repo:AramZS/devblog+Finish+day+34` will give me back 2 results which is more useful.

I [tried out Httpie on the CLI](https://httpie.io/docs#examples) for this and it worked pretty well.

Good to know how to do this raw, but it might be more useful to use the Github maintained `octokit/rest.js` tool? Looks like [it supports this type of query](https://octokit.github.io/rest.js/v18#search-commits). There are [a few](https://github.com/pksunkara/octonode) [other options](https://github.com/github-tools/github) to use as well.

Only a little time to work today, but unblocked this issue by better understanding the GitHub API and I think making this plugin work is possible.

`git commit -am "Finish day 35"`
