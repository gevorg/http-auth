# Request library.
request = require 'request'

# koa library.
koa = require 'koa'

# Authentication library.
auth = require '../gensrc/http-auth'

# Utility library.
utils = require '../gensrc/auth/utils'

module.exports =
  
  # Before each test.
  setUp: (callback) ->
    # Configure authentication.
    digest = auth.digest {
      realm: "Private Area.",
    },
      (username, callback) =>
        if username is "simon"
          callback (utils.md5 "simon:Private Area.:smart")
        else
          callback new Error("Error comes here")

    # Creating new HTTP server.
    app = koa();

    # Exception handling.
    app.use (next) ->
      try
        yield next
      catch err
        this.status = 400;
        this.body = err.message;

    # Authentication.
    app.use(auth.koa digest)

    # Setup route.
    app.use () ->
      this.body = "Hello from koa - " + this.req.user + "!"
      yield return



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
    (request.get 'http://127.0.0.1:1337', callback).auth 'gevorg', 'gpass', false

  # Correct encrypted details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Hello from koa - simon!"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth 'simon', 'smart', false
