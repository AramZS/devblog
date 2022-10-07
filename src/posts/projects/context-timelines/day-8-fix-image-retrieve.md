---
title: Context Center Timelines - Day 8 - Detour to dealing with image retrieval breaking my build process
description: "Something weird is happening in promises."
date: 2022-09-07 22:59:43.10 -4
tags:
  - 11ty
  - Node
  - Timelines
  - SSG
  - WiP
  - JS
---

## Project Scope and ToDos

1. Create timeline pages where one can see the whole timeline of a particular event
2. Give timeline items type or category icons so that you can easily scan what is happening.
3. Allow the user to enter the timeline at any individually sharable link of an event and seamlessly scroll up and down

- [ ] Deliver timelines as a plugin that can be extended by other 11ty users
- [ ] Auto-create social-media-ready screenshots of a timeline item
- [ ] Integrate with Contexter to have context-full link cards in the timeline
- [ ] Leverage the Live Blog format of Schema dot org
- [ ] Allow each entry to be its own Markdown file
- [ ] Handle SASS instead of CSS
- [ ] Fast Scroller by Month and Year

## Day 8

Looks like I'm getting a different error this time.

```javascript
`Error` was thrown:
[11ty]     Error: ENOENT: no such file or directory, open '/Users/zuckerscharffa/Dev/context-center/_contexterCache/images/httpstwittercomFoldableHumanstatus1464821797392551945/FDIsE-VUYAIbPyk.png'
        at Object.openSync (fs.js:498:3)
        at Object.writeFileSync (fs.js:1524:35)
        at /Users/zuckerscharffa/Dev/context-center/_custom-plugins/markdown-contexter/image-handler.js:176:10
        at runMicrotasks (<anonymous>)
        at processTicksAndRejections (internal/process/task_queues.js:95:5)
[11ty] Unhandled rejection in promise: (more in DEBUG output)
[11ty] > ENOENT: no such file or directory, open '/Users/zuckerscharffa/Dev/context-center/_contexterCache/images/httpstwittercomFoldableHumanstatus1464821797392551945/FBSA8vKVIAUJOn6.png'
```

Ok, it looks like the folders at hand in this Twitter Image handling aren't being created. Looks like I missed a folder create event.

Ok, moving to use `reject` on a promise to keep the error chain consistent. I think this may have resolved it? Or maybe not.

I'm now getting a Nunjucks error.

```js
[11ty] Writing docs/timegate/https:/www.th/_custom-plugins/timelinety/src/layouts/timeline-item.njk)
      Template render error: (/Users/zuckerscharffa/Dev/context-center/_custom-plugins/timelinety/src/layouts/timeline-item-wrapper.njk)
      Template render error: (/Users/zuckerscharffa/Dev/context-center/_custom-plugins/timelinety/src/layouts/timeline-filters.njk) [Line 21, Column 50]
      attempted to output null or undefined value
        at Object._prettifyError (/Users/zuckerscharffa/Dev/context-center/node_modules/nunjucks/src/lib.js:36:11)
        at /Users/zuckerscharffa/Dev/context-center/node_modules/nunjucks/src/environment.js:563:19
        at eval (eval at _compile (/Users/zuckerscharffa/Dev/context-center/node_modules/nunjucks/src/environment.js:633:18), <anonymous>:19:11)
        at /Users/zuckerscharffa/Dev/context-center/node_modules/nunjucks/src/environment.js:571:11
        at eval (eval at _compile (/Users/zuckerschaeblockcrypto.com/linked/133982/world-wildlife-fund-pulls-conservation-focused-nft-project-after-backlash/index.html from ./src/archives.md (njk)
```

Ok, it looks like Twitter Object stuff is totally borked. I'll need to check media objects for a URL before I try and do any processing on them and return false if they don't have them.

That resolves a bunch of the errors, but my build is still failing. What now? Ok, setting my Nunjucks config to `throwOnUndefined` as false lets the site build. But if it is supposed to throw on undefined where is the error?

Ok, looks like my handling of filters in the standalone timeline item isn't working. I can fix that, but it is still failing. Something in the timeline-item I think.

I think I've got all the checks in place.

Now I need to make sure that I'm properly populating timeline entry pages with both timeline and timeline item info.

Here's the resulting object

