/**
 * Modules.
 */
var fs = require('fs'), util = require('./util'), defaults = require('./defaults');

/**
 * Module for parsing input options.
 */
module.exports = {
	/**
	 * Parsing input options for basic access authentication.
	 *
	 * @param {Array} options initial options.
	 */
	'parseBasic' : function(options) {
		return this.parse(options, 'basic');
	},
	/**
	 * Parsing input options for digest access authentication.
	 *
	 * @param {Array} options initial options.
	 */
	'parseDigest' : function(options) {
		options = this.parse(options, 'digest');

		if(!options.algorithm) {
			options['algorithm'] = defaults.DEFAULT_ALGO;
		}

		return options;
	},
	/**
	 * Parsing input options for digest access authentication.
	 *
	 * @param {Array} options initial options.
	 * @param {String} type may be 'digest' | 'basic'.
	 */
	'parse' : function(options, type) {
		// Checking authentication realm.
		var authRealm = options['authRealm'];
		if(!authRealm)
			throw new Error('Authentication realm is mandatory');

		// Authentication users.
		var authUsers = new Array();
		var authList = options['authList'];

		// If authFile is provided.
		var authFile = options['authFile'];
		if(authFile) {
			authList = fs.readFileSync(authFile, 'UTF-8').toString().split('\n');
		}

		for(authItem in authList) {
			var authLine = authList[authItem];

			if(type == 'digest') {
				var authTokens = authLine.split(":");
				// Constructing A1 for digest access authentication.
				authUsers[authTokens[0]] = authTokens[0] + ":" + authRealm + ":" + authTokens[1];
			} else if(type == 'basic') {
				// Pushing token to users array.
				authUsers.push(util.base64(authLine));
			} else {
				throw new Error('Invalid type, may be digest | basic!');
			}
		}

		// Setting authUsers.
		options['authUsers'] = authUsers;

		return options;
	}
};
