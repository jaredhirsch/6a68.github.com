6a68.github.com
===============

i haz a github. i sharez it wif u.

building up a static blog using docco:

1. `find . -name '*.js' -exec docco '{}' +`
2. `mv docs/* .`
3. `rmdir docs`

or, as a one-liner:

`find . -name '*.js' -exec docco '{}' + && mv docs/* . && rmdir docs`

note that the index page has to be manually created and updated. 
but this works, for me, for now :-)
