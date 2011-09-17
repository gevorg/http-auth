# snake
Utility that is creating HTTP server with basic authentication.

## Installation

Via git (or downloaded tarball):

    $ git clone git://github.com/gevorg/snake.git

Via [npm](http://github.com/isaacs/npm):

    $ npm install snake

## Usage
	
	/**
	 * Snake library.
	 */
	var snake = require('snake');
	
	/**
	 * Creates private snake server.
	 */
	snake.createServer('Sharon', 'bus412--', function(request, response) {
	    response.writeHead(200, {'Content-Type': 'text/html'});
	    response.end("<pre>Hi Sharon, welcome to private snake server.</pre>");
	}).listen(8000);

Snake server startup params
--------------------

  - **username** - Username that will be used in basic authentication.
  - **password** - Password that will be used in basic authentication.
  - **callback** - Callback function that will be called after server will start.

## License

The GPL version 3, read it at [http://www.gnu.org/licenses/gpl.txt](http://www.gnu.org/licenses/gpl.txt)

[Node.JS]: http://nodejs.org/