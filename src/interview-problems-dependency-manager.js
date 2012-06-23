// ## Interview problem: build a dependency manager in JS

// ### like I said on the main page, everything on this site is a draft, but this is *extra drafty*.

// I've been doing [a lot of interviewing lately](http://allthingsd.com/20120604/confirmed-google-grabs-meebo/). This has gotten me thinking about
// what makes a problem really good for an hour-long coding session; this one popped
// into my head in the shower today.
//
// Most people have used requireJS or similar dependency managers in YUI, Dojo, and Closure
// (among others) to load class dependencies in the right order. Building a tiny version of
// such a library is a great front-end coding problem because:
//
// * it requires having some experience and common sense with APIs (although you could
//   give someone the API as a starting point);
// * it provides an opportunity to discuss the use cases and edge cases around such
//   a library, like loading different dependencies for handset, tablet, and desktop;
// * it requires knowing some computer science (how to check if a graph is acyclic; how
//   to topologically sort a DAG), yet is a practical enough problem that someone with
//   little formal CS chops, but solid coding experience, could probably muscle through
//   and hopefully have fun talking it out.
// * if someone does know CS, you can take the finished product and see if they can think
//   of some similar applications (one that's feasible in JS would be a priority queue
//   used to schedule work for a set of Workers).
//
// Beyond getting an implementation working, there are a zillion different directions
// you could go, if you have extra time; just talking through the options might be
// revealing and useful.

// The solution starts by modeling class dependencies as a graph with a node for
// every class, and, for each dependency relation, a directed edge that points from a
// class to its dependency.
//
// If there are no circular dependencies, then you've got a directed acyclic graph, or DAG,
// and flattening a DAG into a list is known as a topological sort.
//
// The references I'll be using to check my work (since I'm sharing this ;-) are Skeina's 
// Algo Design Manual, the coverage of topological sort in CLR, and maybe a peek at the
// source code for requireJS (or other big libraries that handle class/module dependencies).
//
// By the way, I didn't go to school for computer science. Reading (and re-reading, and re-reading) parts of
// [Skeina](http://www.amazon.com/Algorithm-Design-Manual-Steven-Skiena/dp/1848000693/), [CLR](http://www.amazon.com/Introduction-Algorithms-Thomas-H-Cormen/dp/0262033844/), and [SICP](http://mitpress.mit.edu/sicp/) taught me what I know; anyone can do it, it just takes time and energy.

// So...what would you have to do to solve this problem? Here are my thoughts for starters:
//
// * decide how to represent dependency links between classes
// * write a bit of code to register dependencies for each class: 
//   "require(className)" or "require(className, deps)"
// * the core of the problem: flatten the dependency graph into a list of dependencies:
//      * start by checking the in-degree of each node (the number of dependencies a class has).
//      * nodes with in-degree zero (classes with no dependencies) are leaf nodes; we should use these
//        as starting points for each DFS.
//      * we'll keep a global exit counter so that, if we have more than one leaf node, we will
//        be able to run a DFS from each, and still have a correct global loading order.
//      * as each node is exited by DFS, push it onto an array.
//      * after DFS visits every node in the graph, you'll have a complete list of dependencies
//        in the array; you can just iterate over it to list off classes in sorted order.
// * what's space and time complexity? 
//      * O(V+E) in time, because DFS is O(V+E) and, assuming Array.push() is O(1), pushing all
//        nodes onto the array costs O(V) time.
//      * O(V^2) in space to store adjacency matrix, O(E) space to store as adjacency list,
//        O(V) for the output array -- looks like O(V^2) overall. (Need to think more about this.)
// * what if you run into circular dependencies?
//      * you want to remove just enough edges to make the graph acyclic; see discussion below.
//      * note that removing the minimal set of edges is an NP-complete problem (so, a nice
//        opportunity to talk about complexity).
// * what if a dependency is missing from the graph?
//      * you'll have to remove everything that depends on it.
//      * this can be done by adding the missing node, flipping the edge direction, 
//        doing DFS downward from the missing node, and removing all encountered nodes
//        from the graph. Seems doable in at worst O(V+E) time (if the root is missing).
// * what if you want to specify chunked dependencies as modules, which aren't actually
//   a class, but just a list of classes?
//      * I haven't thought this through, but seems like you could tweak your representation

// ### a sketch of a solution

// Suppose that: 
//
// * myclass -> jquery, jquery.cookie, and underscore.js, and
// * everything depends on some base class.
// 

// We might start by assuming we have a graph represented by having a list of dependencies
// for each class, which is an adjacency list representation:
var adjList = {
    'myclass': ['jquery', 'jquery.cookie', 'underscore', 'base'], 
    'jquery': ['base'], 
    'jquery.cookie': ['jquery', 'base'],
    'underscore': ['jquery', 'base']
};
// A matrix view could also work, where we'd have the full list of classes along the X and Y 
// directions, with an entry in a cell if one class depended on the other.

