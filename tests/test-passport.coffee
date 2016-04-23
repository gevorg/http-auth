# Request library.
request = require 'request'

# express library.
express = require 'express'

# Authentication library.
auth = require '../gensrc/http-auth'

# passport library.
passport = require 'passport'

module.exports =

  # Before each test.
  setUp: (callback) ->
    digest = auth.digest { # Configure authentication.
      realm: "Simon Area.",
      file: __dirname + "/../data/users.htdigest"
    }

    # Creating new HTTP server.
    app = express()

    # Setup passport.
    passport.use(auth.passport(digest));

    # Setup route.
    app.get '/', passport.authenticate('http', { session: false }), (req, res) ->
      res.send "Hello from express - #{req.user}!"

    # Start server.
    @server = app.listen 1337
    callback()

  # After each test.
  tearDown: (callback) ->
    @server.close() # Stop server.
    callback()

  # Correct details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Hello from express - vivi!"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth 'vivi', 'anna', false

  # Wrong password.
  testWrongPassword: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Unauthorized"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth 'vivi', 'duck', false

  # Wrong user.
  testWrongUser: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Unauthorized"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth 'solomon', 'gpass', false