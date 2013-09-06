# Base authentication module.
Base = require './base'

# Utility module.
utils = require './utils'

# UUID module.
uuid = require 'node-uuid'

# Digest authentication class.
class Digest extends Base    
  # Constructor.
  constructor: (@options, @checker) ->
    super @options, @checker
    # Array of random strings sent to clients.
    @nonces = []    
    # Algorithm of encryption, could be MD5 or MD5-sess, default is MD5.
    @options.algorithm = 'MD5' if not @options.algorithm

  # Processes line from authentication file.
  processLine: (line) ->
    [username, realm, hash] = line.split ":"
    if realm is @options.realm # We need only users for given realm.
      @options.users.push {username: username, hash: hash}

  # Parse authorization header.
  parseAuthorization: (header) ->
    clientOptions = [] # Parsed options.

    # Split using comma.
    tokens = header.split ", "      
    if (tokens[0].substr 0, 6) is "Digest" # is Digest. 
      tokens[0] = tokens[0].substr 7 # Remove type.
      
      clientOptions = [] # Collecting options.     
      
      for token in tokens # Looping tokens.        
        [name, value] = token.split "=", 2
                
        if (value.indexOf "\"") != -1 
          value = value.substr 1, (value.length - 2) # Strip quotes.
        
        # Add option.
        clientOptions[name] = value; 
                     
      return clientOptions # Returning options.
  
  # Validating hash.
  validate: (ha2, co, hash) ->
    ha1 = hash
    if co.algorithm is 'MD5-sess' # Algorithm.
      ha1 = utils.md5 "#{ha1}:#{co.nonce}:#{co.cnonce}"

    if co.qop # Quality of protection.
      response = utils.md5 "#{ha1}:#{co.nonce}:#{co.nc}:#{co.cnonce}:#{co.qop}:#{ha2}"
    else 
      response = utils.md5 "#{ha1}:#{co.nonce}:#{ha2}"
    # Returning result.      
    response is co.response
  
  # Searching for user.
  findUser: (req, co, callback) ->        
    if co.nonce in @nonces
      ha2 = utils.md5 "#{req.method}:#{co.uri}"
      
      if @checker # Custom authentication.
        @checker.apply this, [co.username, (hash) =>
          callback.apply this, [{user: co.username if (@validate ha2, co, hash)}]
        ]
      else # File based.
        for user in @options.users # Loop users to find the matching one.
          if user.username is co.username and @validate ha2, co, user.hash
            found = true
            break # Stop searching, we found him.
            
        callback.apply this, [{user: co.username if found}]      
    else
      callback.apply this, [{stale: true}]
    
  # Remove nonce.
  removeNonce: (nonce, nonces) ->
    index = nonces.indexOf nonce
    
    if index != -1 # Nonce found.
      nonces.splice index, 1 # Remove it from array.

  # Generates and returns new random nonce.
  askNonce: () ->
    nonce = utils.md5 uuid.v4() # Random nonce.
    @nonces.push nonce # Push into nonces.
    
    # Schedule deletion from 1 hour.
    setTimeout @removeNonce, 3600000, nonce, @nonces
    return nonce # Return it.
  
  # Generates request header.
  generateHeader: (result) ->
    nonce = @askNonce()
    stale = if result.stale then true else false
    
    # Returning it.
    return "Digest realm=\"#{@options.realm}\", qop=\"auth\", nonce=\"#{nonce}\", algorithm=\"#{@options.algorithm}\", stale=\"#{stale}\""
    
# Exporting.
module.exports = (options, checker) ->
  new Digest options, checker
  