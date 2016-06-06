# Proxy module.
httpProxy = require 'http-proxy'

# Base module.
Base = require '../auth/base'

# Backup old server creation.
oldCreateServer = httpProxy.createServer

# Add authentication method.
httpProxy.createServer = httpProxy.createProxyServer = httpProxy.createProxy = (authentication, options) ->
  if authentication instanceof Base # Mutated mode.
    authentication.proxy = true # Set proxy flag.
  else
    options = authentication # Set correct options.
    authentication = null # Clear authentication value.

  # Default listener plus authentication check.
  server = oldCreateServer.apply httpProxy, [options]

  if authentication # Authentication provided.
    # Override proxyRequest.
    oldProxyRequest = server.web
    server.web = (req, res) ->
      # Fetch external arguments.
      externalArguments = arguments

      # Check for authentication.
      authentication.check req, res, (req, res, err) ->
        if err
          console.error err
          res.statusCode = 400
          res.end err.message
        else
          oldProxyRequest.apply server, externalArguments
        
  return server # Return.