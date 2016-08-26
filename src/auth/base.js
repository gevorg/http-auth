"use strict";

// File system module.
import fs from 'fs'

// Base authentication.
class Base {
    // Constructor.
    constructor(options, checker) {
        if (!options.msg401) {
            options.msg401 = "401 Unauthorized";
        }

        if (!options.msg407) {
            options.msg407 = "407 Proxy authentication required";
        }

        if (!options.contentType) {
            options.contentType = "text/plain";
        }

        if (!options.realm) {
            options.realm = "users";
        }

        // Assign values.
        this.options = options;
        this.checker = checker;

        // Loading users from file, if file is set.
        this.options.users = [];

        if (!checker && options.file) {
            this.loadUsers();
        }
    }

    // Processing user line.
    processLine(userLine) {
        throw new Error('Not defined!');
    }

    // Parse auth header.
    parseAuthorization(header) {
        throw new Error('Not defined!');
    }

    // Find user.
    findUser(req, clientOptions, callback) {
        throw new Error('Not defined!');
    }

    // Generates header.
    generateHeader(result) {
        throw new Error('Not defined!');
    }

    // Ask for authentication.
    ask(res, result) {
        let header = this.generateHeader(result);
        res.setHeader("Content-Type", this.options.contentType);

        if (this.proxy) {
            res.setHeader("Proxy-Authenticate", header);
            res.writeHead(407);
            res.end(this.options.msg407);
        } else {
            res.setHeader("WWW-Authenticate", header);
            res.writeHead(401);
            res.end(this.options.msg401);
        }
    }

    // Checking if user is authenticated.
    check(req, res, callback) {
        let self = this;
        this.isAuthenticated(req, function (result) {
            if (result instanceof Error) {
                if (callback) {
                    callback.apply(self, [req, res, result]);
                }
            } else if (!result.user) {
                self.ask(res, result);
            } else {
                if (!this.options.skipUser) {
                    req.user = result.user;
                }

                if (callback) {
                    callback.apply(self, [req, res]);
                }
            }
        });
    }

    // Is authenticated method.
    isAuthenticated(req, callback) {
        let self = this;
        let header = undefined;
        if (this.proxy) {
            header = req.headers["proxy-authorization"];
        } else {
            header = req.headers["authorization"];
        }

        // Searching for user.
        let searching = false;

        // If header is sent.
        if (header) {
            let clientOptions = this.parseAuthorization(header);
            if (clientOptions) {
                searching = true;
                clientOptions.host = req.headers["host"];
                this.findUser(req, clientOptions, function (result) {
                    callback.apply(self, [result]);
                });
            }
        }

        // Only if not searching call callback.
        if (!searching) {
            callback.apply(this, [{}]);
        }
    }

    // Loading files with user details.
    loadUsers() {
        let users = fs.readFileSync(this.options.file, 'UTF-8').replace(/\r\n/g, "\n").split("\n");

        // Process all users.
        users.forEach(u => {
            this.processLine(u);
        });
    }
}

// Export base.
export default Base