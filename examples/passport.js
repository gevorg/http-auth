// Express module.
var express = require('express');

// Authentication module.
var auth = require('../gensrc/http-auth');
var basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass ...
});

// Application setup.
var app = express();

// Passport.
var passport = require('passport');
passport.use(auth.passport(basic));

// Setup route.
app.get('/', passport.authenticate('http', { session: false }), function(req, res) {
    res.end("Welcome to private area - " + req.user + "!");
});

// Start server.
app.listen(1337, function () {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
});

