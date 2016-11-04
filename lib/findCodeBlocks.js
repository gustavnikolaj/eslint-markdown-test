var codeBlockContentRegExp = /```(js|javascript|output):?(no-eol|no-react)?\n([\s\S]+?)\n```/gm;

module.exports = function findCodeBlocks(fileContent) {
    var match;
    var blocks = [];
    while ((match = codeBlockContentRegExp.exec(fileContent)) !== null) {
        var lineOffset = (fileContent.substr(0, match.index).match(/\n/g) || []).length;
        var result = {
            type: match[1],
            body: match[3],
            lineOffset: lineOffset + 1
        };

        if (result.type === 'output') {
            blocks[blocks.length - 1].output = result;
        } else {
            if (!match[2] || match[2] !== 'no-eol') {
                result.body += '\n';
            }
            if (process.env.REACT && (!match[2] || match[2] !== 'no-react')) {
                result.body = "var React = require('react');\n" + result.body;
                result.lineOffset = result.lineOffset - 1;
            }

            blocks.push(result);
        }
    }
    return blocks;
};
