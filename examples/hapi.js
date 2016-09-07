const hapi = require('hapi');
const hapiAuthBasic = require('hapi-auth-basic');

const auth = require('../gensrc/http-auth');

// Create a server with a host and port
const server = new hapi.Server();
server.connection({ port: 1337 });
server.register({ register: hapiAuthBasic });

const validateFunc = (request, username, password, callback) => {
  const noError = undefined;
  const basic = auth.basic({ file: `${__dirname}/../data/users.htpasswd` }); // gevorg:gpass, Sarah:testpass
  const isValid = basic.options.users
    .filter(user => user.username !== '') // ignore blank lines
    .find(user => basic.validate(user.hash, password) && username === user.username); // match credential

  callback(noError, isValid, { username });
};

server.auth.strategy('dialog', 'basic', { validateFunc });

// Add the route
server.route({
  method: 'GET',
  path: '/',
  config: { auth: 'dialog' }, // tag each route to enforce protection
  handler: (request, reply) => reply(`Welcome to hapi private area - ${request.auth.credentials.username}!`)
});

server.route({
  method: 'GET',
  path: '/public',
  handler: (request, reply) => reply('Welcome to hapi public area!')
});

// Start the server
server.start(err => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri); // eslint-disable-line no-console
});
