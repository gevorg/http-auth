"use strict";

// Base class.
import Base from './base'

// Utility module.
import * as utils from './utils'

// Importing apache-md5 module.
import md5 from 'apache-md5'

// Importing apache-crypt module.
import crypt from 'apache-crypt'

// Define basic auth.
class Basic extends Base {
    // Constructor.
    constructor(options, checker) {
        super(options, checker);
    }

    // Verifies if password is correct.
    validate (hash, password) {
        if (hash.substr(0, 5) === '{SHA}') {
            hash = hash.substr(5);
            return hash === utils.sha1(password);
        } else if (hash.substr(0, 6) === '$apr1$' || hash.substr(0, 3) === '$1$') {
            return hash === md5(password, hash);
        } else {
            return hash === password || hash === crypt(password, hash);
        }
    }

    // Processes line from authentication file.
    processLine (userLine) {
        let lineSplit = userLine.split(":");
        let username = lineSplit.shift();
        let hash = lineSplit.join(":");

        // Push user.
        this.options.users.push({username: username, hash: hash});
    }

    // Generates request header.
    generateHeader () {
        return `Basic realm=\"${this.options.realm}\"`;
    }

    // Parsing authorization header.
    parseAuthorization (header) {
        let tokens = header.split(" ");
        if (tokens[0] === "Basic") {
            return tokens[1];
        }
    }

    // Searching for user.
    findUser(req, hash, callback) {
        // Decode base64.
        let splitHash = utils.decodeBase64(hash).split(":");
        let username = splitHash.shift();
        let password = splitHash.join(":");

        let self = this;

        if (this.checker) {
            // Custom auth.
            this.checker.apply(this, [username, password, function (result) {
                let params = undefined;

                if (result instanceof Error) {
                    params = [result]
                } else {
                    params = [{ user: result ? username: undefined }];
                }

                callback.apply(self, params);
            }, req]);
        } else {
            // File based auth.
            let found = false;

            // Loop users to find the matching one.
            this.options.users.forEach(user => {
                if (user.username === username && this.validate(user.hash, password)) {
                    found = true;
                }
            });

            // Call final callback.
            callback.apply(this, [{user: found ? username : undefined}]);
        }
    }
}

// Export basic auth.
export default function (options, checker) {
    return new Basic(options, checker);
}