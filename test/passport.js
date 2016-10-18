"use strict";

// Expect module.
const expect = require('chai').expect;

// Request module.
const request = require('request');

// Source.
const auth = require('../src/http-auth');

// Express.
const express =  require('express');

// Passport.
const passport = require('passport');

// Passport.
describe('passport', () => {
    let server = undefined;

    before(() => {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area."
        }, (username, password, done) => {
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
        const app = express();

        // Setup passport.
        passport.use(auth.passport(basic));

        // Setup route.
        app.get( '/', passport.authenticate('http', { session: false }), (req, res) => {
            res.send(`Welcome to private area - ${req.user}!`);
        });

        // Error handler.
        app.use((err, req, res, next) => {
            res.status(400).end(err.message);
        });

        // Start server.
        server = app.listen(1337);
    });

    after(() => {
        server.close();
    });

    it('error', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Error comes here");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });

    it('success', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - mia!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('mia', 'supergirl');
    });

    it('wrong password', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('mia', 'cute');
    });

    it('wrong user', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('Tina', 'supergirl');
    });

    it('password with colon', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - ColonUser!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('ColonUser', 'apasswordwith:acolon');
    });
});