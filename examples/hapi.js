'use strict';

// Hapi module.
const Hapi = require('hapi');

// Authentication module.
const auth = require('../src/http-auth');

// Setup auth.
const basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd"
});

// Create server.
const server = new Hapi.Server();
server.connection({ port: 1337 });

// Register auth plugin.
server.register(auth.hapi());

// Setup strategy.
server.auth.strategy('http-auth', 'http', basic);

// Setup route.
server.route({
    method: 'GET',
    path: '/',
    config: {
        auth: 'http-auth',
        handler: (request, reply) => {
            reply(`Welcome from Hapi - ${request.auth.credentials.name}!`);
        }
    }
});

// Start server.
server.start(() => {
    console.log(`Server running at: ${server.info.uri}`);
});