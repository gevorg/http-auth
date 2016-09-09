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
    describe('nofile', () => {
        let server = undefined;

        before(function () {
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

        it('error', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("Error comes here");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('gevorg', 'gpass');
        });

        it('success', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("Welcome to private area - mia!");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('mia', 'supergirl');
        });

        it('wrong password', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('mia', 'cute');
        });

        it('wrong user', (done) => {
            const callback = (error, response, body) => {
                expect(body).to.equal("401 Unauthorized");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('Tina', 'supergirl');
        });

        it('password with colon', function (done) {
            const callback = (error, response, body) => {
                expect(body).to.equal("Welcome to private area - ColonUser!");
                done();
            };

            // Test request.
            request.get('http://127.0.0.1:1337', callback).auth('ColonUser', 'apasswordwith:acolon');
        });
    });
});