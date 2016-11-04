var expect = require('unexpected');
var buildTestFile = require('../lib/buildTestFile');

describe('buildTestFile', function () {
    it('should export a function', function () {
        return expect(buildTestFile, 'to be a function');
    });
});
