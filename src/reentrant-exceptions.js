// ## Reentrant exceptions in JavaScript

// 1. control the call stack using thunks/trampolines. 
//    -  refer reader to nathansuniversity for great overview.
// 2. given thunks with dual exception and regular program flow,
//    update trampoline code to switch between contexts.
// 3. given re-entrant exceptions, we can test-drive code and handle missing methods:
//      *   write a failing test for an undefined method
//      *   give the user a prompt to handle the undefined method or break
//      *   after the user creates the undefined method, resume
//      *   test passes

// let's start with a basic thunk and trampoline implementation.
// we'll just use what's provided by nathansuniversity.

/* thunks are of the form
   { tag: 'value', val: value }
   or
   { tag: 'thunk', func: f, args: arguments }
*/

// so, given a thunk t,
var trampoline = function (t) {
// dangerously assume t.tag is always defined and either 'value' or 'thunk'
    while (true) {
        // if it's a value, return the value. this is the base case of the recursion.
        if (t.tag == 'value') { 
            return t.val; 
        }
        // otherwise, it's a thunk. so, recurse.
        if (t.tag == 'thunk') { 
            t = t.func.apply(null, t.args);
        }
    }
}

// but I want re-entrant exceptions. that means the trampoline must persist
// the values of stack frames after they are executed, and each thunk must
// include the 'success callback' and the 'error callback'.
/* thunks, revised:
   { tag: 'value', val: value }
   or 
   { tag: 'thunk', func: f, args: arguments, err_func: f, err_args: arguments }
*/

// so, for starters, let's just hang on to the last thunk.
// I suppose we could try to go more than one step back through the stack
// using something like "arguments.callee.caller.caller". but anyway.
prev_thunk = null;
var supr_tramp = function (t) {
    /* still assumes t.tag == 'thunk' || 'value' */
    while (true) {
        // if you've hit a value, return it.
        if (t.tag == 'value') { return t.val; }
        // else, if you hit a thunk,
        if (t.tag == 'thunk') {
            // record the thunk in order to backtrack.
            prev_thunk = t;
            // try to call the function.
            try {
                t = t.func.apply(null, t.args)
            // if something goes wrong, 
            } catch (ex) {
                // call the error callback.
                t = t.err_func.apply(null, t.err_args)
            }
        }
    }
}

// this isn't perfect. it seems like you should probably pass the exception
// into the error callback, and you also need a way to switch back to the
// mainline of execution: t.func --> t.err_func --> t.func again

/* thunks, revised again:
   { tag: 'value', val: value }
   or 
   { tag: 'thunk', func: f, args: arguments, err_func: f }
*/

// let's say, if the exception type is 'resume', we'll resume the
// previous thunk. that means that you can have your exception handler
// code throw an exception of its own in order to get back to the 
// original flow.
var supr_supr_tramp = function (t) {
    while (true) {
        if (t.tag == 'value') { return t.val; }
        if (t.tag == 'thunk') {
            prev_thunk = t;
            try {
                t = t.func.apply(null, t.args)
            } catch (ex) {
                // if the exception's type is 'resume', backtrack.
                if (typeof ex.type !== 'undefined' && ex.type == 'resume') {
                    t = prev_thunk.func.apply(null, prev_thunk.args)
                // otherwise, something really did go wrong
                } else {
                    t = t.err_func.apply(null, t.err_args)
                }
            }
        }
    }
}
// I really think this should work, but I ought to write some code with it.

// what's up next? 
// maybe TDD a little object to see this in action.
