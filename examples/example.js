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
var digest = auth({
	authRealm : 'Private area.',
	authList : ['mia:supergirl', 'Carlos:test456', 'Sam:oho']
});

/**
 * Creating new HTTP server.
 */
http.createServer(function(req, res) {
	// Apply authentication to server.
	digest.apply(req, res, function() {
		res.end('Welcome to private area!');
	});
}).listen(1337);

// Log url.
console.log('Server running at http://127.0.0.1:1337/');