"use strict";

// Exporting connect integration.
export function middleware(auth) {
    return function (req, res, next) {
        auth.check(req, res, function(req, res, err) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    }
}