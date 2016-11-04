var expect = require('unexpected');
var register = require('../lib/register');

describe('register', function () {
    it('should export a function', function () {
        return expect(register, 'to be a function');
    });
});
