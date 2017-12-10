---
layout: post
title:  "Test Pilot in 2018: Lessons Learned from Screenshots"
date:   2017-12-08 17:36:00 -0700
categories: mozilla test-pilot screenshots
permalink:
---

## Test Pilot in 2018: Lessons learned from graduating Screenshots into Firefox

Wil and I were talking about the Bugzilla vs Github question for Screenshots a couple of days ago, and I have to admit that I've come around to "let's just use Bugzilla for everything, and just ride the trains, and work with the existing processes as much as possible."

I think it's important to point out that this is a complete departure from my original point of view. Getting an inside view of how and why Firefox works the way it does has changed my mind. Everything just moves slower, with so many good reasons for doing so (good topic for another blog post). Given that our goal is to hand Screenshots off, just going with the existing processes, minimizing friction, is the way to go.

If Test Pilot's goals include landing stuff in Firefox, what does this mean for the way that we run earlier steps in the product development process?

## Suggestions for experiments that the Test Pilot team will graduate into Firefox

### Ship maximal, not minimal, features

I don't think we should plan on meaningful iteration once a feature lands in Firefox. It's just fundamentally too slow to iterate rapidly, and it's way too hard for a very small team to ship features faster than that default speed (again, many good reasons for that friction).

The next time we graduate something into Firefox, we should plan to ship much more than a minimum viable product, because we likely won't get far past that initial landing point.

### When in Firefox, embrace the Firefox ways

Everything we do, once an experiment gets approval to graduate, should be totally Firefox-centric. Move to Bugzilla for bugs (except, maybe, for server bugs). Mozilla-central for code, starting with one huge import from Github (again, except for server code). Git-cinnabar works really well, if you prefer git over mercurial. We have committers within the team now, and relationships with reviewers, so the code side of things is pretty well sorted.

Similarly for processes: we should just go with the existing processes to the best of our ability, which is to say, constantly ask the gatekeepers if we're doing it right. Embrace the fact that everything in Firefox is high-touch, and use existing personal relationships to ask early and often if we've missed any important steps. We will always miss something, whether it's new rules for some step, or neglecting to get signoff from some newly-created team, but we can plan for that in the schedule. I think we've hit most of the big surprises in shipping Screenshots.

### Aim for bigger audiences in Test Pilot

Because it's difficult to iterate on features when code is inside Firefox, we should make our Test Pilot audience as close to a release audience as possible. We want to aim for the everyday users, not the early adopters. I think we can do this by just advertising Test Pilot experiments more heavily.

By gathering data from a larger audience, our data will be more representative of the release audience, and give us a better chance of feature success.

### Aim for web-flavored features / avoid dramatic changes to the Firefox UI

Speaking as the person who did "the weird Gecko stuff" on both Universal Search and Min-Vid, doing novel things with the current Firefox UI is hard, for all the reasons Firefox things are hard: the learning curve is significant and it's high-touch. Knowledge of how the code works is confined to a small group of people, the docs aren't great, and learning how things work requires reading the source code, plus asking for help on IRC.

Given that our team's strengths lie in web development, we will be more successful if our features focus on the webby things: cross-device, mobile, or cloud integration; bringing the 'best of the web' into the browser. This is stuff we're already good at, stuff that could be a differentiator for Firefox just as much as new Firefox UI, and we can iterate much more quickly on server code.

This said, if Firefox Product wants to reshape the browser UI itself in powerful, unexpected, novel ways, we can do it, but we should have some Firefox or Platform devs committed to the team for a given experiment.

