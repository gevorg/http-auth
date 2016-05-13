// Reporter.
var reporter = require('nodeunit').reporters.default;

// FS.
var fs = require('fs');

// Old version without generator functions.
var isOldNode = process.version.indexOf("v0.") == 0;

// Read all test file names.
fs.readdir(__dirname, function (err, names) {
    // Tests to run.
    var tests = [];
    const newTests = ['test-koa.coffee'];

    // Filter.
    names.forEach(function (name) {
        if (newTests.indexOf(name) == -1 || !isOldNode) {
            tests.push(__dirname + '/' + name);
        }
    });

    // Run.
    reporter.run(tests);
});