# HTTP module.
http = require 'http'

# Backup old server creation.
oldCreateServer = http.createServer

# Add authentication method.
http.createServer = (authentication, listener) ->
  if listener # Mutated mode.
    # New listener that also checks if user is authenticated.
    newListener = (req, res) ->
      authentication.check req, res, listener
  else # Normal mode.
    newListener = authentication  
    
  # Default listener plus authentication check.
  oldCreateServer.apply http, [newListener]