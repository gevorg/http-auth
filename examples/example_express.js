/**
 * HTTP authentication module.
 */
var auth = require('../lib/http-auth');

/**
 * Express module.
 */
var express = require('express');

/**
 * Requesting new authentication instance.
 */
var digest = auth({
	authRealm : "Private area.",
	authList : ['Shi:many222', 'Lota:123456']
});

/**
 * Creating new server.
 */
var app = express.createServer();

/**
 * Handler for path with authentication.
 */
app.get('/', digest.apply, function(req, res) {
	res.send("Welcome to private area!");
});

/**
 * Start listenning 1337 port.
 */
app.listen(1337);

// Log url.
console.log("Server running at http://127.0.0.1:1337/");