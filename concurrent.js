function displayData(storyTexts) {
  storyTexts.forEach((storyText, i) => {
    console.timeStamp('Writing to body');
    document.body.innerText += storyText;
  })
}

function loadStories(urls) {
  let storyPromises = urls.map(url => fetch(url));
  Promise.all(storyPromises)
    .then(storyResponses => {
      return Promise.all(storyResponses.map(storyResponse => storyResponse.text()))
    })
    .then(displayData);
}

let storyUrls = fetch('stories.json');

storyUrls.then(response => response.json()).then(loadStories);