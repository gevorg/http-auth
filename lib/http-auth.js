/**
 * Authentication provider.
 */
var provider = require('./provider');

/**
 * Parser module for authentication input options.
 */
var optionParser = require('./option_parser');

/**
 * Requests new authentication instance from authentication provider.
 */
module.exports = {
	/**
	 * Requests basic authentication instance from provider.
	 *
	 * @param {Array} options options that may be used for authentication.
	 *
	 *	- authRealm authentication realm.
	 *	- authFile file where user details are stored in format {user:pass}.
	 *	- authList list where user details are stored in format {user:pass}, ignored if authFile is specified.
	 */
	'basic' : function(options) {
		// Parsing options.
		var parsedOptions = optionParser.parseBasic(options);
		// Requesting new basic instance.
		return provider.basic(parsedOptions);
	},
	/**
	 * Requests digest authentication instance from provider.
	 *
	 * @param {Array} options options that may be used for authentication.
	 *
	 *	- authRealm authentication realm.
	 *	- authFile file where user details are stored in format {user:pass}.
	 *	- authList list where user details are stored in format {user:pass}, ignored if authFile is specified.
	 *	- algorithm algorithm that will be used, may be MD5 or MD5-sess, optional, default is MD5.
	 */
	'digest' : function(options) {
		// Parsing options.
		var parsedOptions = optionParser.parseDigest(options);
		// Requesting new digest instance.
		return provider.digest(parsedOptions);
	}
};
