var path = require('path');
var expect = require('unexpected');
var locateEslintConfig = require('../lib/locateEslintConfig');

function fixturesPath(relativePath) {
    return path.resolve(__dirname, 'fixtures/locateEslintConfig', relativePath);
}

describe('locateEslintConfig', function () {
    it('should export a function', function () {
        return expect(locateEslintConfig, 'to be a function');
    });

    it('in the same folder', function () {
        var fixturePath = fixturesPath('sameFolder/test.md');
        var configPath = fixturesPath('sameFolder/index.js');
        return expect(locateEslintConfig(fixturePath), 'to satisfy', configPath);
    });

    it('in the parent folder', function () {
        var fixturePath = fixturesPath('parentFolder/docs/test.md');
        var configPath = fixturesPath('parentFolder/index.js');
        return expect(locateEslintConfig(fixturePath), 'to satisfy', configPath);
    });
});
