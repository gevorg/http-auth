/**
 * HTTP authentication module.
 */
var auth = require('../lib/http-auth');

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
