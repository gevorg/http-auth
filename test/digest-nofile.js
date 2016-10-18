"use strict";

// Expect module.
const expect = require('chai').expect;

// Request module.
const request = require('request');

// HTTP.
const http = require('http');

// Source.
const auth = require('../src/http-auth');

// Utils.
const utils = require('../src/auth/utils');

// Digest auth.
describe('digest', () => {
    describe('nofile', () => {
        let server = undefined;

        before(() => {
            // Configure authentication.
            const digest = auth.digest({
                realm: "Simon Area."
            }, (username, callback) => {
                if (username === "simon") {
                    callback(utils.md5("simon:Simon Area.:smart"));
                } else if (username === "gevorg") {
                    callback(new Error("Error comes here"));
                } else {
                    callback();
                }
            });

            // Add error listener.
            digest.on('error', () => {
                console.log("Error thrown!");
            });

            // Creating new HTTP server.
            server = http.createServer(digest, (req, res) => {
                res.end(`Welcome to private area - ${req.user}!`);
            });

            // Start server.
            server.listen(1337);
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
            request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass', false);
        });

        it('success', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("Welcome to private area - simon!");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('simon', 'smart', false);
        });

        it('comma URI', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("Welcome to private area - simon!");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337/comma,/', callback).auth('simon', 'smart', false);
        });

        it('wrong password', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('simon', 'woolf', false);
        });

        it('wrong user', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('virgina', 'smart', false);
        });
    });
});
