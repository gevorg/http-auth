"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// Source.
import auth from '../gensrc/http-auth'

// HTTP.
import http from 'http'

// Basic auth.
describe('basic', function () {
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
        server = http.createServer(basic, function (req, res) {
            res.end(`Welcome to private area - ${req.user}!`);
        });

        // Start server.
        server.listen(1337);
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