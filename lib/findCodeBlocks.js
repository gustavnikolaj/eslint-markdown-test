var codeBlockContentRegExp = /```(js|javascript|output):?(no-eol)?\n([\s\S]+?)\n```/gm;

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
            if (!match[2]) {
                result.body += '\n';
            }
            blocks.push(result);
        }
    }
    return blocks;
};
