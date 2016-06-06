# Exporting connect integration.
module.exports = (authentication) ->
  (req, res, next) -> # Default schema for connect.
    authentication.check req, res, (req, res, error) -> # Authenticated!
      # Go forward.
      if error
        next error
      else
        next()