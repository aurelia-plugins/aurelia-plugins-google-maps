var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { BindingEngine } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TaskQueue } from 'aurelia-task-queue';
import { bindable, customElement, noView } from 'aurelia-templating';

import { Config } from './aurelia-plugins-google-maps-config';

export let GoogleMaps = (_dec = customElement('aup-google-maps'), _dec2 = noView(), _dec3 = inject(Element, BindingEngine, Config, EventAggregator, TaskQueue), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class GoogleMaps {
  constructor(element, bindingEngine, config, eventAggregator, taskQueue) {
    this._map = null;
    this._mapPromise = null;
    this._mapResolve = null;
    this._markers = [];
    this._previousInfoWindow = null;
    this._scriptPromise = null;
    this._subscription = null;

    _initDefineProp(this, 'address', _descriptor, this);

    _initDefineProp(this, 'autoCloseInfoWindows', _descriptor2, this);

    _initDefineProp(this, 'latitude', _descriptor3, this);

    _initDefineProp(this, 'longitude', _descriptor4, this);

    _initDefineProp(this, 'mapTypeId', _descriptor5, this);

    _initDefineProp(this, 'markers', _descriptor6, this);

    _initDefineProp(this, 'options', _descriptor7, this);

    _initDefineProp(this, 'zoom', _descriptor8, this);

    this._bindingEngine = bindingEngine;
    this._config = config;
    this._element = element;
    this._eventAggregator = eventAggregator;
    this._taskQueue = taskQueue;
    if (!this._config.get('key')) return console.error('No Google API key has been specified.');
    this._mapPromise = new Promise(resolve => {
      this._mapResolve = resolve;
    });
    this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-highlight', data => {
      this._markerHighlight(this._markers[data.index]);
    });
    this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-pan', data => {
      this._markerPan(this._markers[data.index]);
    });
    this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-unhighlight', data => {
      this._markerUnhighlight(this._markers[data.index]);
    });
    if (this._config.get('loadApiScript')) {
      this._loadApiScript();this._initialize();return;
    }
    this._eventAggregator.subscribe(this._config.get('apiScriptLoadedEvent'), scriptPromise => {
      this._scriptPromise = scriptPromise;this._initialize();
    });
  }

  addressChanged(newValue) {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this._mapPromise;
      if (!newValue) return;
      _this._taskQueue.queueMicroTask(function () {
        _this._setAddress(newValue);
      });
    })();
  }

  latitudeChanged(newValue) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2._mapPromise;
      if (!newValue) return;
      _this2._taskQueue.queueMicroTask(function () {
        _this2._setCenter(newValue, null);
      });
    })();
  }

  longitudeChanged(newValue) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield _this3._mapPromise;
      if (!newValue) return;
      _this3._taskQueue.queueMicroTask(function () {
        _this3._setCenter(null, newValue);
      });
    })();
  }

  mapTypeIdChanged(newValue) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      yield _this4._mapPromise;
      if (!newValue) return;
      _this4._taskQueue.queueMicroTask(function () {
        _this4._setMapTypeId(newValue);
      });
    })();
  }

  markersChanged(newValue) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      yield _this5._mapPromise;
      if (!newValue || !newValue.length) return;
      if (_this5._subscription) {
        _this5._subscription.dispose();
        _this5._markers.forEach(function (marker) {
          marker.setMap(null);
        });
        _this5._markers = [];
      }
      _this5._subscription = _this5._bindingEngine.collectionObserver(_this5.markers).subscribe(function (splices) {
        _this5._spliceMarkers(splices);
      });
      newValue.forEach(function (marker) {
        _this5._createMarker(marker);
      });
      _this5._eventAggregator.publish('aurelia-plugins:google-maps:markers-changed');
    })();
  }

  zoomChanged(newValue) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      yield _this6._mapPromise;
      if (!newValue) return;
      _this6._taskQueue.queueMicroTask(function () {
        _this6._setZoom(newValue);
      });
    })();
  }

  _setAddress(address) {
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address || this.address }, (results, status) => {
      if (status !== window.google.maps.GeocoderStatus.OK) return;
      this._setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    });
  }

  _getCenter(latitude, longitude) {
    return new window.google.maps.LatLng(parseFloat(latitude || this.latitude), parseFloat(longitude || this.longitude));
  }

  _setCenter(latitude, longitude) {
    this._map.setCenter(this._getCenter(latitude, longitude));
    this._publishBoundsChangedEvent();
  }

  _getMapTypeId(mapTypeId) {
    switch ((mapTypeId || this.mapTypeId).toUpperCase()) {
      case 'HYBRID':
        return window.google.maps.MapTypeId.HYBRID;
      case 'SATELLITE':
        return window.google.maps.MapTypeId.SATELLITE;
      case 'TERRAIN':
        return window.google.maps.MapTypeId.TERRAIN;
      default:
        return window.google.maps.MapTypeId.ROADMAP;
    }
  }

  _setMapTypeId(mapTypeId) {
    this._map.setMapTypeId(this._getMapTypeId(mapTypeId));
  }

  _getZoom(zoom) {
    return parseInt(zoom || this.zoom, 10);
  }

  _setZoom(zoom) {
    this._map.setZoom(this._getZoom(zoom));
  }

  _createMarker(marker) {
    var _marker = new window.google.maps.Marker({
      animation: marker.animation,
      icon: marker.icon,
      label: marker.label,
      map: this._map,
      position: new window.google.maps.LatLng(parseFloat(marker.latitude), parseFloat(marker.longitude)),
      title: marker.title
    });
    if (marker.custom) _marker.custom = marker.custom;
    if (marker.infoWindow) {
      _marker.infoWindow = new window.google.maps.InfoWindow({ content: marker.infoWindow.content, pixelOffset: marker.infoWindow.pixelOffset, position: marker.infoWindow.position, maxWidth: marker.infoWindow.maxWidth });
      _marker.infoWindow.addListener('domready', () => {
        this._infoWindowDomReady(_marker.infoWindow);
      });
    }
    _marker.addListener('click', () => {
      this._markerClick(_marker);
    });
    _marker.addListener('dblclick', () => {
      this._markerPan(_marker);
    });
    _marker.addListener('mouseout', () => {
      this._markerMouseOut(_marker);
    });
    _marker.addListener('mouseover', () => {
      this._markerMouseOver(_marker);
    });
    this._markers.push(_marker);
  }

  _initialize() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      yield _this7._scriptPromise;
      var options = Object.assign(_this7.options || _this7._config.get('options'), { center: _this7._getCenter(), mapTypeId: _this7._getMapTypeId(), zoom: _this7._getZoom() });
      _this7._map = new window.google.maps.Map(_this7._element, options);
      _this7._eventAggregator.publish('aurelia-plugins:google-maps:map-created', _this7._map);
      _this7._mapResolve();
      _this7._map.addListener('click', function (event) {
        _this7._mapClick(event);
      });
      _this7._map.addListener('dragend', function () {
        _this7._publishBoundsChangedEvent();
      });
      _this7._map.addListener('zoom_changed', function () {
        _this7._publishBoundsChangedEvent();
      });
    })();
  }

  _infoWindowDomReady(infoWindow) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:infowindow-domready', infoWindow);
  }

  _loadApiScript() {
    if (this._scriptPromise) return;
    if (window.google === undefined || window.google.maps === undefined) {
      var script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?callback=aureliaPluginsGoogleMapsCallback&key=${ this._config.get('key') }&language=${ this._config.get('language') }&libraries=${ this._config.get('libraries') }`;
      script.type = 'text/javascript';
      document.body.appendChild(script);
      this._scriptPromise = new Promise((resolve, reject) => {
        window.aureliaPluginsGoogleMapsCallback = () => {
          this._eventAggregator.publish('aurelia-plugins:google-maps:api-script-loaded', this._scriptPromise);
          resolve();
        };
        script.onerror = error => {
          reject(error);
        };
      });
    } else if (window.google && window.google.maps) this._scriptPromise = new Promise(resolve => {
      resolve();
    });
  }

  _mapClick(event) {
    if (this._element.attributes['map-click.delegate']) {
      var clickEvent;
      if (window.CustomEvent) clickEvent = new CustomEvent('map-click', { bubbles: true, detail: event });else {
        clickEvent = document.createEvent('CustomEvent');
        clickEvent.initCustomEvent('map-click', true, true, { data: event });
      }
      this._element.dispatchEvent(clickEvent);
      this._eventAggregator.publish('aurelia-plugins:google-maps:map-click', event);
    } else if (this.autoCloseInfoWindows && this._previousInfoWindow) {
      this._previousInfoWindow.close();
      this._previousInfoWindow = null;
    }
  }

  _markerClick(marker) {
    if (!marker.infoWindow) this._eventAggregator.publish('aurelia-plugins:google-maps:marker-click', marker);else if (this.autoCloseInfoWindows) {
      if (this._previousInfoWindow) this._previousInfoWindow.close();
      this._previousInfoWindow = this._previousInfoWindow !== marker.infoWindow ? marker.infoWindow : null;
      if (this._previousInfoWindow) this._previousInfoWindow.open(this._map, marker);
    } else marker.infoWindow.open(this._map, marker);
  }

  _markerHighlight(marker) {
    marker.setIcon(marker.custom.highlightIcon);
    marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
  }

  _markerMouseOut(marker) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseout', marker);
  }

  _markerMouseOver(marker) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseover', marker);
    marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
  }

  _markerPan(marker) {
    this._map.setZoom(17);
    this._map.panTo(marker.position);
  }

  _markerUnhighlight(marker) {
    marker.setIcon(marker.custom.defaultIcon);
  }

  _publishBoundsChangedEvent() {
    var bounds = this._map.getBounds();
    if (bounds) this._eventAggregator.publish('aurelia-plugins:google-maps:map-bounds-changed', bounds);
  }

  _spliceMarkers(markers) {
    if (!markers.length) return;
    markers.forEach(marker => {
      if (marker.addedCount) this._createMarker(this.markers[marker.index]);
      if (marker.removed.length) return;
      marker.removed.forEach(removed => {
        for (var i = 0, j = this._markers.length; i < j; i++) {
          var rendered = this._markers[i];
          if (rendered.position.lat().toFixed(12) !== removed.latitude.toFixed(12) || rendered.position.lng().toFixed(12) !== removed.longitude.toFixed(12)) continue;
          rendered.setMap(null);
          this._markers.splice(i, 1);
          break;
        }
      });
    });
  }
}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'address', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'autoCloseInfoWindows', [bindable], {
  enumerable: true,
  initializer: function () {
    return false;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'latitude', [bindable], {
  enumerable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'longitude', [bindable], {
  enumerable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mapTypeId', [bindable], {
  enumerable: true,
  initializer: function () {
    return 'ROADMAP';
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'markers', [bindable], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'options', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'zoom', [bindable], {
  enumerable: true,
  initializer: function () {
    return 8;
  }
})), _class2)) || _class) || _class) || _class);