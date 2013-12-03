# Request library.
request = require 'request'

# HTTP library.
http = require 'http'

# Authentication library.
auth = require '../lib/http-auth'

module.exports =
  
  # Before each test.
  setUp: (callback) ->

    # dummy auth callback to override in unit test before making request
    @authCallback = (username, password, cb) ->
      cb()

    basic = auth.basic { # Configure authentication.
      realm: "Private Area.",
    }, (username, password, cb) =>
      @authCallback username, password, cb

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

  testColonPassword: (test) ->

    username = 'ColonUser'
    password = 'apasswordwith:acolon'

    @authCallback = (username, parsedPassword, cb) ->
      test.equals password, parsedPassword

      if password is parsedPassword
        cb(true)
      else
        cb(false)

      test.done()

    (request.get 'http://127.0.0.1:1337').auth username, password
