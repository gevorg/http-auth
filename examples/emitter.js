// HTTP module
var http = require('http');

// Authentication module.
var auth = require('../gensrc/http-auth');
var basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// Adding event listeners.
basic.on('error', function() {
    console.log("System error!!!");
});

basic.on('fail', function() {
    console.log("Failed to access url!");
});

basic.on('success', function(result) {
    console.log("Accessing with user " + result.user);
});

// Creating new HTTP server.
http.createServer(basic, function(req, res) {
    res.end("Welcome to private area - " + req.user + "!");
}).listen(1337, function () {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
});