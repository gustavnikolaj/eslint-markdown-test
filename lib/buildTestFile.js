var path = require('path');

var locateEslintConfig = require('./locateEslintConfig');
var findCodeBlocks = require('./findCodeBlocks');
var buildTestCase = require('./buildTestCase');
var unexpectedPath = require.resolve('unexpected');

/* eslint-disable */
/* istanbul ignore next: this function is used for inlining, but maintained as code. */
function lintText(text, cb) {
    var result;
    try {
        result = eslint.linter.verify(text, eslintConfig);
    } catch (err) {
        return cb(err);
    }
    return cb(null, result);
};
/* eslint-enable */

function buildTestFile(content, fileName) {
    fileName = path.relative(process.cwd(), fileName);
    var eslintConfigLocation = locateEslintConfig(fileName);
    var codeBlocks = findCodeBlocks(content);
    var codeLines = [];

    codeLines.push("var expect = require('" + unexpectedPath + "').clone();");
    codeLines.push("var eslintConfig = require('" + eslintConfigLocation + "')");
    codeLines.push("var eslint = require('eslint');");
    codeLines.push("if (Array.isArray(eslintConfig.plugins)) {");
    codeLines.push("    var engine = new eslint.CLIEngine(eslintConfig);");
    codeLines.push("    eslintConfig.plugins.forEach(function (plugin) {");
    codeLines.push("        engine.addPlugin(plugin, require('eslint-plugin-' + plugin));");
    codeLines.push("    });");
    codeLines.push("}");
    codeLines.push(lintText.toString());
    codeLines.push("describe('" + fileName + "', function () {");
    codeLines = codeLines.concat(codeBlocks.map(buildTestCase).reduce(function (list, item) {
        return list.concat(item);
    }, []));
    codeLines.push('});');

    return codeLines.join('\n');
}

buildTestFile.lintText = lintText;

module.exports = buildTestFile;
