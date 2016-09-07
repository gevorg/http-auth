"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// HTTP.
import http from 'http'

// Source.
import * as auth from '../src/http-auth'

// Basic auth.
describe('basic', function () {
    let server = undefined;

    before(function() {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area.",
            file: __dirname + "/../data/users.htpasswd"
        });

        // Creating new HTTP server.
        server = http.createServer(basic, function (req, res) {
            res.end(`Welcome to private area - ${req.user}!`);
        });

        // Start server.
        server.listen(1337);
    });

    after(function() {
        server.close();
    });

    it('SHA1', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - gevorg!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });

    it('Crypt', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - vera!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('vera', 'kruta');
    });

    it('MD5', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - hera!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('hera', 'gnu');
    });

    it('plain', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - Sarah!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('Sarah', 'testpass');
    });

    it('Wrong password', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'duck');
    });

    it('Wrong user', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('solomon', 'gpass');
    });

    it('Empty user and password', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('', '');
    });

    it('Commented user', function (done) {
        const callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('#comment', 'commentpass');
    });
});
