---
title: XYZ Site - Day 19 - Setting up the tools for writing to ATProto
description: "Getting my blog posts set up in the atmosphere"
date: 2026-02-15 11:01:43.10 -4
tags:
  - 11ty
  - Node
  - SSG
  - WiP
  - APIs
  - Social Media
  - ATProto
  - ATmosphere
  - decentralization
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
- [x] Minify HTML via Netlify plugin.
- [ ] Log played games

## Day 19

Ok, so I'm going to start setting up the unit tests now to build up to the functionality I want.

Here's the first two, initiating my connection and getting posts:

```js
test('checkPDSForPosts returns the correct number of posts', async () => {
	let connectionManager = await getConnection();
	if (false == connectionManager) {
		throw new Error("connection manager failed");

	}
	const posts = await checkPDSForPosts(10, 'app.bsky.feed.post', connectionManager.rpc, connectionManager.manager, connectionManager.config);
	expect(posts.length).toBe(10);
})

test('Can get a specific post with getSpecificRecord', async () => {
	let connectionManager = await getConnection();
	if (false == connectionManager) {
		throw new Error("connection manager failed");
	}
	const { rpc, manager, config } = connectionManager;
	const rkey = '3kulbtuuixs27'; // Replace with a valid rkey
	const post = await getSpecificRecord(rkey, rpc, config.handle, 'app.bsky.feed.post');
	expect(post).toBeDefined();
	expect(post.value).toBeDefined();
	console.log(post);
	expect(post.value.createdAt).toBe("2024-06-10T14:27:41.118Z");
});
```

This all works well, so we've got the basics.

The next step is to look at function `pushOrUpsertPost` and get that working.

