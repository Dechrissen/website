#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require('fs');
const fetch = require('node-fetch');
var showdown = require('showdown');
const mustache = require('mustache');
const config = require("./config.json");


// webserver for blog
http.createServer((req, res) => {
	let responseCode = 404;
	let content = '404 Error';
	const urlObj = url.parse(req.url, true);

	if (urlObj.pathname.split('/')[1] === 'blog') {

    // class map to map html tags to certain classes so that css can select them
    const classMap = {
      //p : 'text'
    }
    const bindings = Object.keys(classMap)
    .map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}(.*)>`, 'g'),
    replace: `<${key} class="${classMap[key]}" $1 >`
    }));

    // make a new showdown converter with the bindings from the class map
    converter = new showdown.Converter({
      extensions: [...bindings],
      metadata: true,
      openLinksInNewWindow: true
    });

    if (urlObj.pathname.split('/')[2] === 'cool') {
      responseCode = 200;
      body = fs.readFileSync('../blog/foo.md', 'utf8');
      html_body = converter.makeHtml(body);
      metadata = converter.getMetadata();
      content = renderMustache(metadata.title, metadata.date, html_body);
    }
    else if (urlObj.pathname.split('/')[2] === 'fun') {
      responseCode = 200;
      text = '# fun!';
      html = converter.makeHtml(text);
      content = html;
    }
    else {
      text = '### sorry we dont have that blog post';
      html = converter.makeHtml(text);
      content = html;
    }

	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});
	res.write(content);
	res.end();
})
	.listen(config.BLOG_PORT);

function renderMustache (title, date, body) {
  template = fs.readFileSync('../blog/blog-template.mustache', 'utf8');
  rendered = mustache.render(template, { blogtitle: title, blogdate: date, blogbody: body });
  return rendered;
}
