#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require('fs');
const RSS = require('rss');
var showdown = require('showdown');
const mustache = require('mustache');
const path = require("path");
const config = require("./config.json");


// create webserver
http.createServer((req, res) => {
	let responseCode = 404;
	let content = fs.readFileSync('../404.html');
	const urlObj = url.parse(req.url, true);
	console.log('Browser requested '+urlObj.pathname);

	var mainPages = ['home', 'about', 'projects', 'links', 'contact'];
	var secondaryPages = ['support', 'solus', 'daisy', 'endorsements'];

	// class map to map html tags to certain classes so that css can select them
	// this makes all the <p> tags in the blog posts "text" class
	const classMap = {
		p : 'text'
	}
	const bindings = Object.keys(classMap)
	.map(key => ({
	type: 'output',
	regex: new RegExp(`<${key}>`, 'g'),
	replace: `<${key} class="${classMap[key]}">`
	}));

	// make a new showdown converter with the bindings from the class map
	converter = new showdown.Converter({
		extensions: [...bindings],
		metadata: true,
		openLinksInNewWindow: true,
		parseImgDimension: true
	});

	// check to see if the URL is just 'blog', to serve the main blog page
	if (urlObj.pathname.split('/')[1] === 'blog' && !urlObj.pathname.split('/')[2]) {
		// CODE TO CREATE BLOG ENTRY PAGE
		var view = {
			"entries": []
		}

		const dir = '../blog-posts';
		const files = fs.readdirSync(dir);

		files.forEach(file => {
  		if (path.extname(file) == ".md") {
				body = fs.readFileSync('../blog-posts/'+file, 'utf8');
	            html_body = converter.makeHtml(body);
	            metadata = converter.getMetadata();
				title = metadata.title;
				date = metadata.date;
				number = metadata.number;
				description = metadata.description;
                finished = metadata.finished;
				filename = path.basename(file, '.md');
				rendered = renderEntry(title, date, number, description, filename);
                if (finished === 'true') {
    		        view.entries.push({r: rendered, n: number});
                }
			}
		})

		responseCode = 200;
		template = fs.readFileSync('../templates/blog-page.mustache', 'utf8');
		// sort the entries in 'view' by their number (n) before rendering
		Array.prototype.sortBy = function(p) {
			return this.slice(0).sort(function(a,b) {
				return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
			});
		}
		view.entries = view.entries.sortBy('n');
		blog = mustache.render(template, view);
		content = blog;
	}

	// rss feed
	else if (req.url === '/blog/feed.xml') {
		try {
			responseCode = 200;

			var view = {
				"entries": []
			}

			const feed = new RSS({
				title: 'Blog | Derek Andersen',
				description: 'Derek Andersen\'s Blog',
				feed_url: 'https://derekandersen.net/blog/feed.xml',
				site_url: 'https://derekandersen.net/blog',
				language: 'en',
			});

			const dir = '../blog-posts';
			const files = fs.readdirSync(dir);

			files.forEach(file => {
			if (path.extname(file) == ".md") {
					body = fs.readFileSync('../blog-posts/'+file, 'utf8');
					html_body = converter.makeHtml(body);
					metadata = converter.getMetadata();
					title = metadata.title;
					date = metadata.date;
					number = metadata.number;
					description = metadata.description;
					finished = metadata.finished;
					slug = path.basename(file, '.md');
					if (finished === 'true') {
						view.entries.push({html_body: html_body, title: title, slug: slug, date: date, n: number});
					}
				}
			})

			Array.prototype.sortBy = function(p) {
				return this.slice(0).sort(function(a,b) {
					return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
				});
			}
			view.entries = view.entries.sortBy('n');
			view.entries.slice(0, 5).forEach(post => {
				feed.item({
				title: post.title,
				url: `https://derekandersen.net/blog/${post.slug}`,
				guid: `https://derekandersen.net/blog/${post.slug}`,
				date: post.date,
				description: makeAbsoluteUrls(post.html_body), // full HTML content here
				});
			});
			
			const content = feed.xml({ indent: true });

			res.writeHead(responseCode, {
				//'content-type': 'text/xml', // dev (so you can read it in browser)
				'content-type': 'application/rss+xml', // production
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}

	// latest blog post
	else if (req.url === '/blog/latest') {
		try {
			var view = {
				"entries": []
			}

			const dir = '../blog-posts';
			const files = fs.readdirSync(dir);

			files.forEach(file => {
			if (path.extname(file) == ".md") {
					body = fs.readFileSync('../blog-posts/'+file, 'utf8');
					html_body = converter.makeHtml(body);
					metadata = converter.getMetadata();
					title = metadata.title;
					date = metadata.date;
					number = metadata.number;
					description = metadata.description;
					finished = metadata.finished;
					filename = path.basename(file, '.md');
					if (finished === 'true') {
						view.entries.push({f: filename, n: number});
					}
				}
			})

			// sort the entries in 'view' by their number (n)
			Array.prototype.sortBy = function(p) {
				return this.slice(0).sort(function(a,b) {
					return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
				});
			}
			view.entries = view.entries.sortBy('n');
			const latestPost = view.entries[0].f; 
			responseCode = 301; // for permanent redirect
			res.writeHead(responseCode, {
						Location: `/blog/${latestPost}`
					});
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}


	// check for /blog/tag urls
	else if (urlObj.pathname.split('/')[1] === 'blog' && urlObj.pathname.split('/')[2] === 'tag' && urlObj.pathname.split('/')[3]) {
		const requested_tag = urlObj.pathname.split('/')[3].trim().toLowerCase();
		// CODE TO CREATE TAG-SPECIFIC BLOG ENTRY PAGE
		var view = {
			"tagged_entries": []
		}

		const dir = '../blog-posts';
		const files = fs.readdirSync(dir);

		files.forEach(file => {
  		if (path.extname(file) == ".md") {
				body = fs.readFileSync('../blog-posts/'+file, 'utf8');
	            html_body = converter.makeHtml(body);
	            metadata = converter.getMetadata();
				title = metadata.title;
				date = metadata.date;
				number = metadata.number;
				description = metadata.description;
				tags = createTagArray(metadata.tags);
                finished = metadata.finished;
				filename = path.basename(file, '.md');
				rendered = renderEntry(title, date, number, description, filename);
                if (finished === 'true' && tags.some(tag => tag.name === requested_tag)) {
    		        view.tagged_entries.push({r: rendered, n: number});
                }
			}
		})
		
			responseCode = 200;
			// sort the entries in 'view' by their number (n) before rendering
			Array.prototype.sortBy = function(p) {
				return this.slice(0).sort(function(a,b) {
					return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
				});
			}
			view.tagged_entries = view.tagged_entries.sortBy('n');
			blog = renderDynamicTagPage(requested_tag, view.tagged_entries);
			content = blog;
	}

	

	// individual blog posts
	else if (urlObj.pathname.split('/')[1] === 'blog' && urlObj.pathname.split('/')[2]) {
		selection = urlObj.pathname.split('/')[2];
		try {
			responseCode = 200;
			body = fs.readFileSync(`../blog-posts/${selection}.md`, 'utf8');
			html_body = converter.makeHtml(body);
			// showdown (markdown) converter for mapping html tags to certain classes
			metadata = converter.getMetadata();
			tags = createTagArray(metadata.tags);
			content = renderPost(metadata.title, metadata.date, tags, html_body);
			res.writeHead(responseCode, {
				'content-type': 'text/html;charset=utf-8',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.error(err);
		}
	}

	// main pages
	else if ((mainPages.includes(urlObj.pathname.split('/')[1].split('.')[0]) && !urlObj.pathname.split('/')[2])) {
		try {
		responseCode = 200;
		var url_pagename = urlObj.pathname.split('/')[1].split('.')[0];
		pagetitle = String(url_pagename).charAt(0).toUpperCase() + String(url_pagename).slice(1);
		pagecontent = fs.readFileSync(`../mustache/${url_pagename}.mustache`, 'utf8');
		content = renderMainPage(pagetitle, pagecontent);
				res.writeHead(responseCode, {
					'content-type': 'text/html;charset=utf-8',
				});
				res.write(content);
				res.end();
				return;
		}
			catch (err) {
				console.error(err);
		}
	}

	// secondary pages
	else if ((secondaryPages.includes(urlObj.pathname.split('/')[1].split('.')[0]) && !urlObj.pathname.split('/')[2])) {
		try {
		responseCode = 200;
		var url_pagename = urlObj.pathname.split('/')[1].split('.')[0];
		pagetitle = String(url_pagename).charAt(0).toUpperCase() + String(url_pagename).slice(1);
		pagecontent = fs.readFileSync(`../mustache/${url_pagename}.mustache`, 'utf8');
		content = renderSecondaryPage(pagetitle, pagecontent);
				res.writeHead(responseCode, {
					'content-type': 'text/html;charset=utf-8',
				});
				res.write(content);
				res.end();
				return;
		}
			catch (err) {
				console.error(err);
		}
	}

	// games pages
	else if (urlObj.pathname.split('/')[1] === 'games' && urlObj.pathname.split('/')[2]) {
		game = urlObj.pathname.split('/')[2].split('.')[0];
		try {
			responseCode = 200;
			content = fs.readFileSync(`../games/${game}.html`, 'utf8');
			res.writeHead(responseCode, {
				'content-type': 'text/html;charset=utf-8',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.error(err);
		}
	}

	else if (urlObj.pathname.endsWith('.js')) {
		try {
			responseCode = 200;
			content = fs.readFileSync('..'+urlObj.pathname, 'utf8');
			res.writeHead(responseCode, {
				'content-type': 'text/javascript;charset=utf-8',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}

	else if (urlObj.pathname.endsWith('.css')) {
		try {
			responseCode = 200;
			content = fs.readFileSync('..'+urlObj.pathname, 'utf8');
			res.writeHead(responseCode, {
				'content-type': 'text/css;charset=utf-8',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}

	else if (urlObj.pathname.endsWith('.png')) {
		try {
			responseCode = 200;
			content = fs.readFileSync('..'+urlObj.pathname);
			res.writeHead(responseCode, {
				'content-type': 'image/png',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}

	else if (urlObj.pathname.endsWith('.pdf')) {
		try {
			responseCode = 200;
			content = fs.readFileSync('..'+urlObj.pathname);
			res.writeHead(responseCode, {
				'content-type': 'application/pdf',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}

	else if (urlObj.pathname.endsWith('.jpg') || urlObj.pathname.endsWith('.jpeg')) {
		try {
			responseCode = 200;
			content = fs.readFileSync('..'+urlObj.pathname);
			res.writeHead(responseCode, {
				'content-type': 'image/jpeg',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});
	res.write(content);
	res.end();
})
	.listen(config.PORT);


// splits tags string from metadata.tags (e.g. "tag1, tag2, tag3") into an actual array of tag objects
// each item in the array is a js object with {name, url, isLast} parameters
// isLast is for checking whether a tag in the array is the last or not; if it is, we won't add the ", " in the html
function createTagArray (tags_string) {
	const tags_string_list = tags_string
  		.split(',')
  		.map(item => item.trim().toLowerCase())
  		.filter(item => item.length > 0);
	const tags_object_array = tags_string_list.map((tag, i, arr) => ({
	name: tag,
	url: `/blog/tag/${encodeURIComponent(tag)}`,
	isLast: i === arr.length - 1
	}));
	return tags_object_array;
}

// Returns the rendered HTML of a single blog post page
function renderPost (title, date, tags, body) {
  template = fs.readFileSync('../templates/blog-post.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, tags: tags, body: body });
  return rendered;
}

// Returns the rendered HTML of a blog entry for the blog page
function renderEntry (title, date, number, description, filename) {
  template = fs.readFileSync('../templates/blog-list-entry.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, number: number, description: description, filename: filename });
  return rendered;
}

// Returns the rendered HTML of a blog entry for the blog page
function renderDynamicTagPage (requested_tag, tagged_entries) {
  template = fs.readFileSync('../templates/blog-tag-page.mustache', 'utf8');
  rendered = mustache.render(template, { tag: requested_tag, tagged_entries: tagged_entries });
  return rendered;
}

// Returns the rendered HTML of a main page (a page with the header)
function renderMainPage (pagetitle, pagecontent) {
  template = fs.readFileSync('../templates/main-page.mustache', 'utf8');
  rendered = mustache.render(template, { pagetitle: pagetitle, pagecontent: pagecontent });
  return rendered;
}

// Returns the rendered HTML of a secondary page
function renderSecondaryPage (pagetitle, pagecontent) {
  template = fs.readFileSync('../templates/secondary-page.mustache', 'utf8');
  rendered = mustache.render(template, { pagetitle: pagetitle, pagecontent: pagecontent });
  return rendered;
}

// for converting relative urls in blog posts to absolute links (for rss feed only)
function makeAbsoluteUrls(htmlContent) {
  const baseUrl = 'https://derekandersen.net';

  return htmlContent
    // Fix image `src` attributes
    .replace(/src=["'](?:\.\.\/)?(\/?static\/[^"']+)["']/g, (match, path) => {
      return `src="${baseUrl}/${path.replace(/^\/+/, '')}"`;
    })

    // Fix anchor `href` attributes to internal blog links
    .replace(/href=["']\/(blog\/[^"']+)["']/g, (match, path) => {
      return `href="${baseUrl}/${path}"`;
    });
}
