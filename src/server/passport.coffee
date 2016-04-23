passport = require 'passport'
util = require 'util'

HttpStrategy = (authentication) ->
  this.name = 'http'
  this.authentication = authentication

  passport.Strategy.call this

util.inherits HttpStrategy, passport.Strategy

HttpStrategy.prototype.authenticate = (req) ->
  self = this

  this.authentication.isAuthenticated req, (result) ->
    if not result.user
      header = self.authentication.generateHeader result
      self.fail header
    else
      self.success result.user

# Export strategy.
module.exports = (authentication) ->
  new HttpStrategy(authentication)