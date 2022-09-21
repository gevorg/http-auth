"use strict";

// File system module.
const fs = require("fs");

// Event module.
const events = require("events");

// Base authentication.
class Base extends events.EventEmitter {
  // Constructor.
  constructor(options, checker) {
    super();

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

    if (!options.proxy) {
      options.proxy = false;
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
  // eslint-disable-next-line no-unused-vars
  processLine(userLine) {
    throw new Error("Not defined!");
  }

  // Parse auth header.
  // eslint-disable-next-line no-unused-vars
  parseAuthorization(header) {
    throw new Error("Not defined!");
  }

  // Find user.
  // eslint-disable-next-line no-unused-vars
  findUser(req, clientOptions, callback) {
    throw new Error("Not defined!");
  }

  // Generates header.
  // eslint-disable-next-line no-unused-vars
  generateHeader(result) {
    throw new Error("Not defined!");
  }

  // Ask for authentication.
  ask(res, result) {
    let header = this.generateHeader(result);
    res.setHeader("Content-Type", this.options.contentType);

    if (this.options.proxy) {
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
  check(callback) {
    let self = this;

    return (req, res) => {
      this.isAuthenticated(req, result => {
        if (result instanceof Error) {
          self.emit("error", result, req);

          res.statusCode = 400;
          res.end(result.message);
        } else if (!result.pass) {
          self.emit("fail", result, req);
          self.ask(res, result);
        } else {
          self.emit("success", result, req);

          if (!self.options.skipUser) {
            req.user = result.user;
          }

          if (callback) {
            callback.apply(self, [req, res]);
          }
        }
      });
    };
  }

  // Is authenticated method.
  isAuthenticated(req, callback) {
    let self = this;
    let header = undefined;
    if (this.options.proxy) {
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
        this.findUser(req, clientOptions, result => {
          callback.apply(self, [result]);
        });
      }
    }

    // Only if not searching call callback.
    if (!searching) {
      callback.apply(this, [{}]);
    }
  }

  // Loading files or using a callback with user details.
  loadUsers() {
    let content =
      typeof this.options.file == "function"
        ? this.options.file(this)
        : fs.readFileSync(this.options.file, "UTF-8");
    let users = content.replace(/\r\n/g, "\n").split("\n");

    // Process all users.
    users.forEach(u => {
      if (u && !u.match(/^\s*#.*/)) {
        this.processLine(u);
      }
    });
  }
}

// Export base.
module.exports = Base;
