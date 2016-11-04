var expect = require('unexpected');
var proxyquire = require('proxyquire');
var buildTestFile = require('../lib/buildTestFile');

describe('buildTestFile', function () {
    it('should export a function', function () {
        return expect(buildTestFile, 'to be a function');
    });
    it('should generate a simple test file', function () {
        var buildTestFile = proxyquire('../lib/buildTestFile', {
            './locateEslintConfig': function () {
                return './path/to/eslintConfig';
            },
            './findCodeBlocks': function () { return [ 'foo' ]; },
            './buildTestCase': function (x) { return '{testCaseFor: ' + x + '}'; }
        });

        return expect(buildTestFile('foo', 'simple.md'), 'to equal', [
            "var expect = require('" + require.resolve('unexpected') + "').clone();",
            "var eslintConfig = require('./path/to/eslintConfig')",
            buildTestFile.lintText.toString(),
            "describe('simple.md', function () {",
            '{testCaseFor: foo}',
            "});"
        ].join('\n'));
    });
});
