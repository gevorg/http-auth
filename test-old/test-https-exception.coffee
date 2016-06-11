# Request library.
request = require 'request'

# HTTPS library.
https = require 'https'

# File system library.
fs = require 'fs'

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

    # HTTPS server options.
    options = {
      key: fs.readFileSync(__dirname + "/../data/server.key"),
      cert: fs.readFileSync(__dirname + "/../data/server.crt")
    }

    # Creating new HTTPS server.
    @server = https.createServer basic, options, (req, res) ->
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
    (request.get {uri: 'https://127.0.0.1:1337', strictSSL: false}, callback).auth 'gevorg', 'ggg'


  # Correct encrypted details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Welcome to private area - valod!"
      test.done()
      
    # Test request.    
    (request.get {uri: 'https://127.0.0.1:1337', strictSSL: false}, callback).auth 'valod', 'sss'
