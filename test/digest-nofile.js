"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// HTTP.
import http from 'http'

// Source.
import * as auth from '../src/http-auth'

// Utils.
import * as utils from '../src/auth/utils'

// Digest auth.
describe('digest', function () {
    describe('nofile', function () {
        let server = undefined;

        before(function() {
            // Configure authentication.
            const digest = auth.digest({
                realm: "Simon Area."
            }, function(username, callback) {
                if (username === "simon") {
                    callback(utils.md5("simon:Simon Area.:smart"));
                } else if (username === "gevorg") {
                    callback(new Error("Error comes here"));
                } else {
                    callback();
                }
            });

            // Add error listener.
            digest.on('error', function() {
                console.log("Error thrown!");
            });

            // Creating new HTTP server.
            server = http.createServer(digest, function (req, res) {
                res.end(`Welcome to private area - ${req.user}!`);
            });

            // Start server.
            server.listen(1337);
        });

        after(function() {
            server.close();
        });

        it('error', function (done) {
            const callback = function (error, response, body) {
                expect(body).to.equal("Error comes here");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass', false);
        });

        it('success', function (done) {
            const callback = function(error, response, body) {
                expect(body).to.equal("Welcome to private area - simon!");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('simon', 'smart', false);
        });

        it('comma URI', function (done) {
            const callback = function(error, response, body) {
                expect(body).to.equal("Welcome to private area - simon!");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337/comma,/', callback).auth('simon', 'smart', false);
        });

        it('wrong password', function (done) {
            const callback = function(error, response, body) {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('simon', 'woolf', false);
        });

        it('wrong user', function (done) {
            const callback = function(error, response, body) {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('virgina', 'smart', false);
        });
    });
});
