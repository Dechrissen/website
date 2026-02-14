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
	// 404 fallback
	let responseCode = 404;
	template = fs.readFileSync('../templates/main-page.mustache', 'utf8');
	pagecontent = fs.readFileSync(`../mustache/404.mustache`, 'utf8');
	footer =  fs.readFileSync(`../mustache/footer.mustache`, 'utf8');
	rssFooter = fs.readFileSync(`../mustache/rss-footer.mustache`, 'utf8');
	let content = mustache.render(template, {pagetitle: '404', pagecontent: pagecontent, footer: footer});

	// Base headers
	const headers = {
		'content-type': 'text/html;charset=utf-8',
	};

	const urlObj = url.parse(req.url, true);
	console.log('Browser requested ' + urlObj.pathname);

	var mainPages = ['about', 'projects', 'links', 'contact']; // excluding blog as it's handled separately
	var secondaryPages = ['support', 'solus', 'daisy', 'endorsements', 'software'];

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

	if ((req.url === '/' || req.url === '/home')) {
  		try {
		responseCode = 200;
		pagetitle = 'Home'
		pagecontent = fs.readFileSync(`../mustache/home.mustache`, 'utf8');
		content = renderMainPage(pagetitle, pagecontent, footer);
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

	// main blog landing page
	else if (req.url === '/blog') {
		var view = {
			pagetitle: "Blog",
			pagecontent: "<h1>All posts</h1>",
			"entries": [],
			footer: footer,
			renderRssFooter: true,
			rssFooter: rssFooter
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
		template = fs.readFileSync('../templates/main-page.mustache', 'utf8');
		
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
					// title = metadata.title;
					// date = metadata.date;
					number = metadata.number;
					// description = metadata.description;
					finished = metadata.finished;
					filename = path.basename(file, '.md');
					if (finished === 'true') {
						view.entries.push({f: filename, n: number});
					}
				}
			})

			view.entries = view.entries.sortBy('n');
			const latestPost = view.entries[0].f; 
			responseCode = 302; // for temporary redirect
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

	// random blog post
	else if (req.url === '/blog/random') {
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
					// title = metadata.title;
					// date = metadata.date;
					number = metadata.number;
					// description = metadata.description;
					finished = metadata.finished;
					filename = path.basename(file, '.md');
					if (finished === 'true') {
						view.entries.push({f: filename, n: number});
					}
				}
			})

			const randomPost = view.entries[Math.floor(Math.random() * view.entries.length)].f; 
			responseCode = 302; // for temporary redirect
			res.writeHead(responseCode, {
						Location: `/blog/${randomPost}`
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
		var view = {
			pagetitle: `Posts tagged "${requested_tag}"`,
			pagecontent: `<h1>Posts tagged "${requested_tag}"</h1>`,
			"entries": [],
			renderRssFooter: true,
			rssFooter: rssFooter
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
    		        view.entries.push({r: rendered, n: number});
                }
			}
		})
		
		responseCode = 200;
		view.entries = view.entries.sortBy('n');
		if (view.entries.length == 0) {
			view.entries.push({r: "<div>No results</div>"});
		}
		template = fs.readFileSync('../templates/main-page.mustache', 'utf8');
		blog = mustache.render(template, view);
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
			content = renderPost(metadata.title, metadata.date, tags, html_body, rssFooter, footer);
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

	// robots.txt
	else if (req.url === '/robots.txt') {
		try {
			responseCode = 200;
			const robotsTxt = [
				'User-agent: *',
				'Disallow:',
				'',
				'Sitemap: https://derekandersen.net/sitemap.xml',
				''
				].join('\n');
			res.writeHead(responseCode, {
				'content-type': 'text/plain;charset=utf-8',
			});
			res.write(robotsTxt);
			res.end();
			return;
		}
		catch (err) {
			console.error(err);
		}
	}

	// sitemap.xml
	else if (req.url === '/sitemap.xml') {
		try {
			responseCode = 200;
			
			// Build the sitemap XML
			let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
			sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
			
			// Add static pages (some are main, some are secondary)
			const staticPages = ['', 'about', 'projects', 'blog', 'software', 'endorsements'];
			staticPages.forEach(page => {
				const url = page === '' ? 'https://derekandersen.net/' : `https://derekandersen.net/${page}`;
				sitemap += '  <url>\n';
				sitemap += `    <loc>${url}</loc>\n`;
				sitemap += '    <changefreq>weekly</changefreq>\n';
				sitemap += '    <priority>0.8</priority>\n';
				sitemap += '  </url>\n';
			});
			
			// Add all blog posts
			const dir = '../blog-posts';
			const files = fs.readdirSync(dir);
			
			files.forEach(file => {
				if (path.extname(file) == ".md") {
					body = fs.readFileSync('../blog-posts/'+file, 'utf8');
					html_body = converter.makeHtml(body);
					metadata = converter.getMetadata();
					finished = metadata.finished;
					filename = path.basename(file, '.md');
					date = metadata.date;
					
					if (finished === 'true') {
						sitemap += '  <url>\n';
						sitemap += `    <loc>https://derekandersen.net/blog/${filename}</loc>\n`;
						if (date) {
							sitemap += `    <lastmod>${date}</lastmod>\n`;
						}
						sitemap += '    <changefreq>monthly</changefreq>\n';
						sitemap += '    <priority>0.6</priority>\n';
						sitemap += '  </url>\n';
					}
				}
			});
			
			sitemap += '</urlset>';
			
			res.writeHead(responseCode, {
				'content-type': 'application/xml;charset=utf-8',
			});
			res.write(sitemap);
			res.end();
			return;
		}
		catch (err) {
			console.error(err);
		}
	}

	// main pages
	else if (mainPages.includes(req.url.split('/')[1]) && !req.url.split('/')[2]) {
		try {
		responseCode = 200;
		var url_pagename = req.url.split('/')[1].split('.')[0];
		pagetitle = String(url_pagename).charAt(0).toUpperCase() + String(url_pagename).slice(1);
		pagecontent = fs.readFileSync(`../mustache/${url_pagename}.mustache`, 'utf8');
		content = renderMainPage(pagetitle, pagecontent, footer);
		// Base headers
		const headers = {
			'content-type': 'text/html;charset=utf-8',
		};

		// prevent indexing for some main pages
		const noIndexPages = ['contact', 'links']
		if (noIndexPages.includes(url_pagename)) {
			headers['X-Robots-Tag'] = 'noindex, nofollow';
		}

		res.writeHead(responseCode, headers);
		res.write(content);
		res.end();
		return;
		}
			catch (err) {
				console.error(err);
		}
	}

	// secondary pages
	else if ((secondaryPages.includes(req.url.split('/')[1].split('.')[0]) && !req.url.split('/')[2])) {
		try {
		responseCode = 200;
		var url_pagename = req.url.split('/')[1].split('.')[0];
		pagetitle = String(url_pagename).charAt(0).toUpperCase() + String(url_pagename).slice(1);
		pagecontent = fs.readFileSync(`../mustache/${url_pagename}.mustache`, 'utf8');
		content = renderSecondaryPage(pagetitle, pagecontent, footer);
			// Base headers
			const headers = {
				'content-type': 'text/html;charset=utf-8',
			};

			// prevent indexing for support page (mainly for BTC address)
			if (url_pagename === 'support') {
				headers['X-Robots-Tag'] = 'noindex, nofollow';
			}
			
			res.writeHead(responseCode, headers);
			res.write(content);
			res.end();
			return;
		}
			catch (err) {
				console.error(err);
		}
	}

	// markdown (md) pages
	else if (urlObj.pathname.split('/')[1] === 'md' && urlObj.pathname.split('/')[2]) {
		selection = urlObj.pathname.split('/')[2];
		try {
			responseCode = 200;
			body = fs.readFileSync(`../md/${selection}.md`, 'utf8');
			html_body = converter.makeHtml(body);
			// showdown (markdown) converter for mapping html tags to certain classes
			metadata = converter.getMetadata();
			content = renderMD(metadata.title, html_body, footer);
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

	else if (urlObj.pathname.endsWith('.html')) {
		try {
			responseCode = 200;
			content = fs.readFileSync('..'+urlObj.pathname);
			res.writeHead(responseCode, {
				'content-type': 'text/html;charset=utf-8',
			});
			res.write(content);
			res.end();
			return;
		}
		catch (err) {
			console.log(err);
		}
	}

	// some pages to not index
	// (other than support, which is handled in secondaryPages for now,
	// and contact, which is handled in mainPages for now)
	if (urlObj.pathname.startsWith('/blog/tag/')) {
		headers['X-Robots-Tag'] = 'noindex, nofollow';
	}
	res.writeHead(responseCode, headers);
	res.write(content);
	res.end();
})
	.listen(config.PORT);


