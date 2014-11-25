// Using CoffeeScript.
require('coffee-script/register');

// HTTP integration.
require('./server/http');

// HTTPS integration.
require('./server/https');

if (require('./auth/utils').isAvailable('http-proxy')) { // Only if http-proxy is available.
	// Proxy integration.
	require('./server/proxy');
}

// Exporting.
module.exports = {
    basic: function(options, checker) { return require('./auth/basic')(options, checker); },
    digest: function(options, checker) { return require('./auth/digest')(options, checker); },
    connect: function(authentication) { return require('./server/connect')(authentication); }
};