---
title: A Shiny New Blog Engine
date: 17 June 2021
number: 5
---
Get ready. This is a big one.

Like I mentioned in my last post,
[*Overhauling my Blog System*](https://derekandersen.net/blog/blog-overhaul), the
next blog entry I write is *not* going to be in raw HTML. And I'm happy to announce
that four months later, I've succeeded in that goal, as this is the first post
I'm writing since the completion of my new blog engine! So in this post, I'm going
to provide an overview of the system, how I went about it, how it works, and the
plans I still have for this blog in the future.

And throughout this post, I'm also going to do my best to showcase all of the
new formatting I have access to, like headings, lists, code blocks, and images.
(Of course, I could do those things before, but now it's much easier.) Alright,
let's go.

## The motivation

The main motivator for this project was the fact that previously, writing posts
was a tedious process, and ultimately deterred me from doing so. But to recap,
here's a list of motivations for the project:

- writing posts in HTML was error-prone,
- changing metadata for each post was a nuisance,
- writing posts took too long,
- there was no future-proofing to the system,
- and I wanted to learn something new in web dev.

In this case, the "something new" is the deployment of some backend utility that
programmatically creates webpages and handles web traffic to the blog portion of
my website, hence my use of the term 'blog engine' (also, it sounds cool).

## The old system

Just to explain a bit about how my old blog system worked, I'll outline the process
for creating a new post.

First, I would copy the HTML file from the previous post I'd written and paste it
into a new one, changing the filename to reflect what I'd want the new URL to be.
For example, if I'd want the URL to be `derekandersen.net/blog/cool-post`, I'd name it
`cool-post.html`.

Then, I would change the metadata, which in this case would be the variables in the
HTML `<head>` and some in the `<body>`, such as the `<meta>` description tag, the
`<title>` tag, and the publishing date.

At this point I would delete the body of the post, and write the new one. This
is where things got more tedious, because whenever I wanted to add any kind of
formatting or markup, I'd need to manually type the HTML tags to do so.

After the post's HTML file was done, I would still need to update the blog's homepage
to add a link to the new post. As you could probably guess, this meant adding more
static HTML... which meant more tedium.

## The new system

The new system is much more streamlined and user-friendly. First, I'll outline the new process for
creating a post, and afterward I'll go into more technical detail about what's happening
behind the scenes and why I chose to use the tools I used.

1. write the post in a Markdown file,
2. add it to the `blog/` directory of my site.

That's it. Nice and simple.

As far as how it *works*, it's a bit more complicated than the old system. But
that's the main reason I'm writing this post, so let's get into it.

It uses a combination of the following:

- [`node.js`](https://nodejs.org/en/), a JavaScript runtime environment for running JavaScript outside the browser;
- *Markdown*, my personal favorite markup language,
- [`showdown.js`](http://showdownjs.com/), a Markdown to HTML converter library;
- [`mustache.js`](https://github.com/janl/mustache.js), a templating library.

I chose Node for my application because I felt it made the most sense given
what I'm interested in these days. I'm trying to get better at writing JavaScript,
and I'm trying to get further into web development, and since Node is very popular,
I felt it made more sense than using (and having to learn) another server-side language
like PHP, which I have no experience with. Node is the main driver of the application,
since the webserver code sits in a `.js` file that I run via Node.

For actually writing posts, I chose Markdown because I love it. When I started
my graduate program, our program director had us prepare for a Markdown assessment, for
which we had to learn the basics (so, all of it) of Markdown syntax. Since then,
I've loved using Markdown for things like software documentation and READMEs,
and I felt like it was the perfect choice for this application. Plus, I would
classify myself as a **typography nerd**, and Markdown is such an elegant way
to apply all the fundamental rules of good typography.

After a post is written, the job of `showdown.js` is to convert that Markdown into
HTML (or at least, the body of the post sans `<head>`).
For example, a normal paragraph in Markdown becomes a `<p>` element, a list
with hyphens becomes a `<ul>` with nested `<li>`s, single asterisk padding becomes
an `<i>`, double asterisk padding becomes a `<strong>`, etc. So now, this covers
the auto-generation of the HTML I'd ultimately need. But what do I do with it?

Well, this is where `mustache.js` comes in. Mustache is a templating syntax, and let's
just say I'm going to find a lot more uses for it from now on. It's great, and this
project was the perfect usecase. In my case, I needed to take the Showdown-generated
HTML body of the post, insert the HTML `<head>` element with metadata above it,
and wrap that all in `<html>` tags. Basically, Mustache lets me create a template
for all my blog post HTML files, and insert some other HTML into it to create a
final render. This final render is what my Node webserver will serve when the
browser makes a request.

The template looks something like this:

```
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta name="description" content="{{title}}">
    <title>{{title}} | Derek Andersen</title>
  </head>
  <body>
    <div class="blog-wrapper">
      <p class="blog-title">{{title}}</p>
      <p style="text-align: right;">{{date}}</p>

      {{{body}}}

    </div>
  </body>
</html>
```

Notice all the double and triple 'mustaches' padding the placeholder variables?
That's where Mustache gets its name. When there's double padding, that means it will
be replaced with whatever the variable is (HTML-escaped), and when there's triple
padding, that means it will be replaced with the raw HTML. This is why the `{{{body}}}`
placeholder has triple padding, because that refers to the Showdown-generated HTML for the
post's body. The other variables (`title` and `date`) come from a special section
of each Markdown blog post at the top, where metadata can be specified.

Another benefit I wanted to incorporate into the blog engine was the automation
of site-wide reflection of new blog posts, wherever they might need to be referred
to. For example, on the main blog page, there needed to be a list of all posts,
along with their number, date, and a link to their page. This was also a job for
Mustache, because it comes with another function: Sections. This is a syntax that
allows you to use a 'range' as a placeholder, and pass to it an iterable object,
like an array, to create a list of items in the rendered file.

For example:

```
{{#entries}}
{{{r}}}
{{/entries}}
```

This Section iterates through an array of blog entries, where `r` refers to the
render, or the Mustache-ified post. This allowed me to take a bit of HTML for each
blog entry on the main blog page, and use it as a template, filling it in with the metadata
of each entry, before passing it to this Section which creates the final page render.

## Plans for the future

While I'm very satisfied with this project and excited to utilize it, I still have some
things I want to add to make it even better. One of these things is a tag system, which
would let me add a `topics` list to the metadata of each blog post. It would include things like
'technology', 'games', 'typography', etc. Then, I can make the topics appear in the footer
of each blog post, and upon clicking them, they would link to a page that lists all other
blog posts that share the topic.

I also think it would be interesting to add a star-giving system, by which readers can award
'stars' to particular blog posts if they like them. I don't see this being used all that much,
but I think it would be cool to do just to collect some data.


## Learning outcomes

I'm very happy with how this project turned out. I had guidance from a friend of mine
much more knowledgeable than I am, so I can't say I figured all of this out on my own.
But I'm happy with what I learned, and I feel more confident in my ability to do backend
projects in the future.

I learned how to deploy a server-side Node app that handles web traffic and serves
HTML and other data types, responding to requests from the browser.

I learned how to convert Markdown to HTML, which will come in handy again when I
add a changelog system to my other website, [BanjoSpeedruns.com](https://banjospeedruns.com).

I learned how to use Mustache templates, which I can say with certainty that I will
be using again some time in the future.

I hope that the ease of writing posts with the new blog engine makes me more
inclined to do so. I enjoy writing, and I have a lot more blog post ideas lined
up.

Until next time.
