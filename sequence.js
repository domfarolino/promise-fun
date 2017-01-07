let sequenceChain = Promise.resolve();

function displayData(text) {
  console.timeStamp('Writing to body');
  document.body.innerText += text;
}

function loadStories(urls) {
  urls.forEach(url => {
    sequenceChain = sequenceChain.then(_ => {
      return fetch(url);
    })
    .then(storyResponse => storyResponse.text())
    .then(displayData);
  })
}

let storyUrls = fetch('stories.json');

storyUrls.then(response => response.json()).then(loadStories);