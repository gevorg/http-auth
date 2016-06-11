"use strict";

// Importing crypto module.
import crypto from 'crypto'

// Generates md5 hash of input.
export function md5(input) {
    let hash = crypto.createHash('MD5');
    hash.update(input);

    return hash.digest('hex');
}

// Generates sha1 hash of input.
export function sha1(input) {
    let hash = crypto.createHash('sha1');
    hash.update(input);

    return hash.digest('base64');
}

// Encode to base64 string.
export function base64(input) {
    return new Buffer(input, 'utf8').toString('base64');
}

// Decodes base64 string.
export function decodeBase64(input) {
    return new Buffer(input, 'base64').toString('utf8');
}

// Check if module is available.
export function isAvailable(path) {
    try {
        return !!require.resolve(path);
    } catch (err) {
        return false;
    }
}