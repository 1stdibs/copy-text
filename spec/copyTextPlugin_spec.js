'use strict';
var copyText = require('../copy-text');
var copyTextPlugin = require('../plugins/fluxible/copyTextPlugin');
describe('copyTextPlugin', function () {
    var plugs;
    beforeEach(function () {
        plugs = copyTextPlugin.plugContext();
    });
    it('should plug each type of context with same extending function', function () {
        ['plugComponentContext', 'plugActionContext', 'plugStoreContext']
            .forEach(function(ctx) {
                expect(typeof plugs[ctx]).toEqual('function');
            });
        expect(plugs.plugComponentContext === plugs.plugActionContext 
            && plugs.plugActionContext === plugs.plugStoreContext).toBe(true);
    });
    it('should be able to get globally set copy', function () {
        var context = {};
        copyText.addGlobalCopy({ copyKey: 'someCopy' });
        plugs.plugActionContext(context);
        expect(context.getCopy('copyKey')).toEqual('someCopy');
    });
    it('should be able to extend copy for a given context', function () {
        var actionContext = {};
        var componentContext = {};
        plugs.plugActionContext(actionContext);
        plugs.plugComponentContext(componentContext);
        actionContext.extendCopy({ copyKeyTwo: 'moreCopy' });
        expect(actionContext.getCopy('copyKeyTwo')).toEqual('moreCopy');
        expect(componentContext.getCopy('copyKeyTwo')).toEqual('copyKeyTwo');
    });
});