```javascript
{
  defaults: {
    layout: 'default.njk',
    title: 'Site Title',
    description: 'Site Description'
  },
  site: {
    lang: 'en-US',
    github: { build_revision: 1, build_sha: 1 },
    site_url: 'http://localhost:8082',
    site_domain: 'context.center',
    site_name: 'Context Center',
    description: 'Context Center Description',
    featuredImage: 'context.center/img/nyc_noir.jpg',
    author: 'Aram Zucker-Scharff',
    authorPhoto: 'https://raw.githubusercontent.com/AramZS/aramzs.github.io/master/_includes/Aram-Zucker-Scharff-square.jpg'
  },
  timelinesConfig: {
    domainName: 'http://localhost:8082',
    timelineOutFolder: 'timeline',
    outDir: '/Users/zuckerscharffa/Dev/context-center/docs',
    layoutFolderDepth: '../../',
    timelinesInFolder: '/Users/zuckerscharffa/Dev/context-center/src/timeline',
    customCSS: 'assets/css/template-timeline.css',
    jsPath: 'http://localhost:8082/assets/timelines/js',
    cssPath: 'http://localhost:8082/assets/timelines/css'
  },
  globalTimelines: {
    covid: {
      timeline: 'covid',
      title: 'COVID Timeline',
      description: 'A Timeline about COVID as it was reported, maintained on Context Center',
      tags: [Array],
      categories: [Array],
      filters: [Array],
      doNotUseFilters: [Array],
      date: 'Last Modified',
      layout: 'timeline-standalone-item',
      header: "Let's talk about the history of COVID",
      color: 'grey',
      shortdate: false,
      slug: 'covid',
      timelineSlug: 'timeline-covid',
      timelineUrl: 'covid',
      timelineName: 'COVID Timeline',
      url: 'http://localhost:8082/timelines/covid',
      count: 68,
      lastUpdatedPost: 1661569183000
    },
    monkeypox: {
      timeline: 'monkeypox',
      title: 'Monkeypox Timeline',
      description: 'A Timeline about Monkeypox as it was reported, maintained on Context Center',
      tags: [Array],
      categories: [Array],
      filters: [Array],
      doNotUseFilters: [Array],
      date: 'Last Modified',
      layout: 'timeline-standalone-item',
      header: "Let's talk about the history of Monkeypox",
      color: 'grey',
      shortdate: false,
      slug: 'monkeypox',
      timelineSlug: 'timeline-monkeypox',
      timelineUrl: 'monkeypox',
      timelineName: 'Monkeypox Timeline',
      url: 'http://localhost:8082/timelines/monkeypox',
      count: 1,
      lastUpdatedPost: 0
    }
  },
  eleventy: {
    env: {
      config: '/Users/zuckerscharffa/Dev/context-center/.eleventy.js',
      root: '/Users/zuckerscharffa/Dev/context-center',
      source: 'cli'
    }
  },
  pkg: {
    name: 'context-center',
    version: '1.0.0',
    description: 'A center for context.',
    main: 'index.js',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
      build: 'eleventy',
      'build-with-log-debug': 'DEBUG=Eleventy:Template* npx @11ty/eleventy --serve --port=8082 2>&1 | tee ./buildlog.txt',
      'build-with-log': 'npx @11ty/eleventy --serve --port=8082 | tee ./buildlog.txt'
    },
    keywords: [],
    author: '',
    license: 'ISC',
    devDependencies: {
      '@11ty/eleventy': '^1.0.0',
      '@11ty/eleventy-navigation': '^0.2.0',
      '@11ty/eleventy-plugin-rss': '^1.1.1',
      '@quasibit/eleventy-plugin-sitemap': '^2.1.4',
      del: '^2.2.2',
      'markdown-it': '^10.0.0',
      'markdown-it-replace-link': '^1.1.0',
      sass: '^1.34.1'
    },
    dependencies: {
      '@11ty/eleventy-upgrade-help': '^1.0.1',
      'cross-spawn': '^7.0.3',
      dotenv: '^10.0.0',
      'eleventy-plugin-dart-sass': '^1.0.3',
      'eleventy-plugin-toc': '^1.1.5',
      'gray-matter': '^4.0.3',
      'link-contexter': '^0.5.1',
      'markdown-it-anchor': '^8.1.2',
      'markdown-it-find-and-replace': '^1.0.2',
      'markdown-it-regexp': '^0.4.0',
      'music-metadata': '^7.11.4',
      'normalize-path': '^3.0.0',
      nunjucks: '^3.2.3',
      'sanitize-filename': '^1.6.3',
      slugify: '^1.6.0'
    }
  },
  eleventyComputed: {
    applyThis: { timelineCheck: [Function: timelineCheck] },
    title: [Function: title],
    description: [Function: description],
    tags: [Function: tags],
    categories: [Function: categories],
    filters: [Function: filters],
    date: [Function: date],
    header: [Function: header],
    color: [Function: color],
    shortdate: [Function: shortdate],
    lastUpdatedPost: [Function: lastUpdatedPost]
  },
  layout: 'timeline-standalone-item',
  description: 'The GOP battles over a trillion-dollar stimulus deal. Ahead of the November election, President Trump guts a landmark environmental law. And, how to avoid a devastating potential kink in the vaccine supply chain.',
  tags: [
    'timeline',
    'Monkeypox',
    'Health',
    'Medicine',
    'Stimulus',
    'Markets'
  ],
  date: 2020-06-22T16:00:00.100Z,
  timeline: 'monkeypox',
  title: 'A looming deadline for tens of millions of Americans',
  categories: [ 'News' ],
  filters: [ 'USA' ],
  doNotUseFilters: [ '4 and under' ],
  header: "Let's talk about the history of Monkeypox",
  color: 'grey',
  shortdate: false,
  dateAdded: 2022-08-09T02:59:43.100Z,
  isBasedOn: 'https://www.washingtonpost.com/podcasts/post-reports/a-looming-deadline-for-tens-of-millions-americans/',
  page: {
    date: 2020-06-22T16:00:00.100Z,
    inputPath: './src/timeline/monkeypox/a-looming-deadline-for-tens-of-millions-americans.md',
    fileSlug: 'a-looming-deadline-for-tens-of-millions-americans',
    filePathStem: '/timeline/monkeypox/a-looming-deadline-for-tens-of-millions-americans',
    outputFileExtension: undefined,
    url: '/timeline/monkeypox/a-looming-deadline-for-tens-of-millions-americans/',
    outputPath: 'docs/timeline/monkeypox/a-looming-deadline-for-tens-of-millions-americans/index.html'
  },
  collections: {},
  applyThis: { timelineCheck: '' },
  lastUpdatedPost: ''
}
```

Ok, have to do some translation from the globalTimeline object to the post context. The next step is setting up the `entry` object.

`git commit -am "Progressing timeline with fixes to contexter plugin and translating the object of the top timeline properly"`
