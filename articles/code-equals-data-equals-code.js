
// ## 2. code == data == code (todo)
//
// JavaScript is the most mutable mainstream language. You can overwrite
// or rewrite functions as part of your program. 

// Transforming source code can be done by converting code to a string,
// then doing regular expression transformations on it, or, parse the
// source into a series of tokenz, then manipulate those. JavaScript's
// syntax is too complex to be handled by regexps. Tokenizing JS is painful
// precisely because there's so much syntax.

// Anyway, here's a trivial example to illustrate the basic idea.
// In real engineering work, you can use a parser generator to do this robustly.

// Suppose you have some code. Great.
isPos = function (a) { return a > 0 }
// OK, now let's get the source code. Easy.
isPosSrc = isPos.toString()
// here's a really simple transformation we can do on this source code
function invert(str) { return str.replace('>', '<') }
// go ahead and apply it
isNegSrc = invert(isPosSrc)
// you don't have to use eval here, but it's the shortest, simplest example.
eval('isNeg = ' + fooInvSrc)
console.log(isNeg) // isNeg = function (a) { return a <= 0 }

// rather than use eval, we can parse out the body of the function, and
// pass that into a function constructor, but it's brittle if we use regexps,
// and a whole lot of machinery to tokenize out the names of parameters and
// the body of the function.
isNeg = new Function('a', 'return a <= 0') // this would be the goal of tokenizing

// wheeeee!
