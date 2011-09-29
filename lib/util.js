/**
 * Crypto module.
 */
var crypto = require('crypto');

/**
 * Utility module.
 */
module.exports = {
	/**
	 * Function for encoding string to base64.
	 *
	 * @param {String} str string to encode.
	 */
	'base64' : function(str) {
		return new Buffer(str, 'UTF-8').toString('base64');
	},
	/**
	 * MD5 hash method.
	 *
	 * @param {String} str string to hash.
	 */
	'md5' : function(str) {
		var hash = crypto.createHash("MD5");
		hash.update(str);

		return hash.digest("hex");
	}
}