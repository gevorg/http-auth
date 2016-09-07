/* global describe, it */
// Expect module.
import {expect} from 'chai'

// hapi.
import hapi from 'hapi'

// hapi-auth-basic.
import hapiAuthBasic from 'hapi-auth-basic'

// hapi.
describe('hapi', () => {
  // Create a server with a host and port
  const server = new hapi.Server();
  server.connection({ port: 1337 });
  server.register({ register: hapiAuthBasic });

  it('success public page', done => {
    server.inject({
      method: 'GET',
      url: '/public'
    }, response => {
      expect(response.statusCode).to.equal(200);
      expect(response.result.indexOf('hapi public area')).to.not.equal(-1);
      done();
    });
  });

  it('success private page', done => {
    const authHeader = (username, password) => `Basic ${(new Buffer(`${username}:${password}`, 'utf8'))
      .toString('base64')}`;

    server.inject({
      method: 'GET',
      url: '/',
      headers: {
        authorization: authHeader('mia', 'supergirl')
      }
    }, response => {
      expect(response.statusCode).to.equal(200);
      expect(response.result.indexOf('hapi private area')).to.not.equal(-1);
      done();
    });
  });
});
