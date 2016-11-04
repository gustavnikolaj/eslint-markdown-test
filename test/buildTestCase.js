var expect = require('unexpected');
var buildTestCase = require('../lib/buildTestCase');

describe('buildTestCase', function () {
    it('should export a function', function () {
        return expect(buildTestCase, 'to be a function');
    });
    it('should generate a simple test case', function () {
        var codeBlock = {
            type: 'js',
            body: 'var foo = "bar";\n',
            lineOffset: 1
        };
        var index = 0;
        return expect(buildTestCase(codeBlock, index), 'to equal', [
            "it('case 1', function () {",
            "return expect(function (cb) {",
            'lintText("var foo = \\"bar\\";\\n", cb)',
            "}, 'to call the callback without error').spread(function (messages) {",
            'messages=messages.map(function (msg) { return "Line " + (msg.line + 1) + ", column " + msg.column + ": " + msg.message; })',
            'return expect(messages, "to equal", [',
            "]);",
            "});",
            "});"
        ].join('\n'));
    });
    it('should number test cases based on the index', function () {
        var codeBlock = { type: 'js', body: 'var foo = "bar";\n', lineOffset: 1 };
        var index = 0;
        return expect(buildTestCase(codeBlock, index), 'to match', /it\('case 1'/);
    });
    it('should number test cases based on the index 2', function () {
        var codeBlock = { type: 'js', body: 'var foo = "bar";\n', lineOffset: 1 };
        var index = 1;
        return expect(buildTestCase(codeBlock, index), 'to match', /it\('case 2'/);
    });
    it('should build a test case with expected warnings', function () {
        var codeBlock = {
            type: 'js',
            body: 'var foo = "bar";\n',
            lineOffset: 1,
            output: {
                type: 'output',
                body: 'Line 2, column 11: Strings must use singlequote.'
            }
        };
        var index = 0;
        return expect(buildTestCase(codeBlock, index), 'to equal', [
            "it('case 1', function () {",
            "return expect(function (cb) {",
            'lintText("var foo = \\"bar\\";\\n", cb)',
            "}, 'to call the callback without error').spread(function (messages) {",
            'messages=messages.map(function (msg) { return "Line " + (msg.line + 1) + ", column " + msg.column + ": " + msg.message; })',
            'return expect(messages, "to equal", [',
            '"Line 2, column 11: Strings must use singlequote.",',
            "]);",
            "});",
            "});"
        ].join('\n'));
    });
});
