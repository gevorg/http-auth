// HTTP module
var http = require('http');

// Authentication module.
var auth = require('../src/http-auth');
var basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// Adding event listeners.
basic.on('success', (result, req) => {
    console.log(`User authenticated: ${result.user}`);
});

basic.on('fail', (result, req) => {
    console.log(`User authentication failed: ${result.user}`);
});

basic.on('error', (error, req) => {
    console.log(`Authentication error: ${error.code + " - " + error.message}`);
});

// Creating new HTTP server.
http.createServer(basic, (req, res) => {
    res.end(`Welcome to private area - ${req.user}!`);
}).listen(1337, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
});