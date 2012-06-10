// 1. control the call stack using thunks/trampolines. 
//    -  refer reader to nathansuniversity for great overview.
// 2. given thunks with dual exception and regular program flow,
//    update trampoline code to switch between contexts.
//    - um, doesn't that give us coroutines too? so much to think about :-)
// 3. given re-entrant exceptions, TDD, handle missing methods
//    by actually writing or stubbing out the missing method, then
//    resume. FTW!!