// this object maps class names to array entries in the matrix.
// I wish I knew of a more elegant approach, but whatever, just come back to this.
var matrixKeys = {
    'base': 0,
    'jquery': 1, 
    'jquery.cookie': 2,
    'underscore': 3, 
    'myclass': 4
};
var matrixValues = ['base', 'jquery', 'jquery.cookie', 'underscore', 'myclass'];
// our matrix is an array of arrays, where the ith array has a 1 for each jth thing it depends on.
//
// so, the first array is empty, because base depends on nothing.
// the second array has a 1 in the zeroth place, because jquery depends on base.
// the third array has two 1s, because jquery.cookie depends on base and jquery.
// and so on.
var adjMatrix = [
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1]
];
// adjMatrix[0] has non-zero entries for any of the dependencies for base.
// you could write this as adjMatrix[matrixKeys['base']].

function dependsOn(className) {
    var deps = adjMatrix.classname,
        classes = [];
    for (var i = 0; i < deps.length; i++) {
        if (deps[i]) {
            classes.push(matrixValues[i]);
        }
    }
    return classes;
} 

// on the other hand, if we want to measure the number of classes that depend on
// a given class, or its in-degree, we'll go vertically down the matrix:
function dependentOn(className) {
    var classes = [],
        j = matrixKeys[className]; 
    for (var i = 0; i < adjMatrix.length; i++) {
        if (adjMatrix[i][j]) {
            classes.push(matrixValues[i]);
        }
    }
    return classes;
}

// alright, now we can get the in-degree for every node in the graph by running 
// dependentOn(node). we'll then call DFS on nodes with in-degree zero.

// this function will take a list of node names in the graph and return their in-degree.
function indegree(graph) {
    var degrees = {};
    for (node in graph) {
        degrees[node] = dependentOn(node).length;
    }
    return degrees;
}

// alright, assuming we know which nodes we want to pass to DFS, let's make a global
// exit counter as the length of the list of visited nodes.
var visited = [];

// and, let's DFS, incrementing the exit counter as each node is exited. To keep
// track of the exit times, we can fire an event or callback, or just operate on
// the data structure directly.
//
// because javascript can't optimize tail calls, we should use an explicit stack, or
// else even modest recursion will blow the stack. Again, this is an opportunity for
// a conversation.
//
// this could be cleaner and more general, but it looks like it works?
function dfs(node, visited) {
    var dependencies = dependsOn(node),
        dependency;
    for (dependency in dependencies) {
        if (dependency in visited) {
            continue; // already visited, something's gone wrong. todo, handle this.
        }
        dfs(dependency, visited);
    }
    visited.push(node);
}

// once you've run dfs on a node, you've pushed all its dependencies, in exit order,
// onto the visited array.

// so, calling dfs on every node with in-degree 0 is our topological sort.
function topologicalSort(graph) {
    var indegrees = indegree(graph),
        leaves = [];
    for (var node in indegrees) {
        if (!indegrees[node]) { leaves.push(node) }
    }

    var visited = [];
    for (var leaf in leaves) {
        dfs(leaf, visited);
    }

    return visited;
}

// stuff not yet covered:
//
// * talking about the register(className, depsList) -- maybe better to just provide this API



// ### here's a bunch of unsorted draft discussion.


// implement the DFS.
//
// since the finish time increments for every item, we can just insert nodes
// into an array where the ith entry has finish time i.
//
// the most idiomatic way to handle entry/exit events seems to be publishing
// an event when that happens. Let's assume we have a pubsub system in place,
// and we'll just call fire(event, data) to notify Observers. This lets us
// split up our code cleanly. (You could use callbacks as well, or just hack
// the DFS code and the exit time handler code in one function body. So, this
// is a chance to talk about the tradeoffs between using events and callbacks.)
Registrar.prototype.dfs(graph) {
    
    
}

// So, how would we check if there were circular dependencies?
// 
// We'd have cycles in the dependency graph.
//
// And how would we check for cycles in a directed graph? 
//
// * For each node in the graph,
//      * Mark every node as unvisited
//      * Do a depth-first search, marking nodes as visited as we go
//      * If you hit a node marked visited, you found a cycle
//

//  If you do find a circular dependency, how do you handle it?
//  
//  You don't really want to bail out and refuse to load the page--you want to
//  try to continue, by removing the smallest number of edges to make the graph
//  not circular. Skeina refers to this as the 'feedback vertex set' problem,
//  and he refers to the special case of reducing a graph to a DAG as the 'maximum 
//  acyclic subgraph' problem.
//
//  This is super cool stuff to discuss in an interview context, but definitely
//  falls in the realm of extra-extra credit. Finding a feedback edge or vertex
//  set is an NP-complete problem (hence, here's a chance to talk about complexity
//  theory); the best you could hope for would be to find a good solution that still
//  deletes more edges than is necessary. 
//
//  The simplest heuristic is, whenever DFS encounters an already-visited node, just
//  delete that edge. This is something you could actually get done in just a couple
//  of minutes of whiteboarding, or at least talk through pretty quickly.
//
//  If you look at this as a maximum acyclic subgraph problem, there's actually a
//  really simple algorithm that guarantees you a solution no worse than twice as
//  large as the optimal set. (Skeina's description is unclear; todo flesh this out)
