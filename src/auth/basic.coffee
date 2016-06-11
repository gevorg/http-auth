# Base authentication module.
Base = require './base'

# Utility module.
utils = require './utils'

# Importing apache-md5 module.
md5 = require 'apache-md5'

# Importing apache-crypt module.
crypt = require 'apache-crypt'

# Basic authentication class.
class Basic extends Base    
  # Constructor.
  constructor: (@options, @checker) ->
    super @options, @checker

  # Verifies if password is correct.
  validate: (hash, password) ->
    if (hash.substr 0, 5) is '{SHA}'
      hash = hash.substr 5
      hash is utils.sha1 password
    else if (hash.substr 0, 6) is '$apr1$'
      hash is md5(password, hash)
    else
      (hash is password) or ((crypt password, hash) is hash)
  
  # Processes line from authentication file.
  processLine: (line) ->
    lineSplit = line.split ":"
    username = lineSplit.shift()
    hash = lineSplit.join ":"
    
    @options.users.push {username: username, hash: hash}
  
  # Searching for user.
  findUser: (req, hash, callback) ->
    # Decode base64.
    splitHash = (utils.decodeBase64 hash).split ":"
    username = splitHash.shift()
    password = splitHash.join ":"

    if @checker # Custom authentication.
      @checker.apply this, [username, password, (result) =>
        if result instanceof Error
          params = [result]
        else
          params = [{user: username if result}]

        # Call callback.
        callback.apply this, params
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
  
