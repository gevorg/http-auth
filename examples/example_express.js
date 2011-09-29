/**
 * HTTP authentication module.
 */
var auth = require('../lib/http-auth');

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
