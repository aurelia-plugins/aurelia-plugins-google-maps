

export var Config = function () {
  function Config() {
    

    this._config = {
      apiScriptLoadedEvent: 'aurelia-plugins:google-places-autocomplete:api-script-loaded',
      key: '',
      language: 'en',
      libraries: 'geometry',
      loadApiScript: true,
      options: {}
    };
  }

  Config.prototype.get = function get(key) {
    return this._config[key];
  };

  Config.prototype.options = function options(obj) {
    Object.assign(this._config, obj);
  };

  Config.prototype.set = function set(key, value) {
    this._config[key] = value;
    return this._config[key];
  };

  return Config;
}();