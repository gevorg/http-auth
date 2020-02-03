"use strict";

// Expect module.
const expect = require("chai").expect;

// Request module.
const request = require("request");

// HTTP.
const http = require("http");

// Source.
const auth = require("../src/http-auth");

// Proxy library.
const httpProxy = require("http-proxy");

// Proxy.
describe("proxy", () => {
  let server = undefined;
  let proxyServer = undefined;

  before(() => {
    // Configure authentication.
    const basic = auth.basic(
      {
        proxy: true,
        realm: "Private Area."
      },
      (username, password, done) => {
        if (username === "gevorg") {
          done(new Error("Error comes here"));
        } else if (username === "mia" && password === "supergirl") {
          done(true);
        } else if (
          username === "ColonUser" &&
          password === "apasswordwith:acolon"
        ) {
          done(true);
        } else {
          done(false);
        }
      }
    );

    // Add error listener.
    basic.on("error", () => {
      console.log("Error thrown!");
    });

    // Setup proxy.
    const proxy = httpProxy.createProxyServer({});
    proxyServer = http
      .createServer(
        basic.check((req, res) => {
          proxy.web(req, res, { target: "http://127.0.0.1:1338" });
        })
      )
      .listen(1337);

    // Create your target server.
    server = http
      .createServer((req, res) => {
        res.end("Request successfully proxied!");
      })
      .listen(1338, () => {
        // Log URL.
        console.log("Server running at http://127.0.0.1:1338/");
      });
  });

  after(() => {
    proxyServer.close();
    server.close();
  });

  it("error", done => {
    const callback = (error, response, body) => {
      expect(body).to.equal("Error comes here");
      done();
    };

    // Test request.
    request.get(
      {
        proxy: "http://gevorg:gpass@127.0.0.1:1337",
        uri: "http://127.0.0.1:1337"
      },
      callback
    );
  });

  it("success", done => {
    const callback = (error, response, body) => {
      expect(body).to.equal("Request successfully proxied!");
      done();
    };

    // Test request.
    request.get(
      {
        proxy: "http://mia:supergirl@127.0.0.1:1337",
        uri: "http://127.0.0.1:1337"
      },
      callback
    );
  });

  it("wrong password", done => {
    const callback = (error, response, body) => {
      expect(body).to.equal("407 Proxy authentication required");
      done();
    };

    // Test request.
    request.get(
      { proxy: "http://mia:cute@127.0.0.1:1337", uri: "http://127.0.0.1:1337" },
      callback
    );
  });

  it("wrong user", done => {
    const callback = (error, response, body) => {
      expect(body).to.equal("407 Proxy authentication required");
      done();
    };

    // Test request.
    request.get(
      {
        proxy: "http://Tina:supergirl@127.0.0.1:1337",
        uri: "http://127.0.0.1:1337"
      },
      callback
    );
  });
});
