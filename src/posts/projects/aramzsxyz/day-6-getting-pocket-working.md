---
title: XYZ Site - Day 6 - Starting to rebuild Pocket exporting.
description: "I have too many things saved into Pocket right now, so I can't export a file anymore. I've got to figure out their API instead."
date: 2024-11-20 17:59:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - CSV
  - CSVs
  - async
  - JSON
  - Pocket
  - CLI
---

## Project Scope and ToDos

1. Create a versatile blog site
2. Create a framework that makes it easy to add external data to the site

- [ ] Give the site the capacity to replicate the logging and rating I do on Serialized and Letterboxd.
- [x] Be able to pull down RSS feeds from other sites and create forward links to my other sites
- [x] Create forward links to sites I want to post about.
- [ ] Create a way to pull in my Goodreads data and display it on the site
- [ ] Create a way to automate pulls from other data sources
- [x] Combine easy inputs like text lists and JSON data files with markdown files that I can build on top of.
- [x] Add a TMDB credit to footer in base.njk
- [x] Make sure tags do not repeat in the displayed tag list.
- [x] Get my Kindle Quotes into the site
- [ ] YouTube Channel Recommendations

## Day 6

Time to fix my broken processing of Pocket exports. Let's start with using a CLI auth tool. That will be the node Pocket API CLI tool. I can use that plus a dotenv CLI package to pass in the consumer key from a `.env` file without committing it.

```json
{
	...
    "write:pocket-info-user": "node -e \"console.log('POCKET_UN=\\\"'+$(sed '3q;d' .env-json.json).username.trim()+'\\\"');\" >> .env",
    "write:pocket-info-access": "node -e \"console.log('ACCESS_TOKEN=\\\"'+$(sed '3q;d' .env-json.json).access_token.trim()+'\\\"');\" >> .env",
    "activate:pocket": "node_modules/pocket-auth-cli/bin/pocket-auth $CON_KEY > .env-json.json && total_string=\"CON_KEY=\\\"$CON_KEY\\\"\" && echo $total_string > .env && npm run write:pocket-info-access && npm run write:pocket-info-user && node -e 'var w = require(\"./bin/enrichers/pocket-api.js\"); w.writeAmplify()'",
    "get:pocket": "node node_modules/dotenv-cli/cli.js -- npm run activate:pocket"
```

Now I can process the resulting variables that this process has written into my .env file in my JS code.

```js

const processPocketExport = async () => {
  require('dotenv').config()

  let consumer_key = process.env.CON_KEY;
  let access_token = process.env.ACCESS_TOKEN;

  let pocket = new getPocket(consumer_key);
  //sets access_token
  pocket.setAccessToken(access_token)
  const pocketConfigForGet = {
    state: 'all',
    sort: 'newest',
    detailType: 'complete',
    count: 4,
    offset: 0
  }
  //returns articles
  let response = await pocket.getArticles(pocketConfigForGet)

  console.log(response);

};
```

This gives me the results from the read API endpoint from Pocket.

