"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// HTTP.
import http from 'http'

// Source.
import * as auth from '../src/http-auth'

// Digest auth.
describe('digest', function () {
    describe('md5-sess', function () {
        let server = undefined;

        before(function () {
            // Configure authentication.
            const digest = auth.digest({
                algorithm: 'MD5-sess',
                realm: "Simon Area.",
                file: __dirname + "/../data/users.htdigest"
            });

            // Creating new HTTP server.
            server = http.createServer(digest, function (req, res) {
                res.end(`Welcome to private area - ${req.user}!`);
            });

            // Start server.
            server.listen(1337);
        });

        after(function () {
            server.close();
        });

        it('success', function (done) {
            const callback = function (error, response, body) {
                expect(body).to.equal("Welcome to private area - vivi!");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('vivi', 'anna', false);
        });

        it('wrong password', function (done) {
            const callback = function(error, response, body) {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('vivi', 'goose', false);
        });

        it('wrong user', function (done) {
            const callback = function(error, response, body) {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('brad', 'anna', false);
        });
    });
});