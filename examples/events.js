// HTTP module
const http = require("http");

// Authentication module.
const auth = require("../src/http-auth");
const basic = auth.basic({
  realm: "Simon Area.",
  file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// Adding event listeners.
basic.on("success", result => {
  console.log(`User authenticated: ${result.user}`);
});

basic.on("fail", result => {
  console.log(`User authentication failed: ${result.user}`);
});

basic.on("error", error => {
  console.log(`Authentication error: ${error.code + " - " + error.message}`);
});

basic.on("preauth", (preauth, req) => {
  if (req.headers.host === "example.com") {
    preauth = { user: "preauth", pass: true };
  }
});

// Creating new HTTP server.
http
  .createServer(
    basic.check((req, res) => {
      res.end(`Welcome to private area - ${req.user}!`);
    })
  )
  .listen(1337, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
  });
