At first I visualized the sequence creator looking something like this:

```js
let sequenceChain = Promise.resolve();

function loadStories(urls) {
  urls.forEach(url => {
    sequenceChain = sequenceChain.then(data => {
      ui.displayData(data);
      return fetch();
    })
  })
}
```

However there an issue with the above. On the very first iteration, `sequenceChain` certainly is `.then`able, however it does not give us any data. To get around this while
keeping the same sequence of events you'd have to make some flag telling `ui.displayData(data)` not to write to the screen if the there is no data. This handles the
`Promise.resolve()` we get in the beginning but it's a hack and we can do better. Given my assumptions, the sequence of events in the above is like this:

 - Assume we have data (but protect ourselves if we don't)
 - Do something with the data
 - Return a data promise for the next loop
 - Assume we ...
 - Do something ...
 - ... ... ...

This is kind of naive though. We know we're starting with a `Promise.resolve()`, so assuming we have data at the beginning of every iteration is kinda dumb. Sure all of the
subsequent loops start out with data, but it doesn't jive well with the `Promise.resolve()` that we're using to kick everything off. Instead, we can do one extra step in the
loop above and have a new workflow:

 - Start out with nothing
 - Return a data promise
 - Do something with the data
 - Display the data, return nothing

Instead of returning a promise for some data at the end of a loop and `.then`ing off of it in the next iteration, we can just return the promise in the middle of the loop, and
add also `.then` off of it in the middle of that same iteration. I think the reason I didn't choose this at first is because I was letting the construct of an iterative loop
mess with the async workflow in my head. For some reason it felt better to return the big promise at the end of the loop, probably because I was thinking (though I did know better)
that the next iteration would only start when the promise is fulfilled, and therefore if we stuck a return for the big promise in the middle of a loop, it would halt everything and
clog it up! This was naive, in that this loop is not an async iterator or anything, it is a plain synchronous loop that completely fulfills before ANY async content in the `.then()`
handlers are evaluated. This is the proper way to think about this. Arghh Dom.