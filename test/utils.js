"use strict";

// Expect module.
const expect = require("chai").expect;

// Source.
const utils = require("../src/auth/utils");

// Utils
describe("utils", () => {
  // Tests for md5.
  describe("#md5", () => {
    it("hash should be correct", () => {
      // Source.
      const hash = utils.md5("apple of my eye");

      // Expectation.
      expect(hash).to.equal("bda53a1c77224ede7cb14e756c1d0142");
    });
  });

  // Tests for sha1.
  describe("#sha1", () => {
    it("hash should be correct", () => {
      // Source.
      const hash = utils.sha1("forbidden fruit");

      // Expectation.
      expect(hash).to.equal("E1Kr19KXvaYQPcLo2MvSpGjoAYU=");
    });
  });

  // Tests for sha256.
  describe("#sha256", () => {
    it("hash should be correct", () => {
      // Source.
      const hash = utils.sha256("Something else");

      // Expectation.
      expect(hash).to.equal("zHKEMUSEGm+BELfr56F2gQHgPEyMFShly3IH6OS/h0U=");
    });
  });

  // Tests for sha512.
  describe("#sha512", () => {
    it("hash should be correct", () => {
      // Source.
      const hash = utils.sha512("Something else");

      // Expectation.
      // eslint-disable-next-line prettier/prettier
      expect(hash).to.equal("qm/eL5Y8FlRbld87lvKhCqob0shq8q6xzqbMfEs1rb3eaCpSB8lr9kCxrBseD0RUTd4ii3oJXCZcx/R/PTD4Eg==");
    });
  });

  // Tests for base64.
  describe("#base64", () => {
    it("ASCII input", () => {
      // Source.
      const hash = utils.base64("crocodile");

      // Expectation.
      expect(hash).to.equal("Y3JvY29kaWxl");
    });

    it("unicode input", () => {
      // Source.
      const hash = utils.base64("Գևորգ");

      // Expectation.
      expect(hash).to.equal("1LPWh9W41oDVow==");
    });
  });

  // Tests for decodeBase64.
  describe("#decodeBase64", () => {
    it("ASCII input", () => {
      // Source.
      const hash = utils.decodeBase64("c21pbGU=");

      // Expectation.
      expect(hash).to.equal("smile");
    });

    it("unicode input", () => {
      // Source.
      const hash = utils.decodeBase64("0J3RgyDRgtGLIQ==");

      // Expectation.
      expect(hash).to.equal("Ну ты!");
    });
  });
});
