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

const xmlOptionsParser = {
  ignoreAttributes: false,
  attributeNamePrefix : "attr_",
  allowBooleanAttributes: true,
  preserveOrder: true,
};
const xmlOptionsBuilder = {
  ignoreAttributes: false,
  attributeNamePrefix : "attr_",
  allowBooleanAttributes: true,
  preserveOrder: true,
  format: true,
};
const xmlParser = new XMLParser(xmlOptionsParser);
const xmlBuilder = new XMLBuilder(xmlOptionsBuilder);

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

        console.log("success read xml file");

        var username = generateUsername();
        var password = [...Array(12)].map(_ => PASSWORD_SET[~~(Math.random()*PASSWORD_SET.length)]).join('');
        // var identity = req.url.slice(1);
        // var phoneNumber = "+7" + [...Array(10)].map(_ => PHONE_SET[~~(Math.random()*PHONE_SET.length)]).join('');

        let jObj = xmlParser.parse(data);

        let sip = jObj[1].config[2].protocols[0].sip;

        sip[0].credentials[0].username[0]['#text'] = username;
        sip[0].credentials[1].password[0]['#text'] = password;

        sip[4][':@'].attr_uri = "lukiol.sip.server1.ru";
        sip[4][':@'].attr_port = 5060;

        sip[5][':@'].attr_address = "lukiol.sip.proxy.ru";
        sip[5][':@'].attr_port = 5060;

        respBody = xmlBuilder.build(jObj);
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.end(respBody);
      });
    })
  )
  .listen(1337, () => {
    // Log URL.
    console.log("Server running at http://127.0.0.1:1338/");
  });
