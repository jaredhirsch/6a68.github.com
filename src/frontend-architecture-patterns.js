// ## Front-end architecture choices

// People tend to evangelize particular tools or libraries or frameworks that
// they love and work on, often without explaining the types of problems their
// tool or library or framework is good (or bad) at solving.

// This is an attempt to concisely explain the trade-offs you might make, when
// you are deciding how to build out html/js front-end code, in order to build
// the right thing for the application and product goals at hand.

// * templating on client or on server (or both)
//      * duplicate templating code doubles front-end work to build or change 
//        features, and requires twice as much work to find all the bugs.
//      * if you're building a heavyweight web app, you'll need to draw and
//        redraw a lot of templates on the client, so it might make sense to
//        keep the templating logic in pure JS.
//           * if you render on the client, you'll have a huge wait for the first
//             page load (as seen in new twitter), since all that JS takes time to
//             download, parse, and execute. So it's a good idea to also be able to
//             render your JS code on the client, using either Rhino (Java stack)
//             or Node (C stack). Doing this also makes it possible to use your site,
//             at least in some limited way, without JS in the client.
//      * if you're building a page-oriented site, where JS is used mainly for
//        kewl visual effects and a little bit of interactivity, it's often simpler
//        to keep the templating logic on the server. If you need to render html
//        dynamically, you can fire an xhr with the data, and pull back the html
//        rendered by the server, then innerHTML that into the document.
// * events vs callbacks
//      * nested callbacks are the front-end equivalent of mind-bending multithreaded
//        server code with lots of state shared between threads: it's super easy to
//        write buggy code that's a nightmare to read later. If you're nesting more 
//        than two callbacks deep, you should switch to using pubsub events.
//      * if using events, central event registry vs objects directly Observing each other
// * app state in DOM vs JS
//      * again, comes down to whether you're building something light or heavyweight.
// * dependency management
//      * if you need to support mobile and desktop experiences, and your product is
//        well-established enough that you have the time to optimize download speed,
//        it's useful to have a very granular dependency system, so you can serve
//        the minimal needed amount of code to handset/tablet/desktop clients.
// * just need DOM abstraction vs need DOM abstraction plus a widgeting framework
//      * this is jQuery vs Bootstrap+jQuery vs YUI3/Dojo, going down the road from 
//        tools well-suited for lightweight interactions or prototyping, towards
//        tools able to handle heavyweight reusability and standardization.
