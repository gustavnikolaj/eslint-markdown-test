var expect = require('unexpected');
var register = require('../lib/register');
var proxyquire = require('proxyquire');

describe('register', function () {
    it('should export a function', function () {
        return expect(register, 'to be a function');
    });
    it('should register a handler for the .md file extension', function () {
        var requireMock = { extensions: {} };
        register(requireMock);
        return expect(requireMock, 'to satisfy', {
            extensions: {
                '.md': expect.it('to be a function')
            }
        });
    });
    it('should create module from the buildTestFile output', function () {
        var register = proxyquire('../lib/register', {
            'fs': {
                readFileSync: function () { return 'fsReadFileSyncResult'; }
            },
            './buildTestFile': function () { return 'buildTestFileResult'; }
        });
        var requireMock = { extensions: {} };
        var compileCalledWith = [];
        var moduleMock = {
            _compile: function (code, fileName) {
                compileCalledWith.push({
                    code: code,
                    fileName: fileName
                });
            }
        };

        register(requireMock);

        return expect(requireMock, 'to satisfy', {
            extensions: {
                '.md': expect.it('to be a function')
            }
        }).then(function () {
            requireMock.extensions['.md'](moduleMock, './someTest.md');

            return expect(compileCalledWith, 'to equal', [
                {
                    code: 'buildTestFileResult',
                    fileName: './someTest.md'
                }
            ]);
        });
    });
});
