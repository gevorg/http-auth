# http-auth
Utility that is creating HTTP server with basic authentication.

## Installation

Via git (or downloaded tarball):

    $ git clone git://github.com/gevorg/http-auth.git

Via [npm](http://github.com/isaacs/npm):

    $ npm install http-auth

## Usage
	
	/**
	 * HTTP Auth library.
	 */
	var httpAuth = require('http-auth');
	
	/**
	 * Creates private snake server.
	 */
	httpAuth.createServer('Sharon', 'bus412--', function(request, response) {
	    response.writeHead(200, {'Content-Type': 'text/html'});
	    response.end("<pre>Hi Sharon, welcome to private server.</pre>");
	}).listen(8000);

Server startup params
--------------------

  - **username** - Username that will be used in basic authentication.
  - **password** - Password that will be used in basic authentication.
  - **callback** - Callback function that will be called after server will start.

## License

The GPL version 3, read it at [http://www.gnu.org/licenses/gpl.txt](http://www.gnu.org/licenses/gpl.txt)