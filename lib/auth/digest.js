/**
 * Default setup module.
 */
var defaults = require('../defaults');

/**
 * Utility module.
 */
var utils = require('../utils');

/**
 * Module for generating unique id.
 */
var uuid = require('node-uuid');

/**
 * Exporting module.
 */
module.exports = Digest;

/**
 * Digest Access Authentication.
 *
 * @param {String} authRealm authentication realm.
 * @param {Array} authUsers array of users.
 * @param {String} algorithm algorithm for authentication.
 */
function Digest(authRealm, authUsers, algorithm) {
	// Realm.
	this.realm = authRealm;
	// Users.
	this.users = authUsers;
	// Nonces.
	this.nonces = new Array();
	// Algorithm.
	this.algorithm = algorithm;

	// Used for async callback.
	var self = this;

	/**
	 * Applies digest authentication and calls next after user is authenticated.
	 *
	 * @param {Request} request HTTP request object.
	 * @param {Response} response HTTP response object.
	 * @param {Function} next function that will be called after user is authenticated.
	 */
	this.apply = function(request, response, next) {		
		// Processing authentication part.
		var authenticated = self.isAuthenticated(request);
		if(!authenticated) {
			self.ask(response);
		} else {
			next();
		}
	};
};

/**
 * Checks authorization header in request.
 *
 * @param {Request} request HTTP request object.
 * @return {Boolean} true if is authenticated, else false.
 */
Digest.prototype.isAuthenticated = function(request) {
	var authenticated = false;

	// If header exists.
	if("authorization" in request.headers) {
		var header = request.headers.authorization;
		var co = this.parseAuthHeader(header);

		// Check for expiration.
		if(co.nonce in this.nonces) {
			// Second hash in digest access authentication.
			var ha2;
			// Calculating second hash.
			ha2 = utils.md5(request.method + ":" + co.uri);

			// Checking response for username.
			var userHash = this.users[co.username];

			// Username is correct.
			if(userHash && typeof userHash === 'string') {
				var ha1 = utils.md5(this.users[co.username]);

				// If algorithm is MD5-sess.
				if(co.algorithm == 'MD5-sess') {
					ha1 = utils.md5(ha1 + ":" + co.nonce + ":" + co.cnonce);
				}

				// If qop is specified.
				if(co.qop) {
					if(co.nc > this.nonces[co.nonce]) {
						// Updating nonce count.
						this.nonces[co.nonce] = co.nc;

						// Evaluating final authentication response.
						var authRes = utils.md5(ha1 + ":" + co.nonce + ":" + co.nc + ":" + 
							co.cnonce + ":" + co.qop + ":" + ha2);
						authenticated = (authRes == co.response);
					}
				} else {
					// Evaluating final authentication response.
					var authRes = utils.md5(ha1 + ":" + co.nonce + ":" + ha2);
					authenticated = (authRes == co.response);
				}
			}
		}
	}

	return authenticated;
};
/**
 * Asks client for authentication.
 *
 * @param {Response} response HTTP response object.
 */
Digest.prototype.ask = function(response) {
	// Generating unique nonce.
	var nonce = utils.md5(uuid());
	// Adding nonce.
	this.nonces[nonce] = 0;
	// Scheduling async timeout function call.
	setTimeout(this.expireNonce, defaults.NONCE_EXPIRE_TIMEOUT, nonce, this.nonces);

	// Generating authentication header.
	var header = "Digest realm=\"" + this.realm + "\", qop=\"auth\", nonce=\"" + nonce + 
		"\", algorithm=\"" + this.algorithm + "\"";

	response.setHeader("WWW-Authenticate", header);
	response.writeHead(401);
	response.end(defaults.HTML_401);
};
/**
 * Method for clearing not used nonces.
 *
 * @param {String} nonce nonce to delete.
 * @param {Array} nonces array of nonces.
 */
Digest.prototype.expireNonce = function(nonce, nonces) {
	delete nonces[nonce];
};
/**
 * Method for parsing authorization header.
 *
 * @param {String} header authorization header.
 * @return {Array} parsed array with authorization header data.
 */
Digest.prototype.parseAuthHeader = function(header) {
	var headerOptions = new Array();

	// Replacing internal quotes.
	var searchHeader = header.replace(/\\"/g, "&quot;");
	// Padding with quotes not padding values.
	searchHeader = searchHeader.replace(/(\w+)=([^," ]+)/g, '$1=\"$2\"');
	// Initial tokens.
	var tokens = searchHeader.match(/(\w+)="([^"]+)"/g);

	// If tokens were found.
	if(tokens) {
		// Adding tokens to final Object.
		for(var i = 0; i < tokens.length; ++i) {
			var token = tokens[i];
			// Searching for first equal sign.
			var equalIndex = token.indexOf("=");
			// Extracting key.
			var key = token.substr(0, equalIndex);
			// Extracting value.
			var value = token.substr(equalIndex + 2, token.length - equalIndex - 3);
			// Adding to options.
			headerOptions[key] = value;
		}
	}

	return headerOptions;
};