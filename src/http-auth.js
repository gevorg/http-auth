"use strict";
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