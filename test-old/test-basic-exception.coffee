# Request library.
request = require 'request'

# HTTP library.
http = require 'http'

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

    # Creating new HTTP server.
    @server = http.createServer basic, (req, res) ->
      res.end "Welcome to private area - #{req.user}!"    

    # Start server.
    @server.listen 1337    
    callback()
  
  # After each test.
  tearDown: (callback) ->
    @server.close() # Stop server.    
    callback()

  # Error should be thrown.
  testError: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Error comes here"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth 'gevorg', 'gpass'

  # Correct details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Welcome to private area - valod!"
      test.done()

    # Test request.    
    (request.get 'http://127.0.0.1:1337', callback).auth 'valod', 'vpass'
