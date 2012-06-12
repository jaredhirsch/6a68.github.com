//  messing around with combinators, functional programming, and javascript.
/* there's a bluebird in my heart that
   wants to get out
                            -- Bukowski */

// outline in brief:
//
// * production-strength thunks and trampolines implementation
// * update the code to handle combinators
// * crank through the birdies: dfn, ex, when to use (like a patterns book)
// * mention any other important HOFs from lisp or haskell
// * structure a small app using these in contrast to typical object approach

//  refs:
//
//  **Suspending evaluation (thunks/trampolines)**
//
//  *   Astonishingly well-written: [nathansuniversity.com](http://nathansuniversity.com/cont.html)
//  *   Another treatment for comparison: [utrechthaskellcompiler](http://utrechthaskellcompiler.wordpress.com/2010/10/18/haskell-to-javascript-backend/)

//  __Combinatory stuff__
//
//  *   _Mock a Mockingbird_ [summarized in Scheme:](https://github.com/evhan/combinator-birds)
//  *   [Raganwald's articles on the birdie combinators](https://github.com/raganwald/homoiconic/blob/master/2008-11-12/the_obdurate_kestrel.md)

//  **Related functional programming bits**
//
//  *   [osteele's functional.js, including a swell string notation for lambdas](http://osteele.com/sources/javascript/functional/)
//  *   [lazutkin's article on porting functional and some recursion combinators to dojo](http://lazutkin.com/blog/2008/jun/30/using-recursion-combinators-javascript/)
