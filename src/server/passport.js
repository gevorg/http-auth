"use strict";

// Imports.
import passport from 'passport'
import util from 'util'

// Define strategy.
let HttpStrategy = function (auth) {
    this.name = 'http';
    this.authentication = auth;

    passport.Strategy.call(this);
};

// Inherit basic strategy.
util.inherits(HttpStrategy, passport.Strategy);

// Define auth method.
HttpStrategy.prototype.authenticate = function (req) {
    let self = this;

    // Is auth.
    this.authentication.isAuthenticated(req, (result) => {
        if (result instanceof Error) {
            self.error(result);
        } else if (!result.pass) {
            let header = self.authentication.generateHeader(result);
            self.fail(header);
        } else {
            self.success(result.user);
        }
    });
};

// Export.
export function strategy(auth) {
    return new HttpStrategy(auth);
}