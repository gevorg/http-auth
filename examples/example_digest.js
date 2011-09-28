/**
 * Authentication module.
 */
var auth = require('../lib/http-auth');

var digest = auth.digest({
	authRealm : 'Pupsik I LOVE YOU!',
	authList : ['mia:kia', 'valod:malod', 'saho:maho']
});

var http = require('http');
http.createServer(function(req, res) {
	digest.apply(req, res, function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end('Hello DIGEST World\n<form method="POST"><input type="submit" value="do It!"/><input type="text" name="some" value="val"/></form>');
	});		
}).listen(1337);

console.log('Server running at http://127.0.0.1:1337/');