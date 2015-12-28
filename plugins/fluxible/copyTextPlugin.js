'use strict';

var copyText = require('../../copy-text');

module.exports = {
    name: 'CopyTextPlugin',
    plugContext: function () {
        var copy = copyText();
        function plug(context) {
            var ownCopy = copy;
            context.getCopy = function (key) { return ownCopy.get(key); };
            context.extendCopy = function (morecopy) { ownCopy = copy.extend(morecopy); };
        };
        return {
            plugComponentContext: plug,
            plugActionContext: plug,
            plugStoreContext: plug
        };
    }
};
