"use strict";

// Export middleware.
export function middleware(auth) {
    // Middleware for koa.
    const koa = function (req, res, next) {
        auth.check(req, res, function (req, res, err) {
            if (err) {
                throw err;
            } else {
                next();
            }
        });
    };

    // Return middleware.
    return function *(next) {
        yield koa.bind(null, this.req, this.res);
        yield next;
    };
}