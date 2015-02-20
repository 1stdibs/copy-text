"use strict";
var copyTextApi = require('bunsen/helpers/copyText');
var serverVars = require('bunsen/helpers/serverVars');
describe('copyText', function () {
    var copyText;
    beforeEach(function () {
        copyText = copyTextApi();
        spyOn(serverVars, 'get').and.callFake(function (path) {
            if ("test.copy.someKeyInSvCopy" === path) {
                return 'foo bar foo';
            }
            return undefined;
        });
    });
    it('should default to serverVars paths passed through addGlobalSVPath', function () {
        copyTextApi.addGlobalSVPath('test.copy');
        copyText = copyText.extend({'someKeyThatArrivedThroughExtend': 'bar foo baz'});
        expect(copyText.get('someKeyInSvCopy')).toEqual('foo bar foo');
        expect(copyText.get('someKeyThatArrivedThroughExtend')).toEqual('bar foo baz');
    });
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
