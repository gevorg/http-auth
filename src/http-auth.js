"use strict";

// Utils.
const utils = require('./auth/utils');

// http integration.
require('./server/http');

// https integration.
require('./server/https');

// Exports.
module.exports = {
    // Basic authentication.
    basic: (options, checker) => {
        return require('./auth/basic')(options, checker);
    },

    // Digest authentication.
    digest: (options, checker) => {
        return require('./auth/digest')(options, checker);
    }

};