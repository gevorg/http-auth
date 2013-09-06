# HTTPS module.
https = require 'https'

# Backup old server creation.
oldCreateServer = https.createServer

# Add authentication method.
https.createServer = (authentication, options, listener) ->
  if listener # Mutated mode.
    # New listener that also checks if user is authenticated.
    newListener = (req, res) ->
      authentication.check req, res, listener
  else # Normal mode.
    newListener = options
    options = authentication
    
  # Default listener plus authentication check.
  oldCreateServer.apply https, [options, newListener]