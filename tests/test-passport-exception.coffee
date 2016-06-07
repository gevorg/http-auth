# Request library.
request = require 'request'

# express library.
express = require 'express'

# Authentication library.
auth = require '../gensrc/http-auth'

# passport library.
passport = require 'passport'

# Utility library.
utils = require '../gensrc/auth/utils'

module.exports =

  # Before each test.
  setUp: (callback) ->
    # Configure authentication.
    digest = auth.digest {
      realm: "Simon Area.",
    },
      (username, callback) =>
        if username is "simon"
          callback (utils.md5 "simon:Simon Area.:smart")
        else
          callback new Error("Error comes here")

    # Creating new HTTP server.
    app = express()

    # Setup passport.
    passport.use(auth.passport(digest));

    # Setup route.
    app.get '/', passport.authenticate('http', { session: false }), (req, res) ->
      res.send "Hello from passport - #{req.user}!"

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
    (request.get 'http://127.0.0.1:1337', callback).auth 'gevorg', 'gpass', false


  # Correct details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Hello from passport - simon!"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth 'simon', 'smart', false