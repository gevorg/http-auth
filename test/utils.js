"use strict";

// Expect module.
import {expect} from 'chai'

// Source.
import * as utils from '../src/auth/utils'

// Utils
describe('utils', function () {
    // Tests for md5.
    describe('#md5', function () {
        it('hash should be correct', function () {
            // Source.
            let hash = utils.md5("apple of my eye");

            // Expectation.
            expect(hash).to.equal("bda53a1c77224ede7cb14e756c1d0142");
        });
    });

    // Tests for sha1.
    describe('#sha1', function () {
        it('hash should be correct', function () {
            // Source.
            let hash = utils.sha1("forbidden fruit");

            // Expectation.
            expect(hash).to.equal("E1Kr19KXvaYQPcLo2MvSpGjoAYU=");
        });
    });

    // Tests for base64.
    describe('#base64', function () {
        it('ASCII input', function () {
            // Source.
            let hash = utils.base64("crocodile");

            // Expectation.
            expect(hash).to.equal("Y3JvY29kaWxl");
        });

        it('unicode input', function () {
            // Source.
            let hash = utils.base64("Գևորգ");

            // Expectation.
            expect(hash).to.equal("1LPWh9W41oDVow==");
        });
    });

    // Tests for decodeBase64.
    describe('#decodeBase64', function () {
        it('ASCII input', function () {
            // Source.
            let hash = utils.decodeBase64("c21pbGU=");

            // Expectation.
            expect(hash).to.equal("smile");
        });

        it('unicode input', function () {
            // Source.
            let hash = utils.decodeBase64("0J3RgyDRgtGLIQ==");

            // Expectation.
            expect(hash).to.equal("Ну ты!");
        });
    });

    // Tests for isAvailable.
    describe('#isAvailable', function () {
        it('existing module', function () {
            // Source.
            let isAvailable = utils.isAvailable('http-proxy');

            // Expectation.
            expect(isAvailable).to.be.true;
        });

        it('not existing module', function () {
            // Source.
            let isAvailable = utils.isAvailable('stupid name');

            // Expectation.
            expect(isAvailable).to.be.false;
        });
    });
});
