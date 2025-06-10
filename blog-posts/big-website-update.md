---
title: A Big Website Update
date: 10 June 2025
number: 37
description: Several updates to my website, including a fully Node-powered backend, new blog features, and style changes.
tags: webdev, projects, blog, programming
finished: true
---

This website recently got a _big update_, so I wanted to write this post to provide an overview of some of the changes. Some of these things I'd been putting off for a long time, so I'm very excited now that they're finally implemented. I will just introduce each new feature/change in its own section, so let's dive in.

# Style
This one will be the most obvious and front-facing, so I'll start here. Prior to this update, this website had a perma-darkmode thing going on. And prior to that, it had a lightmode/darkmode toggle button, and prior to that, it was just "regular" (black text on a white background).

The most recent dark version of the site was mostly inspired by someone else's website I regularly visit; I decided that I liked his dark background with a white monospaced font for the text. And no offense to him, but I came to my senses. White background with black text _is_ the standard for a  web page since the advent of, I don't know, probably Netscape or something. Since we had backlit monitors at least. It also appropriately mimics newsprint, which is also black on white, and as a result its contrast makes it very easy to read text. And in my opinion, bold print is easier to identify when the text is black rather than white.

However, I don't dislike the darkmode aesthetic — I'm no stranger to using darkmode for applications like Discord. We're back to basics with the classic newsprint color scheme for this iteration of the site, but that doesn't mean I won't bring back the darkmode toggle button — I just needed to re-establish the black-on-white version as the default. The backend changes I made probably would have conflicted with the previous toggle button code, so that function would need to be reworked anyway.

