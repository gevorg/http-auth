# Request library.
request = require 'request'

# express library.
express = require 'express'

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
    app = express()
    app.use(auth.connect basic)
    
    # Setup route.
    app.get '/', (req, res) ->
      res.send "Hello from express - #{req.user}!"

    # Error handler.
    app.use (err, req, res, next) ->
      res.status(400).end(err.message);

    # Start server.
    @server = app.listen 1337
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

  # Correct encrypted details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Hello from express - malina!"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth 'malina', 'mpass'
