'use strict';
var provideContext = require('fluxible-addons-react/provideContext');
var copyContextTypes = require('./copyContextTypes');
var _ = require('underscore');
module.exports = function (Component, customContextTypes) {
    customContextTypes = customContextTypes || {};
    return provideContext(Component, _.extend(customContextTypes, copyContextTypes));
};
