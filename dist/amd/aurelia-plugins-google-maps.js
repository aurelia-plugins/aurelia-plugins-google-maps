define(['exports', './aurelia-plugins-google-maps-config'], function (exports, _aureliaPluginsGoogleMapsConfig) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;
  function configure(aurelia, configCallback) {
    const instance = aurelia.container.get(_aureliaPluginsGoogleMapsConfig.Config);
    if (configCallback !== undefined && typeof configCallback === 'function') configCallback(instance);
    aurelia.globalResources('./aurelia-plugins-google-maps-element');
  }
});