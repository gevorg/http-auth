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

    before(function() {
        // Configure authentication.
        let basic = auth.basic({
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

    it('SHA1', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - gevorg!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });

    it('Crypt', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - vera!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('vera', 'kruta');
    });

    it('MD5', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - hera!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('hera', 'gnu');
    });

    it('plain', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - Sarah!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('Sarah', 'testpass');
    });

    it('Wrong password', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'duck');
    });

    it('Wrong user', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('solomon', 'gpass');
    });
});
