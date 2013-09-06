// Using CoffeeScript.
require('coffee-script');

// HTTP integration.
require('./server/http');

// HTTPS integration.
require('./server/https');

// Proxy integration.
require('./server/proxy');

// Connect integration.
var connect = require('./server/connect');

// Basic authentication module.
var basic = require('./auth/basic');

// Digest authentication module.
var digest = require('./auth/digest');

// Exporting.
module.exports = {
	basic: basic,
	digest: digest,
	connect: connect
};