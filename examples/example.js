/**
 * HTTP auth library.
 */
var httpAuth = require('../lib/http-auth');

/**
 * Creates private HTTP server.
 */
httpAuth.createServer('Sharon', 'bus412--', function(request, response) {
	response.writeHead(200, {
		'Content-Type' : 'text/html'
	});
	response.end("<pre>Hi Sharon, welcome to private HTTP server.</pre>");
}).listen(8000);