// HTTP proxy module.
const http = require('http'),
    httpProxy = require('http-proxy');

// Authentication module.
const auth = require('../src/http-auth');
const basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd", // gevorg:gpass, Sarah:testpass
    proxy: true
});

// Create your proxy server.
const proxy = httpProxy.createProxyServer({});
http.createServer(basic.check((req, res) => {
    proxy.web(req, res, { target: 'http://127.0.0.1:1338' });
})).listen(1337);

// Create your target server.
http.createServer((req, res) => {
    res.end("Request successfully proxied!");
}).listen(1338, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1338/");
});

// You can test proxy authentication using curl.
// $ curl -x 127.0.0.1:1337  127.0.0.1:1337 -U gevorg