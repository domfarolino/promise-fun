let sequenceChain = Promise.resolve();

function displayData(storyText) {
  console.timeStamp('Writing to body');
  document.body.innerText += storyText;
}

function loadStories(urls) {
  // Kicks off all downloads concurrently
  let storyPromises = urls.map(url => fetch(url));

  /**
   * Using reduce essentially does the same thing. This
   * is really because we're using them very similarly.
   * First we're starting out with some dummy sentinal promise
   * and we're synchronously building a Promise chain which will
   * fulfill asynchronously, as usual.
   */
  // storyPromises.reduce((sequence, story) => {
  //   return sequence.then(_ => {
  //     return story;
  //   }).then(displayData);
  // }, Promise.resolve());

  // This gives us sequential behavior
  storyPromises.forEach(storyPromise => {
    sequenceChain = sequenceChain.then(_ => {
      return storyPromise;
    })
    .then(storyResponse => storyResponse.text())
    .then(displayData);
  })
}

let storyUrls = fetch('stories.json');

storyUrls.then(response => response.json()).then(loadStories);