# [derekandersen.net](https://derekandersen.net)
The code that runs my personal website.

## Philosophy
I tried to keep the visual design and backend code simple when working on this website. It should be simple visually so it's not overwhelming to look at, and it should be simple technically so I don't forget how things work and I can upgrade/troubleshoot it easily.

However, even though this website uses templating to reduce redundant HTML and make writing content easier, I still like to have the option to write plain HTML that will get injected into those templates. I find that it's not a big deal since those pages are short and simple, and it's easy to adjust styling on the fly if I need to.

## Style
I take a lot of typographical inspiration from Matthew Butterick's web book [Practical Typography](https://practicaltypography.com) — it has answers to all the questions you could think of relating to good typography.

## Backend
The site's pages are served with a Node webserver at `backend/server.js`. The majority of the site's pages are dynamically built using Mustache as a templating system. Templates for pages are in `templates` and HTML-like Mustache content files for pages are in `mustache`.

### Main pages
The main pages listed in the navbar (about/blog/projects/links/contact) are built from the template `templates/main-page.mustache` and use some client-side JavaScript (in `javascript/header.js`) to mark which tab is currently active.

### Secondary pages
The pages that are not listed in the navbar are built from the template `templates/secondary-page.mustache`, but they don't use the client-side JavaScript to handle marking the active navbar tabs.

### Blog
I wrote a custom "blog engine" within the main webserver script (`backend/server.js`) to handle building/serving the individual posts. It uses Mustache as a templating system and Showdown.js to convert Markdown to HTML, so I can write my entries in Markdown (easy and reduces friction). Here is [a blog post about the engine](https://derekandersen.net/blog/new-blog-engine).

## Usage
You can use this code to run your own website if you'd like. Just make sure to remove all instances of my name, my writings, my assets (like images), and all other information relevant to me.

It will require some adaptation so it works for your web hosting setup. But assuming you have a web server like [`nginx`](https://nginx.org/en/) already set up for your site, then all you need to do to start the Node server is `cd` into `backend` and run
```
npm i
node server.js
```
and it should run. You can also of course run this command locally to test the setup on your localhost.

There is an example script that you can adapt for your own purposes at `scripts/update_website.sh`. This stops the currently running Node service (which you'd need to set up), pulls changes from the `git` repo for the site, copies the website files where they need to go, and restarts the server.