```js
{
  maxActions: 30,
  cachetype: 'db',
  status: 1,
  error: null,
  complete: 1,
  since: 1732166480,
  list: {
    '4136799598': {
      item_id: '4136799598',
      favorite: '0',
      status: '1',
      time_added: '1732155928',
      time_updated: '1732178996',
      time_read: '1732178996',
      time_favorited: '0',
      sort_id: 0,
      tags: [Object],
      top_image_url: 'https://unwinnable.com/wp-content/uploads/2024/11/Springer.jpg',
      resolved_id: '4136799598',
      given_url: 'https://unwinnable.com/2024/11/19/a-nightmare-on-valleyfield-drive/',
      given_title: 'A Nightmare on Valleyfield Drive - Unwinnable | Unwinnable',
      resolved_title: 'A Nightmare on Valleyfield Drive',
      resolved_url: 'https://unwinnable.com/2024/11/19/a-nightmare-on-valleyfield-drive/',
      excerpt: 'This column is a reprint from Unwinnable Monthly #180. If you like what you see, grab the magazine for less than ten dollars, or subscribe and get all future magazines for half price. Now this.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '1',
      word_count: '1136',
      lang: 'en',
      time_to_read: 5,
      listen_duration_estimate: 440,
      authors: [Object],
      domain_metadata: [Object],
      images: [Object],
      image: [Object]
    },
    '4137300187': {
      item_id: '4137300187',
      favorite: '0',
      status: '0',
      time_added: '1732153566',
      time_updated: '1732153582',
      time_read: '0',
      time_favorited: '0',
      sort_id: 2,
      tags: [Object],
      top_image_url: 'https://static.politico.com/dims4/default/55a1666/2147483647/resize/1200/quality/100/?url=https://static.politico.com/1a/5c/71191d2044058aaf12b82f49e34e/trump-73479.jpg',
      resolved_id: '4137300187',
      given_url: 'https://www.eenews.net/articles/trump-allies-want-to-resurrect-red-teams-to-question-climate-science/',
      given_title: 'Trump allies want to resurrect ‘red teams’ to question climate science - E&',
      resolved_title: 'Trump allies want to resurrect ‘red teams’ to question climate science',
      resolved_url: 'https://www.eenews.net/articles/trump-allies-want-to-resurrect-red-teams-to-question-climate-science/',
      excerpt: 'The second Trump administration may take a page out of military strategy to challenge established climate science.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '1',
      word_count: '922',
      lang: 'en',
      time_to_read: 4,
      listen_duration_estimate: 357,
      authors: [Object],
      domain_metadata: [Object],
      images: [Object],
      image: [Object]
    },
    '4137356790': {
      item_id: '4137356790',
      favorite: '0',
      status: '0',
      time_added: '1732154258',
      time_updated: '1732154263',
      time_read: '0',
      time_favorited: '0',
      sort_id: 1,
      tags: [Object],
      top_image_url: 'https://webapi.project-syndicate.org/library/3df3445c1d2626e11bbfe7756d7d1039.2-1-super.1.jpg',
      resolved_id: '4137356790',
      given_url: 'https://www.project-syndicate.org/commentary/illusion-of-soil-carbon-offsets-by-sophie-scherger-2024-11',
      given_title: "Carbon Farming Won't Save the Planet by Sophie Scherger - Project Syndicate",
      resolved_title: "Carbon Farming Won't Save the Planet",
      resolved_url: 'https://www.project-syndicate.org/commentary/illusion-of-soil-carbon-offsets-by-sophie-scherger-2024-11',
      excerpt: 'At first glance, funding climate action through soil carbon credits instead of taxpayer dollars may seem like a win-win solution. But real-world evidence suggests that improving soil health and supporting farmers as they adapt to more sustainable practices would be far more effective.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '1',
      word_count: '795',
      lang: 'en',
      time_to_read: 4,
      listen_duration_estimate: 308,
      domain_metadata: [Object],
      images: [Object],
      image: [Object]
    },
    '4137436970': {
      item_id: '4137436970',
      favorite: '0',
      status: '0',
      time_added: '1732153374',
      time_updated: '1732153395',
      time_read: '0',
      time_favorited: '0',
      sort_id: 3,
      tags: [Object],
      top_image_url: 'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2024/11/80-hrs-lifestyle-inc_c2044e.jpg',
      resolved_id: '4137436970',
      given_url: 'https://www.inc.com/sam-blum/this-22-year-old-tech-ceo-says-an-80-hour-work-week-is-a-lifestyle-choice-it-earned-him-death-threats-and-job-seekers/91022060',
      given_title: 'This 22-Year-Old Tech CEO Says an 80-Hour Work Week Is a Lifestyle Choice. ',
      resolved_title: 'This 22-Year-Old Tech CEO Says an 80-Hour Work Week Is a Lifestyle Choice. It Earned Him Death Threats. And Job Seekers.',
      resolved_url: 'https://www.inc.com/sam-blum/this-22-year-old-tech-ceo-says-an-80-hour-work-week-is-a-lifestyle-choice-it-earned-him-death-threats-and-job-seekers/91022060',
      excerpt: 'Daksh Gupta, the 22-year-old founder of Greptile, a San Francisco-based enterprise software company, posted on X earlier this month that his firm “offers no work-life-balance.” The typical day is a 14-hour slog, and employees often work weekends.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '0',
      word_count: '702',
      lang: 'en',
      time_to_read: 3,
      listen_duration_estimate: 272,
      authors: [Object],
      domain_metadata: [Object]
    }
  }
}
```

I want to fully expand the objects so I know what I'm working with. Let's use `util.inspect` here: `console.log(util.inspect(response, {showHidden: false, depth: null, colors: true}))`

Got it!

