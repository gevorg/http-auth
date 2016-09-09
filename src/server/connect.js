"use strict";

// Exporting connect integration.
export function middleware(auth) {
    return (req, res, next) => {
        auth.check(req, res, (req, res, err) => {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    }
}