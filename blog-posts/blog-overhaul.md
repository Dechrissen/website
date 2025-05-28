---
title: Overhauling my Blog System
date: 17 February 2021
number: 04
description: My ideas for a blog engine upgrade.
finished: true
---

It's been quite a while since my last blog entry (I've been busy with school and other projects), so I thought it would be fitting to make this one
focused on this blog itself, what I want it to look like going forward, and some ideas I have to improve it in the
very near future. In fact, treat this next sentence as a promise: **This is the last blog entry I will be writing in raw HTML**.

Writing a new HTML file for each new blog entry is definitely *not* the way to do it. Here's why:

- it's error-prone;
- it's tedious (in my case, it requires a bunch of checks to all the metadata and tags in the HTML);
- it takes longer than writing blog entries reasonably should;
- the less static HTML on your site, the better;
- and there is no automation or future-proofing.

For a while now, 'overhaul blog system' has been an item on my personal
website to-do list, staring at me, begging me to check it off the list. For that reason, and the ones
listed above, I decided that now is the time to finally do it. It was obvious that this particular problem
is one that would catch up with me sooner or later; when I first made this site, my primary focus was
getting things done and making sure they looked nice to me, not necessarily considering their practicality.

The main problem is that the blog lacks a *content management system* (CMS). For a while, it wasn't quite clear to me how I'd
implement one. I don't have much experience with back-end web development (yet!), and I didn't necessarily want an
extravagant setup that requires authentication from some web portal each time I want to write a post. So something
else would have to work.

Here were my CMS criteria:

- it would be simple (to use and to create/maintain);
- entries would be easy to write (in terms of some hypothetical syntax I'd need to adhere to);
- it would employ some form of automation, so that newly-submitted entries are automatically reflected on all the parts of the site they should be;
- it would support content within blog entries such as headings, lists, images, and code snippets;
- and it would teach me something new.

Considering these criteria, one day it hit me (admittedly in the shower) that what makes
most sense for me is the following setup: Markdown for writing entries (one file per entry), and some node.js module
for generating the corresponding HTML for each entry. This configuration satisfies all of my criteria for a CMS.
First of all, I love writing Markdown, and in terms of typographical capabilities, it checks all the boxes
(text, headings of varying sizes, lists, links, images, code snippets).

It would be simple to write a Markdown file, drag it into the 'blog' directory, maybe edit a universal metadata
file for each entry's information, and be done. All of the
necessary changes would be made to the site automatically, and the (still undecided) node.js library would
generate the HTML dynamically, according to the same format I use now, so I can use the same CSS file.

In terms of teaching me something new, node.js is something I have been wanting to learn how to use
for a long time now. Knowing how to incorporate node modules into my websites will open many doors for current and future
project functionality (including some things I already have in mind).

A bonus of this system, even though it wasn't a requirement of mine, is that I can theoretically write
Markdown files anywhere (my main dev machine, a laptop, or even a smartphone). All I need to do is move the file to my
dev machine when I want to publish it.

Like I said in the outset of this entry, this is the last post I'm going to write in raw HTML. Before my
next entry, I will ideally have the upgraded blog system up and running. After that, I plan to migrate my previous posts to
shiny new Markdown files, so everything is consistent. Until then!
