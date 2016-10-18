"use strict";

// Expect module.
const expect = require('chai').expect;

// Request module.
const request = require('request');

// HTTPS.
const https = require('https');

// Source.
const auth = require('../src/http-auth');

// FS.
const fs = require('fs');

// HTTPS.
describe('https', () => {
    let server = undefined;

    before(() => {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area."
        }, (username, password, done) => {
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

        // Add error listener.
        basic.on('error', () => {
            console.log("Error thrown!");
        });

        // HTTPS server options.
        const options = {
            key: fs.readFileSync(__dirname + "/../data/server.key"),
            cert: fs.readFileSync(__dirname + "/../data/server.crt")
        };

        // Creating new HTTPS server.
        server = https.createServer(basic, options, (req, res) => {
            res.end(`Welcome to private area - ${req.user}!`);
        });

        // Start server.
        server.listen(1337);
    });

    after(() => {
        server.close();
    });

    it('error', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Error comes here");
            done();
        };

        // Test request.
        request.get({uri: 'https://127.0.0.1:1337', strictSSL: false}, callback).auth('gevorg', 'gpass');
    });

    it('success', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - mia!");
            done();
        };

        // Test request.
        request.get({uri: 'https://127.0.0.1:1337', strictSSL: false}, callback).auth('mia', 'supergirl');
    });

    it('wrong password', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get({uri: 'https://127.0.0.1:1337', strictSSL: false}, callback).auth('mia', 'cute');
    });

    it('wrong user', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("401 Unauthorized");
            done();
        };

        // Test request.
        request.get({uri: 'https://127.0.0.1:1337', strictSSL: false}, callback).auth('Tina', 'supergirl');
    });

    it('password with colon', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - ColonUser!");
            done();
        };

        // Test request.
        request.get({uri: 'https://127.0.0.1:1337', strictSSL: false}, callback).auth(
            'ColonUser', 'apasswordwith:acolon');
    });
});
