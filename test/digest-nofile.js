"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// HTTP.
import http from 'http'

// Source.
import * as auth from '../gensrc/http-auth'

// Utils.
import utils from '../gensrc/auth/utils'

// Digest auth.
describe('digest', function () {
    describe('nofile', function () {
        let server = undefined;

        before(function() {
            // Configure authentication.
            let digest = auth.digest({
                realm: "Simon Area."
            }, function(username, callback) {
                if (username === "simon") {
                    return utils.md5("simon:Simon Area.:smart");
                } else if (username === "gevorg") {
                    done(new Error("Error comes here"));
                } else {
                    done();
                }
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

        it('error', function () {
            let callback = function (error, response, body) {
                expect(body).to.equal("Error comes here");
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
        });

        it('success', function () {
            let callback = function(error, response, body) {
                expect(body).to.equal("Welcome to private area - simon!");
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('simon', 'smart');
        });

        it('comma URI', function () {
            let callback = function(error, response, body) {
                expect(body).to.equal("Welcome to private area - simon!");
            };

            // Test request.
            request.get('http://127.0.0.1:1337/comma,/', callback).auth('simon', 'smart');
        });

        it('wrong password', function () {
            let callback = function(error, response, body) {
                expect(body).to.equal("401 Unauthorized");
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('simon', 'woolf');
        });

        it('wrong user', function () {
            let callback = function(error, response, body) {
                expect(body).to.equal("401 Unauthorized");
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('virgina', 'smart');
        });
    });
});
