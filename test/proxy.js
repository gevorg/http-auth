"use strict";

// Expect module.
import {expect} from 'chai'

// Request module.
import request from 'request'

// HTTP.
import http from 'http'

// Proxy library.
import httpProxy from 'http-proxy'

// Source.
import * as auth from '../src/http-auth'

// Proxy.
describe('proxy', function () {
    let server = undefined;
    let proxy = undefined;

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

        // Setup proxy.
        proxy = httpProxy.createServer(basic, {
            target: 'http://localhost:1338'
        }).listen(1337);

        // Creating new HTTP server.
        server = http.createServer(function (req, res) {
            res.end(`Welcome to private area - ${req.user}!`);
        });

        // Start server.
        server.listen(1338);
    });

    after(function () {
        proxy.close();
        server.close();
    });

    it('error', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("Error comes here");
        };

        // Test request.
        request.get({proxy: 'http://gevorg:gpass@127.0.0.1:1337', uri: 'http://127.0.0.1:1337'}, callback);
    });

    it('success', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("Welcome to private area - mia!");
        };

        // Test request.
        request.get({proxy: 'http://mia:supergirl@127.0.0.1:1337', uri: 'http://127.0.0.1:1337'}, callback);
    });

    it('wrong password', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("407 Proxy authentication required");
        };

        // Test request.
        request.get({proxy: 'http://mia:cute@127.0.0.1:1337', uri: 'http://127.0.0.1:1337'}, callback);
    });

    it('wrong user', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("407 Proxy authentication required");
        };

        // Test request.
        request.get({proxy: 'http://Tina:supergirl@127.0.0.1:1337', uri: 'http://127.0.0.1:1337'}, callback);
    });
});