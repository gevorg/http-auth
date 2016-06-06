# Exporting koa integration.
module.exports = (authentication) ->
  # Default schema for connect.
  middleware = (req, res, next) ->
    authentication.check req, res, (req, res, error) -> # Authenticated!
      # Go forward.
      if error
        next error
      else
        next()
        
  # Return generator function.
  return (next) ->
    yield middleware.bind(null, this.req, this.res)
    yield next