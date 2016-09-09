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
describe('basic', () => {
    let server = undefined;

    before(() => {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area.",
            file: __dirname + "/../data/users.htpasswd",
            skipUser: true
        });

        // Creating new HTTP server.
        server = http.createServer(basic, (req, res) => {
            res.end(`Welcome to private area - ${req.user}!`);
        });

        // Start server.
        server.listen(1337);
    });

    after(() => {
        server.close();
    });

    it('skip user', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - undefined!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });
});