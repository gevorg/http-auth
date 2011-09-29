# http-auth
[Node.js](http://nodejs.org/) module for HTTP basic and digest access authentication.

## Installation

Via git (or downloaded tarball):

	$ git clone git://github.com/gevorg/http-auth.git

Via [npm](http://npmjs.org/):

	$ npm install http-auth
	
## Digest access authentication usage

	/**
	 * HTTP authentication module.
	 */
	var auth = require('http-auth');
	
	/**
	 * HTTP module.
	 */
	var http = require('http');
	
	/**
	 * Requesting new digest access authentication instance.
	 */
	var digest = auth.digest({
		authRealm : 'Private area with digest access authentication.',
		authList : ['Shi:many222', 'Lota:123456'],
		algorithm : 'MD5-sess' //Optional, default is MD5.
	});
	
	/**
	 * Creating new HTTP server.
	 */
	http.createServer(function(req, res) {
		// Apply authentication to server.
		digest.apply(req, res, function() {
			res.end('Welcome to private area with digest access authentication!');
		});
	}).listen(1337);
	
	// Log url.
	console.log('Server running at http://127.0.0.1:1337/');

## Basic access authentication usage

	/**
	 * HTTP authentication module.
	 */
	var auth = require('http-auth');
	
	/**
	 * HTTP module.
	 */
	var http = require('http');
	
	/**
	 * Requesting new basic access authentication instance.
	 */
	var basic = auth.basic({
		authRealm : 'Private area with basic access authentication.',
		authList : ['mia:supergirl', 'Carlos:test456', 'Sam:oho']
	});
	
	/**
	 * Creating new HTTP server.
	 */
	http.createServer(function(req, res) {
		// Apply authentication to server.
		basic.apply(req, res, function() {
			res.end('Welcome to private area with basic access authentication!');
		});
	}).listen(1337);
	
	// Log url.
	console.log('Server running at http://127.0.0.1:1337/');

## You can load users from file

	/**
	 * HTTP authentication module.
	 */
	var auth = require('http-auth');
	
	/**
	 * HTTP module.
	 */
	var http = require('http');
	
	/**
	 * Requesting new digest access authentication instance.
	 */
	var digest = auth.digest({
		authRealm : 'Private area with digest access authentication.',
		authFile : __dirname + "/users.htpasswd"
	});
	
	/**
	 * Creating new HTTP server.
	 */
	http.createServer(function(req, res) {
		// Apply authentication to server.
		digest.apply(req, res, function() {
			res.end('Welcome to private area with digest access authentication!');
		});
	}).listen(1337);
	
	// Log url.
	console.log('Server running at http://127.0.0.1:1337/');

## You can also use it with [express framework](http://expressjs.com/)

	/**
	 * HTTP authentication module.
	 */
	var auth = require('http-auth');
	
	/**
	 * Express module.
	 */
	var express = require('express');
	
	/**
	 * Requesting new digest access authentication instance.
	 */
	var digest = auth.digest({
		authRealm : 'Private area with digest access authentication.',
		authList : ['Shi:many222', 'Lota:123456'],
		algorithm : 'MD5-sess' //Optional, default is MD5.
	});
	
	/**
	 * Creating new server.
	 */
	var app = express.createServer();
	
	/**
	 * Handler for digest path, with digest access authentication.
	 */
	app.get('/', digest.apply, function(req, res) {
		res.send('Welcome to private area with digest access authentication!');
	});
	
	/**
	 * Start listenning 1337 port.
	 */
	app.listen(1337);
	
	// Log url.
	console.log('Server running at http://127.0.0.1:1337/');


## Configurations

 - **authRealm** - Authentication realm.
 - **authFile** - File where user details are stored in format {user:pass}.
 - **authList** - List where user details are stored in format {user:pass}, ignored if authFile is specified.
 - **algorithm** - Algorithm that will be used for authentication, may be MD5 or MD5-sess, optional, default is MD5. ONLY FOR DIGEST!

## Dependencies

 - **[node-uuid](https://github.com/broofa/node-uuid/)** - Generate RFC4122(v4) UUIDs, and also non-RFC compact ids.

## License

(The MIT License)

Copyright (c) 2011 Gevorg Harutyunyan <i@gevorg.me>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.