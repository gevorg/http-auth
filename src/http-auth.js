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
    basic: (options, checker) => {
        return require('./auth/basic').default(options, checker);
    },

    // Digest authentication.
    digest: (options, checker) => {
        return require('./auth/digest').default(options, checker);
    },

    // Connect.
    connect: (auth) => {
        return require('./server/connect').middleware(auth);
    },

    // Koa.
    koa: (auth) => {
        return require('./server/koa').middleware(auth);
    },

    // Passport.
    passport: (auth) => {
        return require('./server/passport').strategy(auth);
    }
};