var findCodeBlocks = require('../lib/findCodeBlocks');
var fs = require('fs');
var path = require('path');

function loadFixture(name) {
    name = name + '.md';
    var fixturePath = path.resolve(__dirname, 'fixtures/codeBlocks', name);
    return fs.readFileSync(fixturePath, 'utf-8');
}

var expect = require('unexpected')
    .clone()
    .addAssertion('to yield code blocks', function (expect, subject, value) {
        return expect(findCodeBlocks(loadFixture(subject)), 'to satisfy', value);
    });

describe('findCodeBlocks', function () {
    it('should be able to find a normal codeblock', function () {
        return expect('simple', 'to yield code blocks', [ { type: 'js' } ]);
    });
    it('should be able to find multiple blocks', function () {
        return expect('two-simple', 'to yield code blocks', [
            { type: 'js' },
            { type: 'js' }
        ]);
    });
    it('should be able to find a single block with multiple lines', function () {
        return expect('multiple-lines', 'to yield code blocks', [
            { type: 'js' }
        ]);
    });
    it('should be able to find a block with an offset', function () {
        return expect('offsetting-description', 'to yield code blocks', [
            { type: 'js', lineOffset: 3 }
        ]);
    });
    it('should be able to find a failing example', function () {
        return expect('with-failure', 'to yield code blocks', [
            {
                type: 'js',
                body: 'throw new Error(\'foobar\');\n',
                output: {
                    type: 'output',
                    body: 'threw \'foobar\'!'
                }
            }
        ]);
    });
    it('should be able to find multiple code examples in the same file', function () {
        return expect('multiple-mixed', 'to yield code blocks', [
            { type: 'js' },
            { type: 'js' },
            { type: 'js', output: { type: 'output' } },
            { type: 'js' }
        ]);
    });
    it('should be able to find a codeblock with a template string', function () {
        return expect('template-string', 'to yield code blocks', [
            {
                type: 'js',
                body: 'var foo = `bar`;\n'
            }
        ]);
    });
});
