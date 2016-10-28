'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaPluginsGoogleMaps = require('./aurelia-plugins-google-maps');

Object.keys(_aureliaPluginsGoogleMaps).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaPluginsGoogleMaps[key];
    }
  });
});