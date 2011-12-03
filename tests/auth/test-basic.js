/**
 * Basic authentication module.
 */
var Basic = require('../../lib/auth/basic');

/**
 * Default setup module.
 */
var defaults = require('../../lib/defaults');

/**
 * Mock module.
 */
var nodemock = require("nodemock");

/**
 * Source of test.
 */
var source;

/**
 * Setup.
 */
exports['setUp'] = function(callback) {
	// Initiates basic instance before each test.
	source = new Basic("AweSome REALM", ["userhash1", "userhash2"]);
	// GOD knows why I need to call this.
	callback();
}

/**
 * Test for ask.
 */
exports['testAsk'] = function(test) {
	// Response mock(setHeader).
	var response = nodemock.mock("setHeader").takes("WWW-Authenticate", 
		"Basic realm=\"AweSome REALM\"");
	// Response mock(writeHead).
	response.mock("writeHead").takes(401);
	// Response mock(end).
	response.mock("end").takes(defaults.HTML_401);
	
	// Source method call.
	source.ask(response);
	
	// Asserts all mock expectations.
	response.assert();
	// Test is done.
	test.done();
};