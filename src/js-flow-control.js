// first pass.
// 
// # Flow control
// 
// Doing the thing. Same thing on client and server.
// 
// ### 1. Flow control options
// 
// * node-style callbacks (continuation passing style)
// * promises
// * deferreds
// * pub-sub (publishing and subscribing to events)
//   * single global event registry
//   * subscribe to events directly on objects of interest (old-skool Observer pattern)
// 
// ### 2. Some examples to motivate comparison
// 
// Hoepfully pull these from the browserid codebase
// 
// ### 3. Pros and Cons of each approach applied to each example
// 
// There's no one right answer for every case. But we can pare down to 2-3 options to use everywhere. This makes our codebase so much easier to read.
// 
// ### 4. Wrapping up: which to use, when


// second pass. I'm tired of putting stuff in gists.

/*  TODO: add some code examples alongside the exposition as we flesh it out. */

/* a couple functions to get us started. */
/* TODO I really don't think this is a good set of functions for examples.
        Maybe we can get more realistic examples. let's look at other libs. */
function generateNum() { return 3 }
function generateDenom() { return 5 }
function divide(num, denom) { return num/denom }

/* why division? because you need num and denom to divide, or you'll get
   weird errors. */

/* we'll need an error detection function. note, 2/0 = Infinity in JS. */
function isNum(n) { return (typeof n == 'number') && isFinite(n) }

/* then what? */
function divideThrower(num, denom) {
  if (!isNum(num)) { throw new Error('numerator is not a number') }
  if (!isNum(denom)) { throw new Error('denominator is not a number') }
  var result = num/denom;
  if (!isNum(result)) { throw new Error('result is not a number') }
  return result;
}

// ## Flow control in JS.
// 
// - callbacks, including node-style.
//   - jQuery leads to this too: nested callbacks.
//   - this does not scale, is hard to change later, hard to handle errors/exceptions, hard to pass args to inner cbs (have to add args to inner cb's signature or use global state).
//   - **most tightly-coupled. easiest to use quickly.**



// 
// - pubsub
//   - a few variations here.
//   - client-side only: publish custom events in DOM.
//     - this lets parent nodes listen for custom events fired by child nodes that are dynamically-created.
//     - requires a DOM
//     - penalty to go JS -> DOM -> JS: several ticks of the event loop.
//     - works for apps that use jQuery-style "the DOM is the data store" approach
//     - forget this for us (we want the same system server + client), just being complete.
//   - observer pattern.
//   - 2 variations:
//     - **global event broker**
//       - every object subs + pubs on a global.
//       - extremely late-bound: objs created later can be observed indirectly by objects created earlier
//       - OTOH: no guarantee an event will ever get fired, you might typo it, etc
//     - **direct observer**
//       - every object has publishing powers, objs observe each other directly
//       - have to initialize all objects first, in order to wire up listeners.
//       - this can be mitigated using queues or deferreds:
//         - objq = list of [subscriber, 'signal']
//         - onObjReady = deferred. fires when obj is ready, then you subscribe:
//           onObjReady.then(function(obj) {
//             obj.on('whatever', bind(otherObj, otherObj.onWhateverFired) 
//           })
// 
// - deferreds: lightweight broker of CBs
//   - when(x) do (a bunch of things at once)
//     - if x is already ready, just do stuff right away.
//   - if you get an error instead of success?
//     - either subscribe to failure state separately
//     - or handle the 2 cases inside the single registered callback
// - promises: lightweight sequencer of CBs
//   - when(x) then(y)
//   - 'then' returns a new promise, so it's chainable:
//   - when(x).then(y).then(z)
//   - can subscribe a single error handler within a flow:
//     when(x).then(y).err(handleXAndYErrors).then(z)