I was hoping there would be some sort of search function in the PDS, and I'm [not the only one](https://github.com/bluesky-social/atproto/discussions/2565). [There's a good walkthrough of the basics for the ATmosphere here](https://mozzius.dev/post/3ljlqmchv2b2a) that is a place to start up, as is [the data model](https://atproto.com/specs/data-model). The protocol does seem to indicate [there is no standard for search that exists at the protocol level](https://atproto.com/guides/overview#algorithmic-choice). There's a [listener](https://lexidex.bsky.dev/) for Lexicons. But [most](https://atproto-browser.vercel.app/) things are looking for specific posts.

I guess no real option for that other than building my own index, which is not the way to go for this project. I'll have to make sure I save rkey values into the files that they are mapped to.

I'll need to generate TIDs consistently, that should be its own function too, that will let me configure it more effectively.

Let's cover that with tests too:

```js
test('can generate a TID consistently with a record', () => {
	const record = { date: "2024-06-10T14:27:41.118Z" };
	const tid = generateTID(record);
	expect(tid).toBeDefined();
	const tid2 = generateTID(record);
	expect(tid).toBe(tid2);
});

test('can generate TIDs without a record', async () => {
	const tid = generateTID(null);
	expect(tid).toBeDefined();
	await new Promise(resolve => setTimeout(resolve, 1000));
	const tid2 = generateTID(null);
	expect(tid).not.toBe(tid2);
});
```

### Let's do the insert!

Let's run a test to insert the first record:

```js
test('update a post with pushOrUpsertPost', async () => {
	let connectionManager = await getConnection();
	if (false == connectionManager) {
		throw new Error("connection manager failed");
	}
	const { rpc, manager, config } = connectionManager;
	const lex = 'test.record.activity';

	const record = {
		$type: lex,
		type: 'test',
		date: new Date(),
		testProject: 'marksky-pub',
		testContext: 'ts-vitest',
		testOwner: 'AramZS'
	}

	let result = await pushOrUpsertPost(false, rpc, config.handle, lex, record);
	expect(result).toBeDefined();
	expect(result.rKey).toBeDefined();
	expect(result.resultRecord).toBeDefined();

});
```

That [worked](https://pdsls.dev/at://did:plc:t5xmf33p5kqgkbznx22p7d7g/test.record.activity/3mewhxxahis3h)! We can take the rkey `3mewhxxahis3h` and pull it in so this gets upsert (hopefully).

### Let's do the update

Update the test to:

```js
test('update a post with pushOrUpsertPost', async () => {
	let connectionManager = await getConnection();
	if (false == connectionManager) {
		throw new Error("connection manager failed");
	}
	const { rpc, manager, config } = connectionManager;
	const lex = 'test.record.activity';

	const record = {
		$type: lex,
		type: 'test',
		date: new Date(),
		testProject: 'marksky-pub',
		testContext: 'ts-vitest',
		testOwner: 'AramZS',
		insertStatus: 'upsert'
	}

	let result = await pushOrUpsertPost('3mewhxxahis3h', rpc, config.handle, lex, record);
	expect(result).toBeDefined();
	expect(result.rKey).toBeDefined();
	expect(result.resultRecord).toBeDefined();

});
```

Looks like this uploaded!

```bash
Uploaded activity with rkey: 3mewhxxahis3h {
  uri: 'at://did:plc:t5xmf33p5kqgkbznx22p7d7g/test.record.activity/3mewhxxahis3h',
  cid: 'bafyreifkiskhiuv6bf2jrskn2xkdpyi4yf2fq54k56z3gxcaczhkz6jqbu',
  value: {
    date: '2026-02-15T21:25:55.735Z',
    type: 'test',
    '$type': 'test.record.activity',
    testOwner: 'AramZS',
    testContext: 'ts-vitest',
    testProject: 'marksky-pub'
  }
}
```

But it isn't adding the additional property or changing the date value? It isn't [on the raw record either](https://lionsmane.us-east.host.bsky.network/xrpc/com.atproto.repo.getRecord?repo=did:plc:t5xmf33p5kqgkbznx22p7d7g&collection=test.record.activity&rkey=3mewhxxahis3h).

Hmmm. I had assumed it is possible, but is it not? I see that [one coder verdverm created a flow that copies, deletes, and inserts a new version of the record](https://verdverm.com/blog/adding-record-editing-with-history-to-atprotocol). Nothing in [the posts examples for BlueSky](https://docs.bsky.app/docs/advanced-guides/posts). I'll ask. But this is going well.

Next step will be being able to grab a Markdown file and manipulate it to pull from and push the rkey to. I'll need to handle when it is already there, maybe comparing the values and then only handling updates when the file is changed? After that we'll want to scan a specified directory for markdown files.

I think maybe I need to get the original record, pull the `cid` from a top-level object like

```json
{
  "uri": "at://did:plc:t5xmf33p5kqgkbznx22p7d7g/test.record.activity/3mewhxxahis3h",
  "cid": "bafyreifkiskhiuv6bf2jrskn2xkdpyi4yf2fq54k56z3gxcaczhkz6jqbu",
  "value": {
    "date": "2026-02-15T21:25:55.735Z",
    "type": "test",
    "$type": "test.record.activity",
    "testOwner": "AramZS",
    "testContext": "ts-vitest",
    "testProject": "marksky-pub"
  }
}
```

and then pass it into a field on the record at [swapCommit](https://docs.bsky.app/docs/api/com-atproto-repo-put-record)?

I think that's what I'm seeing in the verdverm example:

```js
  let i: PutRecordInputSchema = {
    repo,
    collection,
    rkey,
    record,
  }
  if (swapCommit) {
    i.swapCommit = swapCommit
  }
  if (swapRecord) {
    i.swapRecord = swapRecord
  }

  return agent.com.atproto.repo.putRecord(i)
```

Oh wait, my fkup here. Forgot to put the right flow in.

Ok, I now have a full update-record flow for atproto here:

```js

export const generateTID = (record: any) => {
	let recordDate: Date;
	if (record){
		recordDate = record.date ? new Date(record.date) : new Date();
	} else {
		recordDate = new Date();
	}
	let recordInMS = recordDate.getTime(); // This returns ms right?
	// needs to go from milliseconds to microseconds.
	return TID.create(recordInMS * 1000, CLOCK_ID);
}

export const putRecord = async (input: any) => await ok(rpc.post('com.atproto.repo.putRecord' as any, {
			input
		}));

export const pushOrUpsertPost = async (origRkey: string | false, rpc: Client, handle: string, collection: string, recordData: any) => {
	//Creates that unique key from the startTime of the activity so we don't have duplicates
	let rKey = origRkey ? origRkey : generateTID(recordData)
	let newRecord = origRkey ? false : true;
	console.log(`Using rkey: ${rKey}. New status: ${newRecord}`);
	//let resultRKey = rKey;
	let resultRecord;
	let inputObj = {
				repo: handle,
				collection,
				rkey: rKey,
				record: recordData,
			}

	if(!newRecord){
		// resultRecord = await getSpecificRecord(rKey, rpc, handle, collection);
		console.log('updating record')
		resultRecord = await putRecord(inputObj);
	} else {
		resultRecord = await putRecord(inputObj);
	}
	console.log(`Uploaded activity with rkey: ${rKey}`, resultRecord);
	return {rKey, resultRecord};
};
```

On the ATProto Touchers discord, user Nelind gave me the heads up on what swap is used for:

> swapRecord and swapCommit essentially say "only perform this update if ..." swapRecord being if the current value of the record is the value provided and swapCommit being if the current commit has the CID provided
>
> basically you can say you only want to update if no other client has changed either the record you want to update or the repo as a whole since last you saw it
>
> you use it to avoid overriding changes other sessions have made or write invalid data due to changes to other records that other sessions have made

Useful and good to know. Maybe this is something I'll want to use if I want a more complex but foolproof updating flow.
