'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;

var _aureliaPal = require('aurelia-pal');

var _aureliaPluginsGoogleMapsConfig = require('./aurelia-plugins-google-maps-config');

function configure(aurelia, configCallback) {
  var instance = aurelia.container.get(_aureliaPluginsGoogleMapsConfig.Config);
  if (configCallback !== undefined && typeof configCallback === 'function') configCallback(instance);
  aurelia.globalResources(_aureliaPal.PLATFORM.moduleName('./aurelia-plugins-google-maps-element'));
}