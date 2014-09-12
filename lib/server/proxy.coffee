# Proxy module.
httpProxy = require 'http-proxy'

# Base module.
Base = require '../auth/base'

# Backup old server creation.
oldCreateServer = httpProxy.createServer

# Add authentication method.
httpProxy.createServer = httpProxy.createProxyServer = httpProxy.createProxy = () ->
  if arguments[0] instanceof Base # Mutated mode.
    authentication = arguments[0]
    authentication.proxy = true
    delete arguments[0] # Remove bad argument.

  # Default listener plus authentication check.
  server = oldCreateServer.apply httpProxy, [arguments[1]]

  if authentication # Authentication provided.
    # Override proxyRequest.
    oldProxyRequest = server.web
    server.web = (req, res) ->
      # Fetch external arguments.
      externalArguments = arguments

      authentication.check req, res, () -> # Check for authentication.
        oldProxyRequest.apply server, externalArguments
        
  return server # Return.