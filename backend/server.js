#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require('fs');
const fetch = require('node-fetch');
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

	// check to see if the URL is just 'blog' or 'blog.html', to serve the main blog page
	if ((urlObj.pathname.split('/')[1] === 'blog.html' && !urlObj.pathname.split('/')[2])
		|| (urlObj.pathname.split('/')[1] === 'blog' && !urlObj.pathname.split('/')[2])) {
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

	else if (urlObj.pathname.endsWith('.xml')) {
		try {
			responseCode = 200;
			content = fs.readFileSync('..'+urlObj.pathname);
			res.writeHead(responseCode, {
				'content-type': 'text/xml',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
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
			content = renderPost(metadata.title, metadata.date, html_body);
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


// Returns the rendered HTML of a single blog post page
function renderPost (title, date, body) {
  template = fs.readFileSync('../templates/blog-post.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, body: body });
  return rendered;
}

// Returns the rendered HTML of a blog entry for the blog page
function renderEntry (title, date, number, description, filename) {
  template = fs.readFileSync('../templates/blog-list-entry.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, number: number, description: description, filename: filename });
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