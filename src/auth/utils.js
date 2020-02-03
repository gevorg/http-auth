"use strict";

// Importing crypto module.
const crypto = require("crypto");
const utils = {};

// Generates md5 hash of input.
utils.md5 = input => {
  let hash = crypto.createHash("MD5");
  hash.update(input);

  return hash.digest("hex");
};

// Generates sha1 hash of input.
utils.sha1 = input => {
  let hash = crypto.createHash("sha1");
  hash.update(input);

  return hash.digest("base64");
};

// Encode to base64 string.
utils.base64 = input => {
  return Buffer.from(input, "utf8").toString("base64");
};

// Decodes base64 string.
utils.decodeBase64 = input => {
  return Buffer.from(input, "base64").toString("utf8");
};

// Export utils.
module.exports = utils;
