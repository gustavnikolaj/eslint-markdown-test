module.exports = function buildTestCase(codeBlock, index) {
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
    return l.join('\n');
};
