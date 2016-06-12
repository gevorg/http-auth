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
import '../src/http-auth'

// Proxy.
describe('proxy', function () {
    let server = undefined;
    let proxy = undefined;

    before(function () {
        // Setup proxy.
        proxy = httpProxy.createServer({
            target: 'http://localhost:1338'
        }).listen(1337);

        // Creating new HTTP server.
        server = http.createServer(function (req, res) {
            res.end("Request successfully proxied!");
        });

        // Start server.
        server.listen(1338);
    });

    after(function () {
        proxy.close();
        server.close();
    });

    it('native', function () {
        let callback = function (error, response, body) {
            expect(body).to.equal("Request successfully proxied!");
        };

        // Test request.
        request.get({proxy: 'http://mia:supergirl@127.0.0.1:1337', uri: 'http://127.0.0.1:1337'}, callback);
    });
});