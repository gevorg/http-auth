/**
 * Default setup module.
 */
var defaults = require('../defaults');

/**
 * htpasswd module.
 */
var htpasswd = require('htpasswd');

/**
 * Utility module.
 */
var utils = require('../utils');

/**
 * Exporting module.
 */
module.exports = Basic;

/**
 * Basic Access Authentication.
 *
 * @param {String} authRealm authentication realm.
 * @param {Array} authUsers array of users.
 * @param {Function} authHelper authentication helper for custom authentication mechanism.
 * @param {Boolean} proxy identifies if authentication is used for proxy.
 */
function Basic(authRealm, authUsers, authHelper, proxy) {
	// Realm.
	this.realm = authRealm;
	// Users.
	this.users = authUsers;
	// Authentication helper.
   this.authHelper = authHelper;
   // Proxy or not.
   this.proxy = proxy;

	// Used for async callback.
	var self = this;
	
	/**
	 * Applies basic authentication and calls next after user is authenticated.
	 *
	 * @param {Request} request HTTP request object.
	 * @param {Response} response HTTP response object.
	 * @param {Function} next function that will be called after user is authenticated.
	 */
	this.apply = function(request, response, next) {
		self.isAuthenticated(request, function(authenticated) {
         if(!authenticated) {
            self.ask(response);
         } else {
            next(authenticated);
         }
      });
	}
};

/**
 * Checks authorization header in request.
 *
 * @param {Request} request HTTP request object.
 * @param {Function} callback after authentication is finished.
 */
Basic.prototype.isAuthenticated = function(request, callback) {
	var authenticated = undefined;

	// If header exists.
   var authHeader = null;
   

   if (!this.proxy) {
      authHeader = request.headers["authorization"];
   } else {
      authHeader = request.headers["proxy-authorization"];
   }

	if (authHeader) {
		var header = authHeader;
		var clientUserString = header.split(" ")[1];
      var clientUser = utils.decodeBase64(clientUserString).split(":");
      var clientUserName = clientUser[0];
      var clientPasswordHash = clientUser[1];
		var authUsers = this.users;
      var validateClientString = this.validateClientString;

      // Searching for user in user list.
		if (clientUserString) {
	      if (this.authHelper) {         
            this.authHelper(clientUserName, function(passwordHash) {
               if ( passwordHash && htpasswd.validate(passwordHash, clientPasswordHash) ) {
                  callback(clientUserName);
               } else {
                  callback();
               }
            });
         } else {
            callback(validateClientString(clientUserName, clientPasswordHash, authUsers));
         }
      } else {
         callback();
      }
	} else {
      callback();
   }

	return authenticated;
};

/**
 * Validates client username and client password hash.
 *
 * @param {String} username of client.
 * @param {String} password hash of client.
 * @return {String} the authenticated user ID, if authentication is successful, else undefined.
 */
Basic.prototype.validateClientString = function(clientUserName, clientPasswordHash, users) {
   var authenticated = undefined;

	if (clientUserName && clientPasswordHash) {
      for (var i = 0; i < users.length; ++i) {
         var myUser = users[i].split(":");
         var myUserName = myUser[0];
			var myPasswordHash = myUser[1];
         
         // Ensure the username and password both match.
	      if (myUserName === clientUserName) {
            if (htpasswd.validate(myPasswordHash, clientPasswordHash)) {
               authenticated = myUserName;
               break;
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
Basic.prototype.ask = function(response) {
	var header = "Basic realm=\"" + this.realm + "\"";
   
   if (this.proxy) {
	   response.setHeader("Proxy-Authenticate", header);
	   response.writeHead(407);
	   response.end(defaults.HTML_407);
   } else {
      response.setHeader("WWW-Authenticate", header);
      response.writeHead(401);
      response.end(defaults.HTML_401);
   }
};
