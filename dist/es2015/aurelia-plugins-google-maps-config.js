
export let Config = class Config {
  constructor() {
    this._config = {
      apiScriptLoadedEvent: 'aurelia-plugins:google-places-autocomplete:api-script-loaded',
      key: '',
      language: 'en',
      libraries: 'geometry',
      loadApiScript: true,
      options: {},
      region: 'US'
    };
  }

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
};