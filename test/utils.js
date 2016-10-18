"use strict";

// Expect module.
const expect = require('chai').expect;

// Source.
const utils = require('../src/auth/utils');

// Utils
describe('utils', () => {
    // Tests for md5.
    describe('#md5', () => {
        it('hash should be correct', () => {
            // Source.
            const hash = utils.md5("apple of my eye");

            // Expectation.
            expect(hash).to.equal("bda53a1c77224ede7cb14e756c1d0142");
        });
    });

    // Tests for sha1.
    describe('#sha1', () => {
        it('hash should be correct', () => {
            // Source.
            const hash = utils.sha1("forbidden fruit");

            // Expectation.
            expect(hash).to.equal("E1Kr19KXvaYQPcLo2MvSpGjoAYU=");
        });
    });

    // Tests for base64.
    describe('#base64', () => {
        it('ASCII input', () => {
            // Source.
            const hash = utils.base64("crocodile");

            // Expectation.
            expect(hash).to.equal("Y3JvY29kaWxl");
        });

        it('unicode input', () => {
            // Source.
            const hash = utils.base64("Գևորգ");

            // Expectation.
            expect(hash).to.equal("1LPWh9W41oDVow==");
        });
    });

    // Tests for decodeBase64.
    describe('#decodeBase64', () => {
        it('ASCII input', () => {
            // Source.
            const hash = utils.decodeBase64("c21pbGU=");

            // Expectation.
            expect(hash).to.equal("smile");
        });

        it('unicode input', () => {
            // Source.
            const hash = utils.decodeBase64("0J3RgyDRgtGLIQ==");

            // Expectation.
            expect(hash).to.equal("Ну ты!");
        });
    });

    // Tests for isAvailable.
    describe('#isAvailable', () => {
        it('existing module', () => {
            // Source.
            const isAvailable = utils.isAvailable('http-proxy');

            // Expectation.
            expect(isAvailable).to.be.true;
        });

        it('not existing module', () => {
            // Source.
            const isAvailable = utils.isAvailable('stupid name');

            // Expectation.
            expect(isAvailable).to.be.false;
        });
    });
});
