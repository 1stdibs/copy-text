"use strict";
var copyTextApi = require('../copy-text');
var serverVars = require('server-vars');
describe('copyText', function () {
    var copyText;
    beforeEach(function () {
        copyText = copyTextApi();
        serverVars._api.jasmineFakeGet({
            test: {
                nextLevel: {
                    copy: {
                        someKeyInSvCopy: 'next level copy'
                    }
                },
                copy: {
                    someKeyInSvCopy: 'foo bar foo'
                }
            }
        });
    });
    it('should default to serverVars paths passed through addGlobalSVPath', function () {
        copyTextApi.addGlobalSVPath('test.copy');
        copyText = copyText.extend({'someKeyThatArrivedThroughExtend': 'bar foo baz'});
        expect(copyText.get('someKeyInSvCopy')).toEqual('foo bar foo');
        expect(copyText.get('someKeyThatArrivedThroughExtend')).toEqual('bar foo baz');
    });
    it('should prefer copy more recently added to the global object', function () {
        copyTextApi.addGlobalCopy({copyKey: 'copyAddedFirst'});
        copyText = copyTextApi();
        expect(copyText.get('copyKey')).toEqual('copyAddedFirst');
        copyTextApi.addGlobalCopy({copyKey: 'copyAddedSecond'});
        copyText = copyTextApi();
        expect(copyText.get('copyKey')).toEqual('copyAddedSecond');
    });
    it('should prefer copy on the instance over the global object', function () {
        copyTextApi.addGlobalCopy({copyKey: 'copyOnTheGlobalObject'});
        copyText = copyTextApi();
        expect(copyText.get('copyKey')).toEqual('copyOnTheGlobalObject');
        copyText = copyText.extend({copyKey: 'copyOnTheInstance'});
        expect(copyText.get('copyKey')).toEqual('copyOnTheInstance');
    });
    it('should render using a template object when options.obj is specified', function () {
        copyText = copyText.extend({fooBar: 'this <%= obj.thing %> is a template'});
        expect(copyText.get('fooBar', {obj: {thing: 'template'}})).toEqual('this template is a template');
    });
    it('should prefer the last path added by addGlobalSVPath', function () {
        copyTextApi.addGlobalSVPath('test.nextLevel');
        expect(copyText.get('copy.someKeyInSvCopy')).toEqual('next level copy');
        copyTextApi.addGlobalSVPath('test');
        expect(copyText.get('copy.someKeyInSvCopy')).toEqual('foo bar foo');
    });
    describe('extend', function () {
        it('should an extended copy of the original', function () {
            copyText = copyText.extend({foo: "hello"});
            expect(copyText.get('foo')).toEqual('hello');
            expect(copyText.get('bar')).toEqual('bar');
            copyText = copyText.extend({bar: "world"});
            expect(copyText.get('foo')).toEqual('hello');
            expect(copyText.get('bar')).toEqual('world');
        });
    });
});
