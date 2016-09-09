"use strict";

// HTTP module.
import http from 'http'

// Base module.
import Base from '../auth/base'

// Backup old server creation.
let oldCreateServer = http.createServer;

// Add authentication method.
http.createServer = function () {
    let server = undefined;

    // Mutated mode.
    if (arguments[0] instanceof Base) {
        let auth = arguments[0];

        // With listener.
        if (arguments[1]) {
            let listener = arguments[1];
            let newListener = (req, res) => {
                auth.check(req, res, (req, res, err) => {
                    if (err) {
                        console.error (err);
                        res.statusCode = 400;
                        res.end(err.message);
                    } else {
                        listener(req, res);
                    }
                });
            };

            // Mutate server.
            server = oldCreateServer.apply(http, [newListener]);
        } else {
            // Without listener.
            server = oldCreateServer.apply(http, []);
            server.on('request', (req, res) => {
                auth.check(req, res);
            });
        }
    } else {
        server = oldCreateServer.apply(http, arguments);
    }

    // Return server.
    return server;
};