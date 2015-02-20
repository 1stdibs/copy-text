"use strict";
var serverVars = require('bunsen/helpers/serverVars');
var _ = require('underscore');
// TODO: use a paths-approach to make it easier to search non-existant objects safely
var svCopyPaths = [];
var CopyText = function (options) {
    options = _.extend({
        copy: {}
    }, options);
    this._copy = options.copy;
    return this;
};
CopyText.prototype = {
    get: function (copyKey) {
        var text = this._copy[copyKey];
        if (text) {
            return text;
        }
        return _.reduce(svCopyPaths, function (text, keyPrefix) {
            return text || serverVars.get(keyPrefix + '.' + copyKey);
        }, text);
    },
    object: function () {
        return this._copy;
    },
    extend: function (morecopy) {
        return new CopyText({copy: _.extend({}, this._copy, morecopy)});
    }
};

module.exports = function () {
    return new CopyText();
};
module.exports.addGlobalSVPath = function (svCopyPath) {
    svCopyPaths.push(svCopyPath);
    return module.exports;
};
