---
layout: post
title:  "Firefox Screenshots: Measuring Performance"
date:   2016-10-31 12:30:00 -0700
categories: mozilla test-pilot screenshots
permalink:
---

### Test Pilot mission: add useful features to firefox

  - "useful": features that set firefox apart from other browsers, are actually used by people, and that lead to overall increased usage of firefox.
  - much of what Test Pilot does is ship features as experimental addons, then measure usage.
  - it turns out Test Pilot also has to own shipping things into Firefox and steering them

### Screenshots goal: we're in Firefox. Now, let's make it as useful as we can: experiment with the feature set & make it fast and easy to use

- Screenshots, the story so far:
  - first Test Pilot experiment that seemed like it could be a good fit for Firefox
  - Took about 6 months of work to ship Screenshots into release Firefox.
  - Now we need to figure out if Screenshots is worth keeping or not
  - critical question #1: do screenshots users use firefox more?
    - we're going to answer this by adding screenshots usage data to the main ping. we'll then be able to see if screenshots sessions correlate with more usage vs non-screenshots sessions. we'll also be able to measure the overall fraction of sessions that use screenshots.
  - critical question #2: how do we experiment with screenshots inside firefox, to make it the best possible experience that's useful to the greatest number of people?

Here we are concerned with that second critical question.

### Great user experience comes down to a few things: a good feature set, low-friction flows, and performance.

We're going 

### Performance is important, regardless of the feature set.

OK, so we need to measure and optimize performance. 

### Measure performance against the RAIL standards

RAIL guidelines are a goofy marketing description for some widely-accepted industry guidelines around UI responsiveness:
  - pages should load within 1 second
  - interactions should lead to UI updates within 100 milliseconds
  - background work should be broken into 50ms chunks and only run while the page/browser is idle
  - animations (or other CPU-intensive tasks) should do no more than 10ms of work per turn, to keep the browser UI crisp and responsive

### Work needed to measure perf: instrument shot creation flow & site pages

- We already have GA running on site pages. This includes page load time. For shots, that's all we really need.
- It would be nice to know, for a given 'my shots' page, how many shots are on the page, and the overall page weight. If the majority of users have more shots over time, that's a good sign. If the majority of users only use screenshots a few times, we'll need to figure out how to make it more sticky.

### Work needed to use the perf data: build a dashboard that shows performance data for the shot flow + site pages

- This is for next time, I think (the Data Studio bit).

