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

    before(function () {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area.",
            file: __dirname + "/../data/users.htpasswd",
            skipUser: true
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

    it('skip user', function (done) {
        const callback = function (error, response, body) {
            expect(body).to.equal("Welcome to private area - undefined!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });
});