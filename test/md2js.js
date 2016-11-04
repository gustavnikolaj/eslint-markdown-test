var expect = require('unexpected');
var md2js = require('../lib/md2js');
var fs = require('fs');
var path = require('path');

function loadFixture(name) {
    name = name + '.md';
    var fixturePath = path.resolve(__dirname, 'fixtures/codeBlocks', name);
    return fs.readFileSync(fixturePath, 'utf-8');
}

describe('md2js', function () {
    it('should export a register function', function () {
        return expect(md2js, 'to satisfy', {
            register: expect.it('to be a function')
        });
    });
    it('should export a parse function', function () {
        return expect(md2js, 'to satisfy', {
            parse: expect.it('to be a function')
        });
    });
    it('should export a findCodeBlocks function', function () {
        return expect(md2js, 'to satisfy', {
            findCodeBlocks: expect.it('to be a function')
        });
    });
    describe('findCodeBlocks', function () {
        var expect = require('unexpected')
            .clone()
            .addAssertion('to yield code blocks', function (expect, subject, value) {
                return expect(
                    md2js.findCodeBlocks(loadFixture(subject)),
                    'to satisfy',
                    value
                );
            });
        it('should be able to find a normal codeblock', function () {
            return expect('simple', 'to yield code blocks', [ { type: 'js' } ]);
        });
        it('should be able to find multiple blocks', function () {
            return expect('two-simple', 'to yield code blocks', [
                { type: 'js' },
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
        it.skip('should be able to find a codeblock with a template string', function () {
            // TODO: Fix parsing of examples with template strings
            return expect('template-string', 'to yield code blocks', [
                {
                    type: 'js',
                    body: 'var foo = `bar`;'
                }
            ]);
        });
    });
});
