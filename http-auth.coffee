# HTTP integration.
require './src/server/http'

# HTTPS integration.
require './src/server/https'

# Only if http-proxy is available.
if (require('./src/auth/utils').isAvailable('http-proxy'))
  # Proxy integration.
	require('./src/server/proxy')

# Exporting.
module.exports = {
  basic: (options, checker) -> require('./src/auth/basic')(options, checker)
  digest: (options, checker) -> require('./src/auth/digest')(options, checker)
  connect: (authentication) -> require('./src/server/connect')(authentication)
  passport: (authentication) -> require('./src/server/passport')(authentication)
  koa: (authentication) -> require('./src/server/koa')(authentication)
}
