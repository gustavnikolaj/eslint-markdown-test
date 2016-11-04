var fs = require('fs');
var path = require('path');
var findCodeBlocks = require('./findCodeBlocks');

function createTestCase(codeBlock, index) {
    var l = [];
    l.push("it('case " + (index + 1) +  "', function () {");

    l.push('return expect(function (cb) {');
    l.push('lintText("' + codeBlock.body.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '", cb)');
    l.push("}, 'to call the callback without error').spread(function (messages) {");

    l.push('messages=messages.map(function (msg) { return "Line " + (msg.line + ' + codeBlock.lineOffset + ') + ", column " + msg.column + ": " + msg.message; })');

    l.push('return expect(messages, "to equal", [');

    if (codeBlock.output) {
        codeBlock.output.body.split('\n').forEach(function (line) {
            l.push('"' + line.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '",');
        });
    }

    l.push(']);');
    l.push('});');
    l.push('});');
    return l;
}

function lintText(text, cb) {
    var eslint = require('eslint');
    var eslintConfig = require('../index.js');
    var result;
    try {
        result = eslint.linter.verify(text, eslintConfig);
    } catch (err) {
        return cb(err);
    }
    return cb(null, result);
}

function parse(content, fileName) {
    if (fileName) {
        fileName = path.relative(process.cwd(), fileName);
    } else {
        fileName = '<inline code>';
    }

    var codeBlocks = findCodeBlocks(content);

    var codeLines = [];

    codeLines.push("var expect = require('unexpected').clone();");
    codeLines.push(lintText.toString());
    codeLines.push("describe('" + fileName + "', function () {");
    codeLines = codeLines.concat(codeBlocks.map(createTestCase).reduce(function (list, item) {
        return list.concat(item);
    }, []));
    codeLines.push('});');

    return codeLines.join('\n');
}

module.exports = {
    parse: parse,
    register: function () {
        require.extensions['.md'] = function (module, fileName) {
            module._compile(parse(fs.readFileSync(fileName, 'utf-8'), fileName), fileName);
        };
    }
};
