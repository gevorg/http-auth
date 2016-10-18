"use strict";

// Expect module.
const expect = require('chai').expect;

// Request module.
const request = require('request');

// Hapi.
const Hapi = require('hapi');

// Source.
const auth = require('../src/http-auth');

// Express.
describe('hapi', () => {
    let server = undefined;

    before(() => {
        // Configure authentication.
        const basic = auth.basic({
            realm: "Private Area."
        }, (username, password, done) => {
            if (username == "gevorg") {
                done(new Error("Error comes here!"));
            } else if (username === "mia" && password === "supergirl") {
                done(true);
            } else if (username === "ColonUser" && password === "apasswordwith:acolon") {
                done(true);
            } else {
                done(false);
            }
        });

        // Create server.
        server = new Hapi.Server();
        server.connection({ port: 1337 });

        // Register auth plugin.
        server.register(auth.hapi());

        // Setup strategy.
        server.auth.strategy('http-auth', 'http', basic);

        // Error handler.
        server.ext('onPreResponse', (request, reply) => {

            if (request.response.isBoom) {
                return reply(request.response.message).code(400);
            }

            reply.continue();
        });


        // Setup route.
        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: 'http-auth',
                handler: (request, reply) => {
                    reply(`Welcome to private area - ${request.auth.credentials.name}!`);
                }
            }
        });

        // Start server.
        server.start(() => {
            console.log(`Server running at: ${server.info.uri}`);
        });
    });

    after(() => {
        server.stop();
    });

    it('error', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Error comes here!");
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

    it('password with colon', (done) => {
        const callback = (error, response, body) => {
            expect(body).to.equal("Welcome to private area - ColonUser!");
            done();
        };

        // Test request.
        request.get('http://127.0.0.1:1337', callback).auth('ColonUser', 'apasswordwith:acolon');
    });
});