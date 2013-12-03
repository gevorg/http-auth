# Request library.
request = require 'request'

# HTTP library.
http = require 'http'

# Authentication library.
auth = require '../lib/http-auth'

module.exports =
  
  # Before each test.
  setUp: (callback) ->
    basic = auth.basic { # Configure authentication.
      realm: "Private Area.",
      file: __dirname + "/../data/users.htpasswd"
    }
    @basic = basic

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
  
  # Correct encrypted details.
  testSuccess: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Welcome to private area - gevorg!"
      test.done()
      
    # Test request.    
    (request.get 'http://127.0.0.1:1337', callback).auth 'gevorg', 'gpass'
  
  # Correct plain details.
  testSuccessPlain: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "Welcome to private area - Sarah!"
      test.done()
      
    # Test request.    
    (request.get 'http://127.0.0.1:1337', callback).auth 'Sarah', 'testpass'
    
  # Wrong password.
  testWrongPassword: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "401 Unauthorized"
      test.done()
      
    # Test request.    
    (request.get 'http://127.0.0.1:1337', callback).auth 'gevorg', 'duck'
    
  # Wrong user.
  testWrongUser: (test) ->
    callback = (error, response, body) -> # Callback.
      test.equals body, "401 Unauthorized"
      test.done()
      
    # Test request.    
    (request.get 'http://127.0.0.1:1337', callback).auth 'solomon', 'gpass'

  # Passwords containing colons
  testColonPassword: (test) ->
    basic = @basic
    username = 'ColonUser'
    password = 'apasswordwith:acolon'

    callback = (error, response, body) -> # Callback.
      # Ensure that password was parsed correctly
      for user in basic.options.users
        if user.username is username
          test.equals user.hash, password

      test.equals body, "Welcome to private area - #{username}!"
      test.done()

    # Test request.
    (request.get 'http://127.0.0.1:1337', callback).auth username, password
