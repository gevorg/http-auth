// HTTP module
var http = require('http');

// Authentication module.
var auth = require('../src/http-auth');
var basic = auth.basic({
		realm: "Simon Area."
	}, (username, password, callback) => {
		// Custom authentication method.
		callback(username === "Tina" && password === "Bullock");
	}
);

// Creating new HTTP server.
http.createServer(basic, (req, res) => {
	res.end(`Welcome to private area - ${req.user}!`);
}).listen(1337, () => {
	// Log URL.
	console.log("Server running at http://127.0.0.1:1337/");
});