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
    let server = undefined;

    before(function() {
        // Configure authentication.
        let digest = auth.digest({
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

    after(function() {
        server.close();
    });

    it('success', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - vivi!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('vivi', 'anna');
    });

    it('special uri', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("Welcome to private area - vivi!");
        };

        // Test request.
        request.get('http://127.0.0.1:1337/?coffee=rocks', callback).auth('vivi', 'anna');
    });

    it('wrong password', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('vivi', 'goose');
    });

    it('wrong user', function () {
        let callback = function(error, response, body) {
            expect(body).to.equal("401 Unauthorized");
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('brad', 'anna');
    });
});
