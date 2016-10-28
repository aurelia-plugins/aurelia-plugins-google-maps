// PUBLIC CLASS
export class Config {
  // PRIVATE PROPERTIES
  _config;

  // CONSTRUCTOR
  constructor() {
    this._config = {
      apiScriptLoadedEvent: 'aurelia-plugins:google-places-autocomplete:api-script-loaded',
      key: '',
      language: 'en',
      libraries: 'geometry',
      loadApiScript: true,
      options: {}
    };
  }

  // PUBLIC METHODS
  get(key) {
    return this._config[key];
  }

  options(obj) {
    Object.assign(this._config, obj);
  }

  set(key, value) {
    this._config[key] = value;
    return this._config[key];
  }
}
