// Koa.
var koa = require('koa');
var app = koa();

// Authentication module.
var auth = require('../gensrc/http-auth');
var basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// Enable auth.
app.use(auth.koa(basic));

// Final handler.
app.use(function *(){
    this.body = "Hello from koa - " + this.req.user + "!";
});

// Start server.
app.listen(1337, function () {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
});