"use strict";
var serverVars = require('server-vars');
var assign = require('lodash.assign');
var reduceRight = require('lodash.reduceright');
var template = require('lodash.template');
var GLOBALCOPYKEY = '__COPYTEXT_GLOBAL_COPY__';
var SVPATHSKEY = '__COPYTEXT_SV_COPY_PATHS__';
var globalCopy = global[GLOBALCOPYKEY] = global[GLOBALCOPYKEY] || {};
var svCopyPaths = global[SVPATHSKEY] = global[SVPATHSKEY] || [];
var CopyText = function (options) {
    options = assign({
        copy: {}
    }, options);
    this._copy = options.copy;
    return this;
};
CopyText.prototype = {
    get: function (copyKey, options) {
        var text;
        var templateVars;
        options = assign({
            passthrough: true
        }, options);
        text = this._copy[copyKey] || globalCopy[copyKey];
        if (undefined === text) {
            text = reduceRight(svCopyPaths, function (text, keyPrefix) {
                return text || serverVars.get(keyPrefix + '.' + copyKey);
            }, text) || options.passthrough && copyKey;
        }
        templateVars = assign({}, options.obj, {
            _copy: this.get.bind(this)
        });
        text = text ? template(text)(templateVars) : null;
        return text;
    },
    object: function () {
        return this._copy;
    },
    extend: function (morecopy) {
        return new CopyText({copy: assign({}, this._copy, morecopy)});
    }
};

module.exports = function () {
    return new CopyText();
};
module.exports.addGlobalSVPath = function (svCopyPath) {
    svCopyPaths.push(svCopyPath);
    return module.exports;
};
module.exports.addGlobalCopy = function (copyObj) {
    assign(globalCopy, copyObj);
    return module.exports;
};
