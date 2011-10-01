/**
 * Digest and basic modules.
 */
var Digest = require('./auth/digest'), Basic = require('./auth/basic');

/**
 * Provider creates new basic or digest authentication instance.
 */
module.exports = {
	/**
	 * Creates new basic access authentication instance.
	 *
	 * @param {Array} options authentication options.
	 * @return {Basic} basic authentication instance.
	 */
	'basic' : function(options) {
		return new Basic(options.authRealm, options.authUsers);
	},
	/**
	 * Creates new digest access authentication instance.
	 *
	 * @param {Array} options authentication options.
	 * @return {Digest} digest authentication instance.
	 */
	'digest' : function(options) {
		return new Digest(options.authRealm, options.authUsers, options.algorithm);
	}
};
