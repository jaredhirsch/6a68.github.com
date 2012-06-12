6a68.github.com
===============

i haz a github. i sharez it wif u.

building up a static blog using docco with a customized template:

1. `find src -name '*.js' -exec docco/bin/docco '{}' +`
2. `mv docs/* .`
3. `rmdir docs`

or, as a one-liner:

`find src -name '*.js' -exec docco/bin/docco '{}' + && mv docs/* . && rmdir docs`

note that the index page has to be manually created and updated. 
but this works, for me, for now :-)

