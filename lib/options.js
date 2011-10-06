/**
 * Modules.
 */
var fs = require('fs'), utils = require('./utils'), defaults = require('./defaults');

/**
 * Parsing input options for digest access authentication.
 *
 * @param {Array} options initial options.
 * @return {Array} array with parsed options.
 */
module.exports = function(options) {
	// Checking for options.
	if(!options) {
		throw new Error("Authentication options are empty!");
	}
	
	// Checking authType.
	var authType = options['authType'];
	if(!authType) {
		authType = options['authType'] = 'digest';
	}
			
	if(!(authType in {'digest' : 1, 'basic' : 1})) {
		throw new Error("Authentication type may be digest or basic!");		
	}
	
	// Checking for algorithm.
	if(!options.algorithm) {
		options['algorithm'] = defaults.DEFAULT_ALGO;
	}
	if(!(options.algorithm in {'MD5' : 1, 'MD5-sess' : 1})) {
		throw new Error("Authentication algorithm may be MD5 or MD5-sess!");		
	}
	
	// Checking authentication realm.
	var authRealm = options['authRealm'];
	if(!authRealm) {
		throw new Error("Authentication realm is mandatory!");
	}

	// Authentication users.
	var authUsers = new Array();
	var authList = options['authList'];

	// If authFile is provided.
	var authFile = options['authFile'];
	if(authFile) {
		authList = fs.readFileSync(authFile, 'UTF-8').toString().split('\n');
	}
	
	// Checking authentication list.
	if(!authList || authList.length == 0) {
		throw new Error("Authentication list cannot be empty!");			
	}

	for(var i = 0; i < authList.length; ++i) {
		var authLine = authList[i];

		if(authType == 'digest') {
			var authTokens = authLine.split(":");
			// Constructing A1 for digest access authentication.
			authUsers[authTokens[0]] = authTokens[0] + ":" + authRealm + ":" + authTokens[1];
		} else if(authType == 'basic') {
			// Pushing token to users array.
			authUsers.push(utils.base64(authLine));
		} else {
			throw new Error("Invalid type, may be digest | basic!");
		}
	}

	// Setting authUsers.
	options['authUsers'] = authUsers;

	return options;
}