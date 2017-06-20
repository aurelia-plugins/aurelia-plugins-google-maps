'use strict';

System.register(['aurelia-pal', './aurelia-plugins-google-maps-config'], function (_export, _context) {
  "use strict";

  var PLATFORM, Config;
  function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(Config);
    if (configCallback !== undefined && typeof configCallback === 'function') configCallback(instance);
    aurelia.globalResources(PLATFORM.moduleName('./aurelia-plugins-google-maps-element'));
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaPal) {
      PLATFORM = _aureliaPal.PLATFORM;
    }, function (_aureliaPluginsGoogleMapsConfig) {
      Config = _aureliaPluginsGoogleMapsConfig.Config;
    }],
    execute: function () {}
  };
});