```js
{
  maxActions: 30,
  cachetype: 'db',
  status: 1,
  error: null,
  complete: 1,
  since: 1732167050,
  list: {
    '4136799598': {
      item_id: '4136799598',
      favorite: '0',
      status: '1',
      time_added: '1732155928',
      time_updated: '1732178996',
      time_read: '1732178996',
      time_favorited: '0',
      sort_id: 0,
      tags: { culture: { tag: 'culture', item_id: '4136799598' } },
      top_image_url: 'https://unwinnable.com/wp-content/uploads/2024/11/Springer.jpg',
      resolved_id: '4136799598',
      given_url: 'https://unwinnable.com/2024/11/19/a-nightmare-on-valleyfield-drive/',
      given_title: 'A Nightmare on Valleyfield Drive - Unwinnable | Unwinnable',
      resolved_title: 'A Nightmare on Valleyfield Drive',
      resolved_url: 'https://unwinnable.com/2024/11/19/a-nightmare-on-valleyfield-drive/',
      excerpt: 'This column is a reprint from Unwinnable Monthly #180. If you like what you see, grab the magazine for less than ten dollars, or subscribe and get all future magazines for half price. Now this.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '1',
      word_count: '1136',
      lang: 'en',
      time_to_read: 5,
      listen_duration_estimate: 440,
      authors: {
        '95063516': {
          author_id: '95063516',
          name: 'Noah Springer',
          url: 'https://unwinnable.com/author/noah-springer/',
          item_id: '4136799598'
        }
      },
      domain_metadata: { name: 'unwinnable.com' },
      images: {
        '1': {
          item_id: '4136799598',
          image_id: '1',
          src: 'https://unwinnable.com/wp-content/uploads/2024/10/UM180.jpg',
          width: '314',
          height: '443',
          credit: '',
          caption: ''
        },
        '2': {
          item_id: '4136799598',
          image_id: '2',
          src: 'https://unwinnable.com/wp-content/uploads/2024/11/Springer-2-794x412.png',
          width: '794',
          height: '412',
          credit: '',
          caption: ''
        }
      },
      image: {
        item_id: '4136799598',
        src: 'https://unwinnable.com/wp-content/uploads/2024/10/UM180.jpg',
        width: '314',
        height: '443'
      }
    },
    '4137300187': {
      item_id: '4137300187',
      favorite: '0',
      status: '0',
      time_added: '1732153566',
      time_updated: '1732153582',
      time_read: '0',
      time_favorited: '0',
      sort_id: 2,
      tags: { climate: { tag: 'climate', item_id: '4137300187' } },
      top_image_url: 'https://static.politico.com/dims4/default/55a1666/2147483647/resize/1200/quality/100/?url=https://static.politico.com/1a/5c/71191d2044058aaf12b82f49e34e/trump-73479.jpg',
      resolved_id: '4137300187',
      given_url: 'https://www.eenews.net/articles/trump-allies-want-to-resurrect-red-teams-to-question-climate-science/',
      given_title: 'Trump allies want to resurrect ‘red teams’ to question climate science - E&',
      resolved_title: 'Trump allies want to resurrect ‘red teams’ to question climate science',
      resolved_url: 'https://www.eenews.net/articles/trump-allies-want-to-resurrect-red-teams-to-question-climate-science/',
      excerpt: 'The second Trump administration may take a page out of military strategy to challenge established climate science.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '1',
      word_count: '922',
      lang: 'en',
      time_to_read: 4,
      listen_duration_estimate: 357,
      authors: {
        '1289487': {
          author_id: '1289487',
          name: 'SCOTT WALDMAN',
          url: '',
          item_id: '4137300187'
        }
      },
      domain_metadata: { name: 'www.eenews.net' },
      images: {
        '1': {
          item_id: '4137300187',
          image_id: '1',
          src: 'https://static.politico.com/dims4/default/55a1666/2147483647/resize/600/quality/100/?url=https://static.politico.com/1a/5c/71191d2044058aaf12b82f49e34e/trump-73479.jpg',
          width: '0',
          height: '0',
          credit: '',
          caption: 'President-elect Donald Trump speaks during a meeting with the House Republican Conference in Washington on Nov. 13. Pool photo by Allison Robbert'
        }
      },
      image: {
        item_id: '4137300187',
        src: 'https://static.politico.com/dims4/default/55a1666/2147483647/resize/600/quality/100/?url=https://static.politico.com/1a/5c/71191d2044058aaf12b82f49e34e/trump-73479.jpg',
        width: '0',
        height: '0'
      }
    },
    '4137356790': {
      item_id: '4137356790',
      favorite: '0',
      status: '0',
      time_added: '1732154258',
      time_updated: '1732154263',
      time_read: '0',
      time_favorited: '0',
      sort_id: 1,
      tags: { climate: { tag: 'climate', item_id: '4137356790' } },
      top_image_url: 'https://webapi.project-syndicate.org/library/3df3445c1d2626e11bbfe7756d7d1039.2-1-super.1.jpg',
      resolved_id: '4137356790',
      given_url: 'https://www.project-syndicate.org/commentary/illusion-of-soil-carbon-offsets-by-sophie-scherger-2024-11',
      given_title: "Carbon Farming Won't Save the Planet by Sophie Scherger - Project Syndicate",
      resolved_title: "Carbon Farming Won't Save the Planet",
      resolved_url: 'https://www.project-syndicate.org/commentary/illusion-of-soil-carbon-offsets-by-sophie-scherger-2024-11',
      excerpt: 'At first glance, funding climate action through soil carbon credits instead of taxpayer dollars may seem like a win-win solution. But real-world evidence suggests that improving soil health and supporting farmers as they adapt to more sustainable practices would be far more effective.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '1',
      word_count: '795',
      lang: 'en',
      time_to_read: 4,
      listen_duration_estimate: 308,
      domain_metadata: {
        name: 'Project Syndicate',
        logo: 'https://logo.clearbit.com/project-syndicate.org?size=800'
      },
      images: {
        '1': {
          item_id: '4137356790',
          image_id: '1',
          src: 'https://webapi.project-syndicate.org/library/becdb3b63fbb8839238df869cc13153b.16-9-medium.1.jpg',
          width: '480',
          height: '270',
          credit: '',
          caption: ''
        },
        '2': {
          item_id: '4137356790',
          image_id: '2',
          src: 'https://webapi.project-syndicate.org/library/0afd4a7f1b2009d4f8b8754a84559f53.16-9-medium.1.jpg',
          width: '480',
          height: '270',
          credit: '',
          caption: ''
        },
        '3': {
          item_id: '4137356790',
          image_id: '3',
          src: 'https://webapi.project-syndicate.org/library/5e3b73dbaa2e26d472a8786e4bcf9407.16-9-medium.1.jpg',
          width: '480',
          height: '270',
          credit: '',
          caption: ''
        },
        '4': {
          item_id: '4137356790',
          image_id: '4',
          src: 'https://webapi.project-syndicate.org/library/5150820f497697cf28b3c6ee415a4618.16-9-medium.1.jpg',
          width: '480',
          height: '270',
          credit: '',
          caption: ''
        }
      },
      image: {
        item_id: '4137356790',
        src: 'https://webapi.project-syndicate.org/library/becdb3b63fbb8839238df869cc13153b.16-9-medium.1.jpg',
        width: '480',
        height: '270'
      }
    },
    '4137436970': {
      item_id: '4137436970',
      favorite: '0',
      status: '0',
      time_added: '1732153374',
      time_updated: '1732153395',
      time_read: '0',
      time_favorited: '0',
      sort_id: 3,
      tags: {
        labor: { tag: 'labor', item_id: '4137436970' },
        tech: { tag: 'tech', item_id: '4137436970' }
      },
      top_image_url: 'https://img-cdn.inc.com/image/upload/f_webp,q_auto,c_fit/vip/2024/11/80-hrs-lifestyle-inc_c2044e.jpg',
      resolved_id: '4137436970',
      given_url: 'https://www.inc.com/sam-blum/this-22-year-old-tech-ceo-says-an-80-hour-work-week-is-a-lifestyle-choice-it-earned-him-death-threats-and-job-seekers/91022060',
      given_title: 'This 22-Year-Old Tech CEO Says an 80-Hour Work Week Is a Lifestyle Choice. ',
      resolved_title: 'This 22-Year-Old Tech CEO Says an 80-Hour Work Week Is a Lifestyle Choice. It Earned Him Death Threats. And Job Seekers.',
      resolved_url: 'https://www.inc.com/sam-blum/this-22-year-old-tech-ceo-says-an-80-hour-work-week-is-a-lifestyle-choice-it-earned-him-death-threats-and-job-seekers/91022060',
      excerpt: 'Daksh Gupta, the 22-year-old founder of Greptile, a San Francisco-based enterprise software company, posted on X earlier this month that his firm “offers no work-life-balance.” The typical day is a 14-hour slog, and employees often work weekends.',
      is_article: '1',
      is_index: '0',
      has_video: '0',
      has_image: '0',
      word_count: '702',
      lang: 'en',
      time_to_read: 3,
      listen_duration_estimate: 272,
      authors: {
        '182809703': {
          author_id: '182809703',
          name: 'Sam Blum',
          url: 'https://www.inc.com/author/sam-blum',
          item_id: '4137436970'
        }
      },
      domain_metadata: {
        name: 'Inc. Magazine',
        logo: 'https://logo.clearbit.com/inc.com?size=800'
      }
    }
  }
}
```

Ok, so now I need to figure out a way to walk through as much of the Pocket API output as possible, avoid re-writing files I've already written, and transform these objects into the flat files I want to output.