// for blog posts, to sort the entries in 'view' by their number (n)
Array.prototype.sortBy = function(p) {
	return this.slice(0).sort(function(a,b) {
		return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
	});
}

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
function renderPost (title, date, tags, body, rssFooter, footer) {
  template = fs.readFileSync('../templates/blog-post.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, tags: tags, body: body, rssFooter: rssFooter, footer: footer });
  return rendered;
}

// Returns the rendered HTML of a markdown page
function renderMD (pagetitle, pagecontent, footer) {
  template = fs.readFileSync('../templates/md.mustache', 'utf8');
  rendered = mustache.render(template, { pagetitle: pagetitle, pagecontent: pagecontent, footer: footer });
  return rendered;
}

// Returns the rendered HTML of a blog entry for the blog page
function renderEntry (title, date, number, description, filename) {
  template = fs.readFileSync('../templates/blog-list-entry.mustache', 'utf8');
  rendered = mustache.render(template, { title: title, date: date, number: number, description: description, filename: filename });
  return rendered;
}

// Returns the rendered HTML of a main page (a page with the header)
function renderMainPage (pagetitle, pagecontent, footer) {
  template = fs.readFileSync('../templates/main-page.mustache', 'utf8');
  rendered = mustache.render(template, { pagetitle: pagetitle, pagecontent: pagecontent, footer: footer });
  return rendered;
}

// Returns the rendered HTML of a secondary page
function renderSecondaryPage (pagetitle, pagecontent, footer) {
  template = fs.readFileSync('../templates/secondary-page.mustache', 'utf8');
  rendered = mustache.render(template, { pagetitle: pagetitle, pagecontent: pagecontent, footer: footer });
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