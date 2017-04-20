System.register(['./aurelia-plugins-google-maps-config'], function (_export, _context) {
  "use strict";

  var Config;
  function configure(aurelia, configCallback) {
    const instance = aurelia.container.get(Config);
    if (configCallback !== undefined && typeof configCallback === 'function') configCallback(instance);
    aurelia.globalResources('./aurelia-plugins-google-maps-element');
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaPluginsGoogleMapsConfig) {
      Config = _aureliaPluginsGoogleMapsConfig.Config;
    }],
    execute: function () {}
  };
});