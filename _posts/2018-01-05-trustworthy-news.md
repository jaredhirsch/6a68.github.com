---
layout: post
title:  "An idea for fixing fake news with crypto"
date:   2018-01-05 17:09:00 -0700
categories: mozilla miti big-ideas
permalink:
---

Here's a sketch of an idea that could be used to implement a news trust system on the web. (This is apropos of Mozilla's [Information Trust Initiative](https://blog.mozilla.org/blog/2017/08/08/mozilla-information-trust-initiative-building-movement-fight-misinformation-online/), announced last year.)

Suppose we used public key crypto (digital badges?) to make some verifiable assertions about an online news item:

- person X wrote the headline / article
- news organization Y published the headline / article
- person X is a credentialed journalist (degreed or affiliated with a news organization)
- news organization Y is a credentialed media organization (not sure how to define this)
- the headline / article has not been altered from its published form

The article could include a  `meta` tag in the page's header that links to a `.well-known/news-trust` file at a stable URL, and that file could then include everything needed to verify the assertions.

If this information were available to social media feeds / news aggregators, then it'd be easy to:

- automatically calculate the trustworthiness of shared news items at internet scale
- inform users which items are trustworthy (for example, show a colored border around the item)
- factor trustworthiness into news feed algorithms (allow users to hide or show lower-scored items, based on user settings)

One unsolved issue here is who issues the digital credentials for media. I need to look into this.

What do you think? Is this a good idea, a silly idea, something that's been done before?

I don't have comments set up here, so you can let me know [on twitter](https://twitter.com/intent/tweet?text=yo+@6a68:) or via email.
