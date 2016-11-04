var fs = require('fs');
var buildTestFile = require('./buildTestFile');

module.exports = function register(require) {
    require.extensions['.md'] = function (module, fileName) {
        module._compile(buildTestFile(fs.readFileSync(fileName, 'utf-8'), fileName), fileName);
    };
};
