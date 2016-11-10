"use strict";

// Expect module.
const expect = require('chai').expect;

// Request module.
const request = require('request');

// HTTP.
const http = require('http');

// Source.
const auth = require('../src/http-auth');

// Basic auth.
describe('basic', () => {
    let server = undefined;

    before(() => {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area.",
            file: __dirname + "/../data/users.htpasswd"
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

    it('SHA1', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - gevorg!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
    });

    it('Crypt', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - vera!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('vera', 'kruta');
    });

    it('MD5', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - hera!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('hera', 'gnu');
    });

    it('Bcrypt', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - titan!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('titan', 'demo');
    });

    it('plain', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - Sarah!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('Sarah', 'testpass');
    });

    it('Wrong password', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'duck');
    });

    it('Wrong user', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('solomon', 'gpass');
    });

    it('Empty user and password', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('', '');
    });

    it('Commented user', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('#comment', 'commentpass');
    });
});
