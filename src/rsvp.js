// # rsvp: decentralized consumer-focused asynchronous messaging, beyond email

// I originally thought of ideas around this about 4 years ago. Here's some recent thoughts.

// Fri 8 June 2012, transcribed from handwritten notes

"So. Instead of pre-www, messages as non-addressable & ephemeral, make it
addressable, immutable, and shareable as links instead of fwds.

Reply: it's a URL with a pointer to the parent URL.

The UI just converts URLs into 'email threads.'

So, you have a bunch of hashes (SHA, git style), and you also have an aggregate
view by created time, which is identical (? or is it) to received time.

- Suppose you have 2 domains hosting http-mail.

- How does foo@domainA 'send' something to bar@domainB?

--> does every person have a copy of data, or a reference to data?

    --> reference: orig sender can delete it.
        but orig could thus be lost
        does that orphan a msg? hmm.

    --> for any kind of performance, we'll have to cache views. so, it has to be
        a bunch of redundant copies all over the place. emails aren't unsendable
        after you send them.

if hashes are globally unique to a domain, then they are copied around.

OK, what next?

addressable means easy to build an API. means easy to build dev community. 
(remember, IMAP is hell on earth to work with. so many complaints about lack
of a GMail API. If that were easy, I wouldn't probably need to write this.)

------

Back to the start.

- on the server: simplicity, addressability.
  - create a message via simple POST w/OAuth (or other decentralized identity)
- on top of this: simplicity in the UI.
  - public vs private
    - explicit viewer list for each msg
    - each msg has 0 or 1 parents
      - this maps neatly to forwarding mail
    --> what about BCC?
    --> so you need public/private msg, and public/private recipient list.
    - not recipient. it's 'list of oauth tokens able to retrieve this URI'
  - so your existing email can work, or your X acct with an oauth token to
    prove your identity.
  - so that means, when you authenticate with token X, you see the 'inbox'
    or 'history'/'timeline' for every msg specifically addressed to that
    id (whether twitter handle, FB id, or email addy)
  --> if you're using oauth from the start, it's easy to build a whitelist
      of 'ppl I know'.
  --> wouldn't it be easy to add twitter, and pull certain twitter handles
      into your whitelist?
      OR, whitelist everyone you follow, then filter different people to
      different places (folders/tabs/pages/lists/subsets)

------

Use ifttt & other services, eg, to sms/email me when I get messages like X.

------

All you need is, what, a simple 0MQ pubsub setup to route msgs, then a
NoSQL structure to store them.

------

Simplicity from start to finish.

  Simple product, simple API, simple architecture.

  Simple biz model: free to host your own, $N/month for a real acct. M day trial.
    (for some values of N and M)

(Are there JS bindings for 0MQ?)

------

How can you interoperate with email?

  - If user has email token, 'send' msgs to contacts
  - If user has twitter token, tweet public msgs, DM private msgs.
    (Can you DM 2 ppl at once?)"

// An earlier pass, from late March 2012
// 
// # RSVP
// ## an open-source effort to redefine the ubiquitous personal letter-writing experience that is email
// 
// I've been thinking about how we communicate over the internet, and how email is the backbone of all that, for a few years now.
// 
// Most email clients offer the same basic interface: a list of message titles, a list of 'folders' in which mail has been filed, and possibly a small window to view messages in the list without leaving the main interface.
// 
// Most (all?) email clients offer a compositional interface that is: a white square and, at best, Arial with a goofy row of buttons to apply clunky formatting along the lines of a typical word processing program. I think we can do better.
// 
// The letter-writing experience is beautiful. You can sketch in the margins, you can scribble things out, there is the feel of paper and the very subtle smell of ink. Typing in a box, even a Rich Text Editor box, is a model of this, but I think we can do better.
// 
// The whole page should be the editing interface. One big white sheet. You should be able to do anything in that sheet that you can do with computers, anything you might use to communicate with somebody.
// 
// But the core, basic, innermost feature is: I send you a text message which is private. You respond, perhaps quoting my message. And on the conversation goes.
// 
// So the first, basic, simplest question to ask is: how can we make the experience of reading and writing email not just simple, fast, and easy (the expediency factor), but create an interface that inspires measured, lengthy thought? How can we show you your messages in such a way that you sometimes linger over them, just because you adore how they look?
// 
// Consider this the preamble to a manifesto, and the preface to a long body of work, work that's still unfolding.
// 
// I'm going to open source all my sketches, ideas, all the producty stuff that usually is trapped on paper or in my head.
// 
// When I've reached some simple conclusion, I'll write code and test out whether theory is supported by experimental data.
// 
// Some ideas, most of which reach far beyond the first simple version:
// 
// * beautiful, large, typefaces. for starters, just one.
//  * for starters, just send and display plain-text mail. deal with html formatting later. this eliminates lots of html problems.
// * good spacing between lines, good line length, and related typographica
//  * in a beautiful future, authors could manually adjust kerning, add swashes, control line-length, letter spacing, the works.
// * one interface for both reading and writing
//  * that means, one white sheet on the page. click into it, edit it, send it. to reply to a message, treat it like a shared word doc: insert a few newlines at top or bottom, then edit.
// * put sender/addressee information in the background, without losing clarity
//  * it's crucially important to know who has seen or will see a message. but...do you need to see the envelope the whole time you're writing the letter? no.
//  * simply doing a pushdown or foldout JS effect will work
// * email should be addressable. give it a hash with a unique URL. 
//  * then you can bookmark important messages, or create pages with groups of bookmarked messages, or use emails as todos or (if public) shared documents/blog.
// * should be possible to annotate messages. like, add some notes to the message, so you know what it means.
//  * if you can create a page with a title, description, and links to emails, then you've got a way to create a todo list that points to other messages.
//  * you could do this and send it to yourself as an email. like, it's recursive and beautiful. 
// * should be possible to organize messages using folders/labels/text documents (some kind of higher-order document)
//  * folders/labels could just be aliases to hashes: a special meta-message that links to all messages with that label. _or_, /username/labels/label-name is the URL of the label.
// * should be possible to tag/label messages...but also should always have an infinite flow of received and sent messages in one simple view.
//  * the infinite flow means that you can always get an "inbox view", but we need to make it useful for scanning.
//  * probably don't want to see spam in the infinite flow.
// * speaking of which...to keep spammers out: just require a mobile phone number and a couple of captchas. not to text the phone, but actually call it.
//  * but filtering spam is a huge thing. let's just say...we need to look into it.
//  * what if your email address was an unmemorable, long, SHA hash? It'd be very hard for spammers to guess. is guessing really the problem? I don't think so.
//  * in the meantime...look into open-source solutions, I guess.
//  * I really wish we could block spam without looking through users' email, even automatically. because youll look at private messages to debug the system, won't you? isn't there a simpler better way?
// * what about storage limits and attachments?
// * I really think users should just pay for an account, then pay for storage. That will eliminate spammers signing up for accounts, although accounts could still get compromised.
//  * the alternative, showing ads, completely destroys the beautiful, bookish, annoyance-free experience we're trying to create. who wants to linger on a page with flash ads?
