/**
 * HTTP authentication module.
 */
var auth = require('../lib/http-auth');

/**
 * HTTP module.
 */
var http = require('http');

/**
 * Requesting new authentication instance.
 */
var basic = auth({
	authRealm : "Private area.",
	authList : ['mia:ec00f63f319ce3720c613cf337780f81'],
	password : 'encrypted'
});

/**
 * Creating new HTTP server.
 */
http.createServer(function(req, res) {
	// Apply authentication to server.
	basic.apply(req, res, function() {
		res.end("Welcome to private area!");
	});
}).listen(1337);

// Log url.
console.log("Server running at http://127.0.0.1:1337/");