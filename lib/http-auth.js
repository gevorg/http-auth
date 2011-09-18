/**
 * HTTP library.
 */
var http = require('http');

/**
 * Crypto library.
 */
var crypto = require('crypto');

/**
 * HTTP Auth.
 */
module.exports = {
	/**
	 * Server nonce expiration timeout (milliseconds).
	 */
	'nonce_expire_timeout' : 3600000,
	/**
	 * HTTP authentication realm.
	 */
	'authentication_realm' : "Cease Cows, Life is Short!",
	/**
	 * State info.
	 */
	'nonces' : {},
	/**
	 * HTTP server.
	 */
	'server' : null,
	/**
	 * Nonce expiration function, to be called with setTimeout.
	 * 
	 * @param {Object} nonce.
	 * @api private.
	 */
	'expire_nonce' : function(nonce) {
		delete nonces[nonce];
	},
	/**
	 * MD5 hash function. 
	 *
	 * @param {String} string to hash.
	 * @api private.
	 */
	'md5' : function(str) {
		var hash = crypto.createHash("MD5");
		hash.update(str);
		
		return hash.digest("hex");
	},
	/**
	 * Parse the Authorization header, return a dictionary or false if an invalid header is given.
	 *
	 * @param {String} header.
	 * @api private.
	 */
	'parse_header_string' : function(header) {
		var authtype = header.match(/^(\w+)\s+/);
		if (authtype === null) {
			return false;
		}
		if (authtype[1].toLowerCase() != "digest") {
			// We currently don't support any other auth methods.
			return false;
		}
		header = header.slice(authtype[1].length);
	
		var dict = {};
		var first = true;
		while (header.length > 0) {
			// eat whitespace and comma
			if (first) {
				first = false;
			} else {
				if (header[0] != ",") {
					return false;
				}
				header = header.slice(1);
			}
			header = header.trimLeft();
	
			// parse key
			var key = header.match(/^\w+/);
			if (key === null) {
				return false;
			}
			key = key[0];
			header = header.slice(key.length);
	
			// parse equals
			var eq = header.match(/^\s*=\s*/);
			if (eq === null) {
				return false;
			}
			header = header.slice(eq[0].length);
	
			// parse value
			var value;
			if (header[0] == "\"") {
				// quoted string
				value = header.match(/^"([^"\\\r\n]*(?:\\.[^"\\\r\n]*)*)"/);
				if (value === null) {
					return false;
				}
				header = header.slice(value[0].length);
				value = value[1];
			} else {
				// unquoted string
				value = header.match(/^[^\s,]+/);
				if (value === null) {
					return false;
				}
				header = header.slice(value[0].length);
				value = value[0];
			}
			dict[key] = value;
	
			// eat whitespace
			header = header.trimLeft();
		}
		return dict;

	},
	/**
	 * Authentication method.
	 *
	 * @param {HttpRequest} request.
	 * @param {String} header.
	 * @param {String} username.
	 * @param {password} password.
	 * @api private.
	 */
	'authenticate' : function(request, header, username, password) {
		var authinfo = this.parse_header_string(header);
		if (authinfo === false) {
			// TODO: handle bad requests
			return false;
		}
	
		// check for expiration
		if (!(authinfo.nonce in this.nonces)) {
			return false;
		}
		
		// calculate a1
		var a1;
		if (authinfo.algorithm == "MD5-sess") {
			// TODO: implement MD5-sess
			return false;
		} else {
			if (authinfo.username != username) {
				// TODO: We currently only support a single username/password tuple
				return false;
			}
			a1 = authinfo.username + ":" + this.authentication_realm + ":" + password;
		}
	
		// calculate a2
		var a2;
		if (authinfo.qop == "auth-int") {
			// TODO: implement auth-int
			return false;
		} else {
			a2 = request.method + ":" + authinfo.uri;
		}
	
		// calculate request digest
		var digest;
		if (!("qop" in authinfo)) {
			// For RFC 2069 compatibility
			digest = this.md5(this.md5(a1) + ":" + authinfo.nonce + ":" + this.md5(a2));
		} else {
			if (authinfo.nc <= this.nonces[authinfo.nonce].count) {
				return false;
			}
			this.nonces[authinfo.nonce].count = authinfo.nc;
			digest = this.md5(this.md5(a1) + ":" + authinfo.nonce + ":" + authinfo.nc + ":" + 
							authinfo.cnonce + ":" + authinfo.qop + ":" + this.md5(a2));
		}
	
		if (digest == authinfo.response) {
			return true;
		} else {
			return false;
		}

	},
	/**
	 * The http_digest_auth function authenticates the current http request and 
	 * executes the callback if the user is authenticated successfully. Otherwise 
	 * a 401 Unauthorized page is presented. 
	 * The callback is of type function(request, response).
	 *
	 * @param {HttpRequest} request.
	 * @param {HttpResponse} response.
	 * @param {String} usrename.
	 * @param {String} password.
	 * @param {Function} callback.
	 * @param {Snake} this object.
	 * @api private.
	 */
	'http_digest_auth' : function(request, response, username, password, callback, callbackObj) {
		var authenticated = false;
		if ("authorization" in request.headers) {
			var header = request.headers.authorization;
			authenticated = callbackObj.authenticate(request, header, username, password);
		}
		if (authenticated) {
			callback(request, response);
		} else {
			// generate nonce
			var nonce = callbackObj.md5(new Date().getTime() + "privstring");
	
			callbackObj.nonces[nonce] = {
				count: 0,
			};
			setTimeout(callbackObj.expire_nonce, callbackObj.nonce_expire_timeout, nonce);
	
			// generate opaque (TODO: move outside)
			var opaque = callbackObj.md5("hostname or something");
	
			// create header
			var header = "Digest realm=\"" + callbackObj.authentication_realm + "\", qop=\"auth\", nonce=\"" + nonce + "\", opaque=\"" + opaque + "\"";
			response.writeHead(401, {"WWW-Authenticate": header});
			response.end("<!DOCTYPE html>\n<html><head><title>401 Unauthorized</title></head><body><h1>401 Unauthorized</h1><p>This page requires authorization.</p></body></html>");
		}
	},
	/**
	 * The createServer method creates a web server using HTTP Digest 
	 * authentication. Usage of this function is similar to the http.createServer
	 * function of the node.js standard library, but with additional parameters for
	 * the username and password.
	 * The callback is of type function(request, response).
	 * 
	 * @param {String} username.
	 * @param {String} password.
	 * @param {Function} callback.
	 * @api public.
	 */
	'createServer' : function(username, password, callback) {
		var callbackObj = this;
		
		this.server = http.createServer(function(request, response) {
			callbackObj.http_digest_auth(request, response, username, password, callback, callbackObj);
		});
		return this.server;
	}
}