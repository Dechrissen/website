# [derekandersen.net](https://derekandersen.net)
The code and static pages for my personal website.

## Main pages
The site uses JavaScript and in some cases jQuery to build certain
parts of each page.

The main pages (home/about/blog/projects/links/contact) use `/JavaScript/header.js` and
`/JavaScript/footer.js` to build the header and footer respectively. These
contain the website title and a top navigation bar,
and a 'last updated' timestamp.

## Blog
I wrote a custom blog engine to handle the blog homepage and all of the individual posts. It uses Mustache as a templating tool and Showdown.js to convert Markdown to HTML, so I can write my entries in Markdown. Here is [a blog post about the engine](https://derekandersen.net/blog/new-blog-engine).
