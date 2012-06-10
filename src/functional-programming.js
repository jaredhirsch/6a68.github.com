// # fun with javascript (functional programming and late binding)
// ## 1. Functional programming

// 1. map, filter, reduce: the basic HOFs. this is what functional programming is.

// 2. recursion theory: abstracting recursion via recursion combinators.




// object-oriented programming: objects are bundles of code and data,
// and the program runs when objects are created, destroyed, and exchange
// messages with each other. decomposing a program in this way, you think
// of the different 'actors' and ask yourself, what is each actor's
// responsibility?

// functional programming: decompose the program into the combination of
// higher-order functions.

// here's a super trivial example:
// a function that returns just the odd entries in a list
function findOdds(a) {
    var out = [];
    for (var i = 0, item; item = a[i]; i++) {
        if (!(item % 2)) {
            out.push(item);
        }
    }
    return out;
}

// there's really three things happening here: 
//
// *    first, you loop over every item in a list
// *    second, for each item, you check if it satisfies a condition (being odd)
// *    third, if the condition is satisfied, you do something (add the items to a list that's returned)

// you can break this down into functiony pieces.
// here's the second part, checking if the item satisfies a condition
function isOdd(i) { return !(i % 2) }
// using ECMAScript 5:
// we use Array's filter method to handle first part, looping over every item,
// and the third part, collecting condition-satisfying items into an array.
function findOddsECMA5(a) { return a.filter(isOdd(value)) }

// be less clever. here's how we can loop over stuff.
function each(a, callback) {
  for (var i = 0, item; item = a[i]; i++) {
    callback.call(item)
  }
}

// we'll use isOdd again, except we don't just need a filter.
// we need to do something if the filter is satisfied.
function isOdd(i) { return !(i % 2) }

function filter(i, cb) { return !!cb.call(i) } // !!falsy yields false; !!truthy yields true

function fancyOdds(a) {
    var out = [];
    each(a, function(item) { 
        if (filter(item, isOdd)) { out.push(item) }
    })
    return out
}

// that still seems kind of clunky. it would be cool if we could just 
// take action if the filter is satisfied.
function handle(i, a) { a.push(i) }

out = [];
function fancyOdds2(a) {
    each(a, function(item) {
        if (filter(item, isOdd)) { handle(item, out) }
    })
}

// so, that still feels kinda clunky. and it seems like
// fancyOdds2 should really have a different name, since
// what it does is: for each item in an array, if the filter
// is satisfied, call the handler.
// so, what if we pass in the filter, condition, and handler?
// and what if we expect the handler to build up the list?
function filterFun(a, c, h) {
    each(a, function(item) {
        if (filter(item, c)) { h(item) }
    })
}

// what's cool here is that, if you want to check something
// other than whether a number is odd, say if you are searching
// for the string 'foo' in a list of words, like ['fun', 'food', 'fox'],
// you'd only need to replace the filter:
function hasString(search, item) { return item.indexOf(search) != 1 }

// oh, and we said the handler needs to do something.
// following lisp usage that I dimly remember, let's call this
// an accumulator. *Note well* that accum is sort of like a 
// constructor: it returns a function that always appends to 'out',
// whatever 'out' was when the function was created.
function accum(out) { return function(i) { out.push(i) } }

// to search for 'foo' in that list, called werdz:
var werdz = ['fun', 'food', 'fox'];
// we want matches here:
var matchez = [];
filterFun(
    werdz, // the array we're searching
    hasString, // the filter function we apply to each entry in the array
    accum(matchez) // accum(matchez) returns a function that appends entries to matchez
);

// it's almost identical to get back to finding odds:
var numz = [1,2,3,4,5,6,7,8];
var oddz = [];
filterFun(nums, isOdd, accum(oddz));

// ## 2. digging in deeper: code you can use

// ECMAScript 5: [Array extras](https://developer.mozilla.org/en/New_in_JavaScript_1.6#Array_extras) are finally standardized

// Oliver Steele's [Functional](https://github.com/osteele/functional-javascript)

// Eugene Lazutkin's [recursion combinators](http://lazutkin.com/blog/2008/jun/30/using-recursion-combinators-javascript/) built on top of functional-js inside dojo. a really beautiful kind of higher-order function.

// Matt Might's [article](http://matt.might.net/articles/implementation-of-recursive-fixed-point-y-combinator-in-javascript-for-memoization/) on the Y Combinator, an explanation of the fixed-point alternative to recursive or iterative approaches.

// SICP says: enumerate, filter, accumulate. or: map, filter, fold.
