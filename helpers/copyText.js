"use strict";
var serverVars = require('server-vars');
var _ = require('underscore');
var requ = require('reku');
var endpoints = require('bunsen/libraries/endpoints');
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
    get: function (copyKey, options) {
        var text;
        options = _.extend({
            passthrough: true
        }, options);
        text = this._copy[copyKey];
        if (undefined === text) {
            text = _.reduceRight(svCopyPaths, function (text, keyPrefix) {
                return text || serverVars.get(keyPrefix + '.' + copyKey);
            }, text) || options.passthrough && copyKey;
        }
        if (options.obj) {
            text = _.template(text)(options.obj);
        }
        return text;
    },
    object: function () {
        return this._copy;
    },
    extend: function (morecopy) {
        return new CopyText({copy: _.extend({}, this._copy, morecopy)});
    },
    load: function (file) {
        return requ({
            url: endpoints.staticRepo(file),
            dataType: 'json'
        }).then(this.extend.bind(this));
    }
};

module.exports = function () {
    return new CopyText();
};
module.exports.addGlobalSVPath = function (svCopyPath) {
    svCopyPaths.push(svCopyPath);
    return module.exports;
};
