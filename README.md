# http-auth
[Node.js](http://nodejs.org/) package for HTTP basic and digest access authentication.

[![build](https://github.com/gevorg/http-auth/workflows/build/badge.svg)](https://github.com/gevorg/http-auth/actions/workflows/build.yml)

## Installation

Via git (or downloaded tarball):

```bash
$ git clone git://github.com/gevorg/http-auth.git
```
Via [npm](http://npmjs.org/):

```bash
$ npm install http-auth
```    

## Usage

```javascript
// HTTP module
const http = require("http");

// Authentication module.
const auth = require("http-auth");
const basic = auth.basic({
  realm: "Simon Area.",
  file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// Creating new HTTP server.
http
  .createServer(
    basic.check((req, res) => {
      res.end(`Welcome to private area - ${req.user}!`);
    })
  )
  .listen(1337, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
  });
```

Please check [examples directory](./examples) for more.

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

## Questions

You can also use [stackoverflow](http://stackoverflow.com/questions/tagged/http-auth) to ask questions using **[http-auth](http://stackoverflow.com/tags/http-auth/info)** tag.

## Utilities

 - **[htpasswd](https://github.com/gevorg/htpasswd/)** - Node.js package for HTTP Basic Authentication password file utility.
 - **[htdigest](https://github.com/gevorg/htdigest/)** - Node.js package for HTTP Digest Authentication password file utility.

## Integrations

Please check [this link](https://github.com/http-auth) for integration packages.

## License

The MIT License (MIT)