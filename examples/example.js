/**
 * Snake library.
 */
var snake = require('../lib/snake');

/**
 * Creates private snake server.
 */
snake.createServer('Sharon', 'bus412--', function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end("<pre>Hi Sharon, welcome to private snake server.</pre>");
}).listen(8000);