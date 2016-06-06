# Request library.
request = require 'request'

# HTTP library.
http = require 'http'

# Proxy library.
httpProxy = require 'http-proxy'

# Authentication library.
auth = require '../gensrc/http-auth'

module.exports =
  
  # Before each test.
  setUp: (callback) ->
    basic = auth.basic { # Configure authentication.
      realm: "Private Area."
    },
      (username, password, callback) =>
        if username is "gevorg"
          callback new Error("Error comes here")
        else
          callback true

    # Create your proxy server.
    @proxy = (httpProxy.createServer basic, { target: 'http://localhost:1338' }).listen 1337

    # Create your target server.
    @server = http.createServer (req, res) ->
      res.end "Request successfully proxied!"
    # Start server.
    @server.listen 1338
    
    callback()
  
  # After each test.
  tearDown: (callback) ->
    @proxy.close() # Stop proxy.    
    @server.close() # Stop server.    
    callback()

  # Error should be thrown.
  testError: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Error comes here"
      test.done()

    # Test request.
    (request.get {proxy: 'http://gevorg:gpass@127.0.0.1:1337', uri: 'http://127.0.0.1:1337'}, callback)


  # Correct encrypted details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.      
      test.equals body, "Request successfully proxied!"
      test.done()
      
    # Test request.    
    (request.get {proxy: 'http://valod:vvvs@127.0.0.1:1337', uri: 'http://127.0.0.1:1337'}, callback)
