/**
 * HTTP authentication module.
 */
var auth = require('../lib/http-auth');

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
