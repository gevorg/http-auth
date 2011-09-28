/**
 * Default setup module.
 */
var defaults = require('../default');

/**
 * Utility module.
 */
var util = require('../util');

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
 */
function Digest(authRealm, authUsers) {
	// Realm.
	this.realm = authRealm;
	// Users.
	this.users = authUsers;
	// Nonces.
	this.nonces = new Array();

	// Used for async callback.
	var self = this;

	/**
	 * Applies digest authentication and calls next after user is authenticated.
	 *
	 * @param {Request} request HTTP request object.
	 * @param {Response} response HTTP response object.
	 * @param {Function} next function(request, response) that will be called after user is authenticated.
	 */
	this.apply = function(request, response, next) {
		var requestBody = "";

		// Reading request body.
		request.on('data', function(chunk) {
			// append the current chunk of data to the requestBody variable.
			if(request.method == "POST") {
				requestBody += chunk.toString();
			}
		});
		// Processing authentication part.
		request.on('end', function() {
			var authenticated = self.isAuthenticated(request, response, requestBody);
			if(!authenticated) {
				self.ask(request, response, requestBody);
			} else {
				next(request, response);
			}
		});
	}
}

/**
 * Checks authorization header in request.
 *
 * @param {Request} request HTTP request object.
 * @param {Response} response HTTP response object.
 * @param {String} requestBody HTTP request body string.
 */
Digest.prototype.isAuthenticated = function(request, response, requestBody) {
	var authenticated = false;

	console.log(request.headers.authorization);

	// If header exists.
	if("authorization" in request.headers) {
		var header = request.headers.authorization;
		var co = this.parseAuthHeader(header);

		// Check for expiration.
		if(co.nonce in this.nonces) {
			// Sencond hash in digest access authentication.
			var ha2;
			// Calculating second hash.
			if(co.qop == "auth-int") {
				console.log(request.method + ":" + co.uri + ":" + util.md5(requestBody));
				ha2 = util.md5(request.method + ":" + co.uri + ":" + util.md5(requestBody));
			} else {
				ha2 = util.md5(request.method + ":" + co.uri);
			}

			// Checking response for username.
			var ha1 = util.md5(this.users[co.username]);
			// If qop is specified.
			if(co.qop) {
				if(co.nc > this.nonces[co.nonce]) {
					// Updating nonce count.
					this.nonces[co.nonce] = co.nc;

					// Evaluating final authentication response.
					console.log(ha1 + ":" + co.nonce + ":" + co.nc + ":" + co.cnonce + ":" + co.qop + ":" + ha2);
					
					var authRes = util.md5(ha1 + ":" + co.nonce + ":" + co.nc + ":" + co.cnonce + ":" + co.qop + ":" + ha2);
					console.log("OUR: " + authRes);
					console.log("NOUR: " + co.response);
					
					authenticated = (authRes == co.response);
				}
			} else {
				// Evaluating final authentication response.
				var authRes = util.md5(ha1 + ":" + co.nonce + ":" + ha2);
				authenticated = (authRes == co.response);
			}
		}
	}

	console.log(authenticated);

	return authenticated;
}
/**
 * Asks client for authentication.
 *
 * @param {Request} request HTTP request object.
 * @param {Response} response HTTP response object.
 * @param {String} requestBody HTTP request body string.
 */
Digest.prototype.ask = function(request, response, requestBody) {
	// Generating unique nonce.
	var nonce = util.md5(uuid());
	// Adding nonce.
	this.nonces[nonce] = 0;
	// Scheduling async timeout function call.
	setTimeout(this.expireNonce, defaults.NONCE_EXPIRE_TIMEOUT, nonce, this.nonces);

	// Generating authentication header.
	var header = "Digest realm=\"" + this.realm + "\", qop=\"auth, auth-int\", nonce=\"" + nonce + "\", algorithm=\"MD5\"";

	response.setHeader("WWW-Authenticate", header);
	response.writeHead(401);
	response.end(defaults.HTML_401);
}
/**
 * Method for clearing not used nonces.
 *
 * @param {String} nonce nonce to delete.
 * @param {Array} nonces array of nonces.
 */
Digest.prototype.expireNonce = function(nonce, nonces) {
	delete nonces[nonce];
}
/**
 * Method for parsing authorization header.
 *
 * @param {String} header authorization header.
 */
Digest.prototype.parseAuthHeader = function(header) {
	var headerOptions = new Array();

	// Replacing internal quotes.
	var searchHeader = header.replace(/\\"/g, "&quot;");
	// Padding with quotes not padding values.
	searchHeader = searchHeader.replace(/(\w+)=([^," ]+)/g, '$1=\"$2\"');
	// Initial tokens.
	var tokens = searchHeader.match(/(\w+)=?"([^"]+)?"/g);

	// Adding tokens to final Object.
	for(var i = 0; i < tokens.length; ++i) {
		var token = tokens[i].split(/=/);

		// Generating token value.
		var tokenValue = token[1].replace(/&quot;/g, '\"');
		tokenValue = tokenValue.substr(1, tokenValue.length - 2);

		headerOptions[token[0]] = tokenValue;
	}

	return headerOptions;
}