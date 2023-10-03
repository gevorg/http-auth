// HTTP module
const http = require("http");

// Authentication module.
const auth = require("../src/http-auth");
const digest = auth.digest({
  realm: "Simon Area.",
  file: __dirname + "/../data/users.htdigest" // vivi:anna, sona:testpass
});

// Generate provisioning content
const fs = require("fs")
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
const { generateUsername } = require("unique-username-generator");

const xmlParser = new XMLParser();
const xmlBuilder = new XMLBuilder({ format: true });

let PASSWORD_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
let PHONE_SET = '0123456789'
let PROVISIONING_PATH = "/Users/v.dozmorov/work/issue/3810/digest/server/http-auth/examples/provisioning_file.xml"

// Creating new HTTP server.
http
  .createServer(
    digest.check((req, res) => {
      fs.readFile(PROVISIONING_PATH, "utf-8", (err, data) => {
        if (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            data: err.message,
          }));
        }

        var identity = req.url.slice(1);
        var username = generateUsername();
        var password = [...Array(12)].map(_ => PASSWORD_SET[~~(Math.random()*PASSWORD_SET.length)]).join('');
        var phoneNumber = "+7" + [...Array(10)].map(_ => PHONE_SET[~~(Math.random()*PHONE_SET.length)]).join('');

        let jObj = xmlParser.parse(data);
        let sip = jObj.config.protocols.sip;

        sip.credentials.username = username;
        sip.credentials.password = password;
        sip.credentials['phone-number'] = phoneNumber;
        sip.credentials.auth.username = identity.slice(0, identity.indexOf('@'));
        sip.credentials.auth.password = password;
        sip.domain = 'lukiol.sip.server1.ru';
        sip['preferred-port'] = 5060;
        sip['proxy-discovery']['record-name'] = identity;
        sip['proxy-discovery']['domain-override'] = 'lukiol.sip.domain-override.ru';

        respBody = xmlBuilder.build(jObj);
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.end(respBody);
      });
    })
  )
  .listen(1337, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1337/");
  });
