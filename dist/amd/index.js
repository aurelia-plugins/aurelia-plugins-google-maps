define(['exports', './aurelia-plugins-google-maps'], function (exports, _aureliaPluginsGoogleMaps) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaPluginsGoogleMaps).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaPluginsGoogleMaps[key];
      }
    });
  });
});