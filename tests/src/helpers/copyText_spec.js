"use strict";
var copyText = require('bunsen/helpers/copyText');
describe('copyText', function () {
    describe('extend', function () {
        it('should an extended copy of the original', function () {
            copyText = copyText.extend({foo: "hello"});
            expect(copyText.get('foo')).toEqual('hello');
            expect(copyText.get('bar')).not.toBeTruthy();
            copyText = copyText.extend({bar: "world"});
            expect(copyText.get('foo')).toEqual('hello');
            expect(copyText.get('bar')).toEqual('world');
        });
    });
});
