# http-auth
[Node.js](http://nodejs.org/) package for HTTP basic and digest access authentication.

[![build](https://github.com/http-auth/http-auth/workflows/build/badge.svg)](https://github.com/http-auth/http-auth/actions?query=workflow%3Abuild)

## Installation

Via git (or downloaded tarball):

```bash
$ git clone git://github.com/http-auth/http-auth.git
```
Via [npm](http://npmjs.org/):

```bash
$ npm install http-auth
```    

## Basic example
```javascript
// Authentication module.
const auth = require('http-auth');
const basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd"
});

// Creating new HTTP server.
http.createServer(basic.check((req, res) => {
    res.end(`Welcome to private area - ${req.user}!`);
})).listen(1337);

```
## Custom authentication
```javascript    
// Authentication module.
const auth = require('http-auth');
const basic = auth.basic({
        realm: "Simon Area."
    }, (username, password, callback) => { 
        // Custom authentication
        // Use callback(error) if you want to throw async error.
        callback(username === "Tina" && password === "Bullock");
    }
);

// Creating new HTTP server.
http.createServer(basic.check((req, res) => {
    res.end(`Welcome to private area - ${req.user}!`);
})).listen(1337);
```

## [http-proxy](https://github.com/nodejitsu/node-http-proxy/) integration
```javascript
// HTTP proxy module.
const http = require('http'),
    httpProxy = require('http-proxy');

// Authentication module.
const auth = require('http-auth');
const basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd", // gevorg:gpass, Sarah:testpass
    proxy: true
});

// Create your proxy server.
const proxy = httpProxy.createProxyServer({});
http.createServer(basic.check((req, res) => {
    proxy.web(req, res, { target: 'http://127.0.0.1:1338' });
})).listen(1337);

// Create your target server.
http.createServer((req, res) => {
    res.end("Request successfully proxied!");
}).listen(1338, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1338/");
});

// You can test proxy authentication using curl.
// $ curl -x 127.0.0.1:1337  127.0.0.1:1337 -U gevorg
```

## Events

The auth middleware emits three types of events: **error**, **fail** and **success**. Each event passes the result object (the error in case of `fail`) and the http request `req` to the listener function.

```javascript
// Authentication module.
const auth = require('http-auth');
const basic = auth.basic({
    realm: "Simon Area.",
    file: __dirname + "/../data/users.htpasswd"
});

basic.on('success', (result, req) => {
    console.log(`User authenticated: ${result.user}`);
});

basic.on('fail', (result, req) => {
    console.log(`User authentication failed: ${result.user}`);
});

basic.on('error', (error, req) => {
    console.log(`Authentication error: ${error.code + " - " + error.message}`);
});
```

## Configurations

 - `realm` - Authentication realm, by default it is **Users**.
 - `file` - File where user details are stored.
     - Line format is **{user:pass}** or **{user:passHash}** for basic access. 
     - Line format is **{user:realm:passHash}** for digest access.
 - `algorithm` - Algorithm that will be used only for **digest** access authentication.
     - **MD5** by default.
     - **MD5-sess** can be set.
 - `qop` - Quality of protection that is used only for **digest** access authentication.
     - **auth** is set by default.
     - **none** this option is disabling protection.
 - `msg401` - Message for failed authentication 401 page.
 - `msg407` - Message for failed authentication 407 page.
 - `contentType` - Content type for failed authentication page.
 - `skipUser` - Set this to **true**, if you don't want req.user to be filled with authentication info.
 - `proxy` - Set this to **true**, if you want to use it with [http-proxy](https://github.com/http-party/node-http-proxy).

## Running tests

It uses [mocha](https://mochajs.org/), so just run following command in package directory:

```bash
$ npm test
```

## Issues

You can find list of issues using **[this link](http://github.com/http-auth/http-auth/issues)**.

## Questions

You can also use [stackoverflow](http://stackoverflow.com/questions/tagged/http-auth) to ask questions using **[http-auth](http://stackoverflow.com/tags/http-auth/info)** tag.

## Requirements

 - **[Node.js](http://nodejs.org)** - Event-driven I/O server-side JavaScript environment based on V8.
 - **[npm](http://npmjs.org)** - Package manager. Installs, publishes and manages node programs.

## Utilities

 - **[htpasswd](https://github.com/http-auth/htpasswd/)** - Node.js package for HTTP Basic Authentication password file utility.
 - **[htdigest](https://github.com/http-auth/htdigest/)** - Node.js package for HTTP Digest Authentication password file utility.

## Integrations

 - **[http-auth-connect](https://github.com/http-auth/http-auth-connect)** - [Connect](https://github.com/senchalabs/connect) integration.
 - **[http-auth-passport](https://github.com/http-auth/http-auth-passport)** - [Passport.js](http://www.passportjs.org/) integration.
 - **[http-auth-koa](https://github.com/http-auth/http-auth-koa)** - [Koa framework](http://koajs.com/) integration.
 - **[http-auth-hapi](https://github.com/http-auth/http-auth-hapi)** - [Hapi framework](https://hapi.dev/) integration.

## Dependencies

 - **[uuid](https://github.com/broofa/node-uuid/)** - Generate RFC4122(v4) UUIDs, and also non-RFC compact ids.
 - **[apache-md5](https://github.com/http-auth/apache-md5)** - Node.js module for Apache style password encryption using md5.
 - **[apache-crypt](https://github.com/http-auth/apache-crypt)** - Node.js module for Apache style password encryption using crypt(3).
 - **[bcrypt.js](https://github.com/dcodeIO/bcrypt.js)** - Optimized bcrypt in plain JavaScript with zero dependencies.

## License

The MIT License (MIT)

Copyright (c) Gevorg Harutyunyan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
