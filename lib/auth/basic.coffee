# Base authentication module.
Base = require './base'

# Utility module.
utils = require './utils'

# Basic authentication class.
class Basic extends Base    
  # Constructor.
  constructor: (@options, @checker) ->
    super @options, @checker
  
  # Processes line from authentication file.
  processLine: (line) ->
    [username, hash] = line.split ":"
    @options.users.push {username: username, hash: hash}
  
  # Validates password.
  validate: (hash, password) ->    
    if (hash.substr 0, 5) is '{SHA}'
      hash = hash.substr 5
      password = utils.sha1 password
    hash is password
  
  # Searching for user.
  findUser: (req, hash, callback) ->
    # Decode base64.
    [username, password] = (utils.decodeBase64 hash).split(":")
        
    if @checker # Custom authentication.
      @checker.apply this, [username, password, (success) =>
        callback.apply this, [{user: username if success}]
      ]
    else # File based.
      for user in @options.users # Loop users to find the matching one.
        if user.username is username and @validate user.hash, password
          found = true
          break # Stop searching, we found him.
          
      callback.apply this, [{user: username if found}]
      
  # Parsing authorization header.
  parseAuthorization: (header) ->
    [type, hash] = header.split " " # Split it.    
    if type is "Basic" # Only if type is basic.
      return hash # Return hash.
  
  # Generates request header.
  generateHeader: () ->     
    return "Basic realm=\"#{@options.realm}\""
           
# Exporting.
module.exports = (options, checker) ->
  new Basic options, checker
  