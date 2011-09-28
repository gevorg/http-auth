/**
 * Authentication module.
 */
var auth = require('../lib/http-auth');

/**
 * URL parser module.
 */
var urlpaser = require('url');

var basicNot = auth.basic({
	authRealm : 'Pupsik I DON\'T LOVE YOU!',
	authFile : __dirname + '/users.htpasswd',
});

var basic = auth.basic({
	authRealm : 'Pupsik I LOVE YOU!',
	authList : ['mia:kia', 'valod:malod', 'saho:maho']
});

var http = require('http');
http.createServer(function(req, res) {
	// Parsing url.
	url = urlpaser.parse(req.url, true);
	
	if(url.pathname == "/not") {
		basicNot.apply(req, res, function(req, res) {
			res.end('Hello NOT World\n');
		});
		
	} else {
		basic.apply(req, res, function(req, res) {
			res.end('Hello World\n');
		});
	}
}).listen(1337);

console.log('Server running at http://127.0.0.1:1337/');
