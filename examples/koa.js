// Koa.
var koa = require('koa');
var app = koa();

// Authentication module.
var auth = require('../src/http-auth');
var basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// Final handler.
app.use(function *(next) {
    yield next;
    this.body = `Hello from koa - ${this.req.user}!`;
});

// Enable auth.
app.use(auth.koa(basic));

// Start server.
app.listen(1337, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
});