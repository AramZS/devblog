---
title: Grab this
layout: post
eleventyExcludeFromCollections: true
---

## Refresh handling

<a id="zeus-refresh-freezer" class="bookmarklet" href="javascript:(function()%7Bwindow.zeus.emit(%22GLOBAL_AD_REFRESH_STOP%22)%3B%0Aalert('Stoping%20Zeus%20Refresh')%3B%7D)()%3B">Stop Zeus Refresh</a>

## Speach recognition

Some script here.

<script>
	SpeechRecognition.available({ langs: ["en-US"], processLocally: true }).then(
    (result) => {
        console.log('go')
      if (result === "unavailable") {
        console.log('not available')
      } else if (result === "available") {
        //recognition.start();
        console.log("Ready to receive a color command.");
      } else {
        console.log('downloading')
        SpeechRecognition.install({
          langs: ["en-US"],
          processLocally: true,
        }).then((result) => {
          if (result) {
            console.log(`1 en-US language pack downloaded. Try again.`);
          } else {
            console.log(`en-US language pack failed to download. Try again later.`);
          }
        });
      }
    },
  );
</script>
