// Utility module.
const utils = require("../src/auth/utils");

// HTTP module
const http = require("http");

// Authentication module.
const auth = require("../src/http-auth");
const digest = auth.digest(
  {
    realm: "Simon Area."
  },
  (username, callback) => {
    // Expecting md5(username:realm:password) in callback.
    if (username === "simon") {
      callback(utils.md5("simon:Simon Area.:smart"));
    } else if (username === "tigran") {
      callback(utils.md5("tigran:Simon Area.:great"));
    } else {
      callback();
    }
  }
);

// Creating new HTTP server.
http
  .createServer(
    digest.check((req, res) => {
      res.end(`Welcome to private area - ${req.user}!`);
    })
  )
  .listen(1337, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
  });
