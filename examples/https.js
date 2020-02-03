// HTTPS module
const https = require("https");

// File system module.
const fs = require("fs");

// Authentication module.
const auth = require("../src/http-auth");
const basic = auth.basic({
  realm: "Simon Area.",
  file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// HTTPS server options.
const options = {
  key: fs.readFileSync(__dirname + "/../data/server.key"),
  cert: fs.readFileSync(__dirname + "/../data/server.crt")
};

// Starting server.
https
  .createServer(
    options,
    basic.check((req, res) => {
      res.end(`Welcome to private area - ${req.user}!`);
    })
  )
  .listen(1337, () => {
    // Log URL.
    console.log("Server running at https://127.0.0.1:1337/");
  });