I'd also switched to a monospaced font for the previous dark version of the site, and it was a _mistake_. I'm shocked I even allowed myself to do that. Again, no offense to the site from which I took inspiration, but writing with monospaced fonts is a [typewriter habit](https://practicaltypography.com/typewriter-habits.html) — it was a limitation of typewriters which existed so that their letter key mechanics could work (they needed to be uniform in size). But if someone wants to use a monospaced font for a blog or similar website, that is their decision! Rules are meant to be broken?

## Fonts
I'm using some fonts that I'm generally happy with for now: Alegreya for serif and Work Sans for sans serif. Both are from Google Fonts, which makes them very easy to import into your stylesheet, e.g.
```
@import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap'); /* Alegreya */
```

But maybe in the future I will purchase a license for some nicer ones. We'll see. 

## Mobile
The mobile version of the site has also been addressed and should provide a good enough user experience. (Actually, it was fine before, but the CSS changes I made meant that I needed to double check and make sure the mobile version still looked acceptable.)

I really dislike the need to consider different screen sizes at all. If it were up to me, we wouldn't have mobile webpages. But alas, we do, and it is at least slightly important to consider that when making a website. If you don't, then the user will see the desktop version on a tiny screen and have a less-than-ideal time zooming in so the links become large enough to click.

For the most part, the mobile version is an afterthought for me. At a minimum I just want it to look like I didn't forget about it completely, but the desktop version is more important to me.

# Node webserver
Prior to this update, this website's pages were served in two different ways depending on the route in the URL.

1. If the route in the URL was `/blog` or `/blog/<some-post>`, the page was served with my [blog engine](/blog/new-blog-engine) via `nginx` proxy.
2. If the route in the URL was anything else, the page was served by my `nginx` webserver directly.

In fact, in the previous version of the site, it was possible for the blog to be non-functional while the rest of the site's pages worked normally. All those other pages were static and were served by `nginx` directly, but if for some reason I forgot to run my blog engine (with `node blog-engine.js`), then all the traffic meant for those `/blog` routes would be passed by `nginx` to the blog port I was using, but nothing would be listening! So, boom, 404 on the blog pages.

After this update, _all_ pages are served with a Node webserver, which was adapted from my old blog engine code mentioned above. Essentially, the code that served the blog landing page (`/blog`) and all of the blog post pages was expanded to handle all of the remaining routes.

I guess the previous way was not "wrong", but I prefer this consolidated approach — it has a few advantages:

- I have more control over the route parsing in Node rather than in `nginx` directly (I think; it's easier in JavaScript, at least).
- There is less to handle in my `nginx` config directly, which means it can be more lightweight and less to manage (mostly containing a `proxy_pass` directive to direct all traffic from port 443 to the port that my Node server is running on).
- It allows me to take advantage of more "modern" web development methods, like templating (which will come up again soon).

# Blog tags
This is my favorite of all the updates. Implementing a tag system for my blog is something I've wanted to do for a few years, and I finally got around to it in this recent update. I'm very satisfied with how it came out, so let me give a rundown.

At the bottom of every blog post, there is a list of tags (which are part of the Markdown metadata) that gets populated as part of the blog post template. Those tags are clickable links which take you to a `/blog/tag/<some-tag>` page, which is a new route that my Node webserver handles. Obviously, those pages are dynamic (they're built using whichever tag is in the URL). When you click a tag "projects" for instance, you'll be redirected to what looks like the main blog landing page, but instead of "all posts" being listed, only "posts tagged _projects_" will be listed.

The main content of the Mustache template which builds that page looks like this:
```
<div class="content">
    {{{pagecontent}}}

    {{#entries}}
    {{{r}}}
    {{/entries}}

    {{#renderRss}}
    <div class="rss-container">
        <div class="right"><a href="/blog/feed.xml">RSS Feed</a></div>
        <div class="clear"></div>
    </div>
    {{/renderRss}}  
</div>
```

In fact, all of the "main pages" of the site are built using this template. Depending on the route handler invoked in the Node webserver, the content injected into this template will be different. Since Mustache is a logic-less language, if no value is assigned to `pagecontent` for example, then it will be considered [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), and Mustache won't render it. Similarly, if `entries` is falsy, then a list of blog entries will not be rendered (if, for instance, the page being generated is the 'about' page).


# Mustache for everything
Related to the blog tag update and the use of a universal Mustache template for all of the "main pages", the other non-main static pages on the site have been converted from raw HTML to Mustache (which smilarly get injected into a template for "secondary pages"). Roughly, the site is divided into "main pages" (about, blog, projects, contact, links) and "secondary pages" (support, endorsements, etc.), each of which uses a different template.

The main benefit here is the reduction of redundant HTML; all of the main pages and secondary pages alike had a nearly identical `<head>` element, so it made sense to add that to the template and inject the differing `pagecontent` into that template. With this setup, I have for instance a single `main-page.mustache` template (the one shown above), and six different Mustache content files, one for each of the main pages:

- `home.mustache`
- `about.mustache`
- `blog.mustache`
- `projects.mustache`
- `links.mustache`
- `contact.mustache`

These are basically HTML, btw, except they omit all the templatized HTML, such as `<head>`, `<footer>`, etc. Here's `home.mustache` as an example:

```
<p class="text">Hello, my name is Derek. I use this website as a place to publish <a href="/blog">blog posts</a> and showcase some of my <a href="projects">projects</a>.</p>
<p class="text">If you don't know where to start, here are some suggestions.</p>
<ul class="compact-list">
    <li><a href="/about">About me</a></li>
    <li><a href="/blog/latest">Latest blog post</a></li>
    <li><a href="/solus">Pokémon Solus romhack</a></li>
</ul>
```

This could be de-HTMLed as well; I already have Showdown to convert Markdown to HTML for my blog posts. However, I decided to keep these as HTML-like Mustache instead, because I like having the ability to write in "raw" HTML. It's not often that these main pages will change, so it's not tedious, and it's nice to be able to add or remove classes depending on how I'm choosing to style things with CSS.

# RSS feed
There is now a properly-constructed (and functional) RSS feed at `/blog/feed.xml`. I highlight the fact that it's properly constructed because a couple years ago, I attempted to implement one, but didn't have a good understanding of how it was _supposed_ to be constructed. Specifically, I was trying to create it manually in a static `.xml` file. If you know the slightest bit about RSS, you'll recognize how wrong this is.

So now it's generated dynamically (whenever it's requested by the browser) using the `rss` package in Node. The feed gets created like this:
```
const feed = new RSS({
	title: 'Blog | Derek Andersen',
	description: 'Derek Andersen\'s Blog',
	feed_url: 'https://derekandersen.net/blog/feed.xml',
	site_url: 'https://derekandersen.net/blog',
	language: 'en',
});
```

And the items in the feed (the five latest blog posts) get added to the feed like this:
```
view.entries.slice(0, 5).forEach(post => {
	feed.item({
	title: post.title,
	url: `https://derekandersen.net/blog/${post.slug}`,
	guid: `https://derekandersen.net/blog/${post.slug}`,
	date: post.date,
	description: makeAbsoluteUrls(post.html_body), // full HTML content here
	});
});
```

Easy!

If you're an RSS-user, I hope you take advantage of the feed. It's linked at the bottom of every blog post and at the bottom of the lists of posts at `/blog`.

# /blog/latest route
I thought it would be cool and useful to have a route that dynamically redirects to the latest blog post, whatever it might be at the time. So I did that, and it exists at `/blog/latest`. Currently it's linked on the site's homepage as a "suggested page", if a visitor doesn't know where to start.

The code for this is pretty simple, just:
```
view.entries = view.entries.sortBy('n'); // sort the posts by number
const latestPost = view.entries[0].f; // get the post with the highest number
responseCode = 302; // for temporary redirect
res.writeHead(responseCode, {
	Location: `/blog/${latestPost}`
});
res.end();
```

# /md route
I'd seen on someone else's website that they have a blog for writing entries (similar to my setup), but they also had a section for "other pages hosted on this website". When I clicked one of those, I saw that the top-level route in the URL was `/md`, so it became `/md/<some-page>`. It was clear that this was a section for generic one-off pages written in Markdown, but ones that were not appropriate for blog entries.

I liked this idea, so I added it to my todo list, and now it's implemented in this big update.

The page generation works similarly the blog post pages, since they're written in Markdown and get converted to HTML via Showdown, which is then injected into a Mustache template. The main difference is the Mustache template that gets used for these pages — they use one with a bit less going on than the blog post template.

Currently, there is only one page in the `md` directory which gets served by this new route (which I will discuss in the next section), but future plans for these one-off pages include tutorials or maybe even recipes — I'm not really much of a chef, but I have some meals I like. Either way, it's nice to have the infrastructure in place so if I ever get the idea for a quick webpage, I can throw it in the `md` directory.

# Pokémon Team Archive
The single page that currently exists in the `md` directory mentioned in the previous section is my [Pokémon Team Archive](/md/pokemon-teams) page. It's, again, something I've wanted to have for a while, and I thought the `/md` route would be the best place to put it. 

Essentially, it's a journal where I can keep track of Pokémon teams I use in my playthroughs. For each entry, I can present the party, give a breakdown of their movesets, and write some notes about the team so I can remind myself later how I liked the team. It's mostly for fun/curiosity.

Currently, it's text-based, but I have plans to flesh out the layout of the page a bit — I can add images of party members' sprites and come up with a consistent layout for each entry, maybe even using another Mustache template for each entry (similar to my blog entries which get listed on the blog landing page).

# Endorsements page
There's a [page](/endorsements) at `/endorsements` which contains things I like or recommend, separated into broad sections. While this page has existed for a while, it hasn't been linked to from anywhere on my site and it wasn't really fleshed-out with content. As part of this update, I decided to bolster this page a bit.

There isn't much in there right now, but I will add more things as I think of them — maybe I'll even expand it to include a section for video games.

# Future updates
For the most part, I'm happy with all of these changes, and I like the state of things now as the basis for this website. But I have some more small things to do in the future.

- I'm using the vanilla `http` package in Node to do my route handling. I might want to switch to Express, as it would help me to get more comfortable with it. I've used it a bit in a web development bootcamp course I took, but I'd need to refresh my memory.
- The code in my Node webserver could be cleaned up a bit regardless of whether I choose to switch to Express; there are some code snippets that could be consolidated into functions.
- The CSS stylesheets could be organized a bit better, perhaps separated into different files instead of one large one.