"use strict";

// Utils.
import * as utils from './auth/utils'

// http integration.
import './server/http'

// https integration.
import './server/https'

// http-proxy integration.
if (utils.isAvailable('http-proxy')) {
    require('./server/proxy');
}

// Exports.
module.exports = {
    // Basic authentication.
    basic: function(options, checker) {
        return require('./auth/basic').default(options, checker);
    },

    // Digest authentication.
    digest: function (options, checker) {
        return require('./auth/digest').default(options, checker);
    },

    // Connect.
    connect: function (auth) {
        return require('./server/connect').middleware(auth);
    },

    // Koa.
    koa: function (auth) {
        return require('./server/koa').middleware(auth);
    },

    // Passport.
    passport: function (auth) {
        return require('./server/passport').strategy(auth);
    }
};