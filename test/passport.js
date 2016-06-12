"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// Express.
import express from 'express'

// Passport.
import passport from 'passport'

// Source.
import * as auth from '../gensrc/http-auth'

// Passport.
describe('passport', function () {
    let server = undefined;

    before(function () {
        // Configure authentication.
        let basic = auth.basic({
            realm: "Private Area."
        }, function (username, password, done) {
            if (username === 'gevorg') {
                done(new Error("Error comes here"));
            } else if (username === "mia" && password === "supergirl") {
                done(true);
            } else if (username === "ColonUser" && password === "apasswordwith:acolon") {
                done(true);
            } else {
                done(false);
            }
        });

        // Creating new HTTP server.
        let app = express();
        app.use(auth.connect(basic));

        // Setup passport.
        passport.use(auth.passport(basic));

        // Setup route.
        app.get( '/', passport.authenticate('http', { session: false }), function (req, res) {
            res.send(`Welcome to private area - ${req.user}!`);
        });

        // Error handler.
        app.use(function (err, req, res, next) {
            res.status(400).end(err.message);
        });

        // Start server.
        server = app.listen(1337);
    });

    after(function () {
        server.close();
    });

    it('error', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("Error comes here");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });

    it('success', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("Welcome to private area - mia!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('mia', 'supergirl');
    });

    it('wrong password', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("401 Unauthorized");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('mia', 'cute');
    });

    it('wrong user', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("401 Unauthorized");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('Tina', 'supergirl');
    });

    it('password with colon', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("Welcome to private area - ColonUser!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('ColonUser', 'apasswordwith:acolon');
    });
});