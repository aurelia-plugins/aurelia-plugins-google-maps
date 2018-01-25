define(['exports', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-event-aggregator', 'aurelia-task-queue', 'aurelia-templating', './aurelia-plugins-google-maps-config'], function (exports, _aureliaBinding, _aureliaDependencyInjection, _aureliaEventAggregator, _aureliaTaskQueue, _aureliaTemplating, _aureliaPluginsGoogleMapsConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GoogleMaps = undefined;

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
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

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

  var GoogleMaps = exports.GoogleMaps = (_dec = (0, _aureliaTemplating.customElement)('aup-google-maps'), _dec2 = (0, _aureliaTemplating.noView)(), _dec3 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaBinding.BindingEngine, _aureliaPluginsGoogleMapsConfig.Config, _aureliaEventAggregator.EventAggregator, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function () {
    function GoogleMaps(element, bindingEngine, config, eventAggregator, taskQueue) {
      var _this = this;

      _classCallCheck(this, GoogleMaps);

      this._init = { address: false, latitude: false, longitude: false };
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
      this._mapPromise = new Promise(function (resolve) {
        _this._mapResolve = resolve;
      });
      this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-highlight', function (id) {
        return _this._markerHighlight(id);
      });
      this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-icon', function (data) {
        return _this._markerIcon(data);
      });
      this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-pan', function (data) {
        return _this._markerPan(data);
      });
      this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-unhighlight', function (id) {
        return _this._markerUnhighlight(id);
      });
      if (this._config.get('loadApiScript')) {
        this._loadApiScript();this._initialize();return;
      }
      this._eventAggregator.subscribe(this._config.get('apiScriptLoadedEvent'), function (scriptPromise) {
        _this._scriptPromise = scriptPromise;_this._initialize();
      });
    }

    GoogleMaps.prototype.addressChanged = function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(newValue) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._mapPromise;

              case 2:
                if (newValue) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return');

              case 4:
                if (this._init.address) {
                  _context2.next = 7;
                  break;
                }

                this._init.address = true;return _context2.abrupt('return');

              case 7:
                this._taskQueue.queueMicroTask(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return _this2._setAddress(newValue);

                        case 2:
                          return _context.abrupt('return', _context.sent);

                        case 3:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this2);
                })));

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function addressChanged(_x) {
        return _ref.apply(this, arguments);
      }

      return addressChanged;
    }();

    GoogleMaps.prototype.latitudeChanged = function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(newValue) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._mapPromise;

              case 2:
                if (newValue) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt('return');

              case 4:
                if (this._init.latitude) {
                  _context3.next = 7;
                  break;
                }

                this._init.latitude = true;return _context3.abrupt('return');

              case 7:
                this._taskQueue.queueMicroTask(function () {
                  return _this3._setCenter(newValue, null);
                });

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function latitudeChanged(_x2) {
        return _ref3.apply(this, arguments);
      }

      return latitudeChanged;
    }();

    GoogleMaps.prototype.longitudeChanged = function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(newValue) {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._mapPromise;

              case 2:
                if (newValue) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt('return');

              case 4:
                if (this._init.longitude) {
                  _context4.next = 7;
                  break;
                }

                this._init.longitude = true;return _context4.abrupt('return');

              case 7:
                this._taskQueue.queueMicroTask(function () {
                  return _this4._setCenter(null, newValue);
                });

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function longitudeChanged(_x3) {
        return _ref4.apply(this, arguments);
      }

      return longitudeChanged;
    }();

    GoogleMaps.prototype.mapTypeIdChanged = function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(newValue) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._mapPromise;

              case 2:
                if (newValue) {
                  _context5.next = 4;
                  break;
                }

                return _context5.abrupt('return');

              case 4:
                this._taskQueue.queueMicroTask(function () {
                  return _this5._setMapTypeId(newValue);
                });

              case 5:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function mapTypeIdChanged(_x4) {
        return _ref5.apply(this, arguments);
      }

      return mapTypeIdChanged;
    }();

    GoogleMaps.prototype.markersChanged = function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(newValue) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._mapPromise;

              case 2:
                if (!(!newValue || !newValue.length)) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt('return');

              case 4:
                if (this._subscription) {
                  this._subscription.dispose();
                  this._markers.forEach(function (marker) {
                    return marker.setMap(null);
                  });
                  this._markers = [];
                }
                this._subscription = this._bindingEngine.collectionObserver(this.markers).subscribe(function (splices) {
                  return _this6._spliceMarkers(splices);
                });
                newValue.forEach(function (marker) {
                  return _this6._createMarker(marker);
                });
                this._eventAggregator.publish('aurelia-plugins:google-maps:markers-changed');

              case 8:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function markersChanged(_x5) {
        return _ref6.apply(this, arguments);
      }

      return markersChanged;
    }();

    GoogleMaps.prototype.zoomChanged = function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(newValue) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this._mapPromise;

              case 2:
                if (newValue) {
                  _context7.next = 4;
                  break;
                }

                return _context7.abrupt('return');

              case 4:
                this._taskQueue.queueMicroTask(function () {
                  return _this7._setZoom(newValue);
                });

              case 5:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function zoomChanged(_x6) {
        return _ref7.apply(this, arguments);
      }

      return zoomChanged;
    }();

    GoogleMaps.prototype._setAddress = function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(address) {
        var result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this._geocode(address);

              case 2:
                result = _context8.sent;

                this._setCenter(result.geometry.location.lat(), result.geometry.location.lng());

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function _setAddress(_x7) {
        return _ref8.apply(this, arguments);
      }

      return _setAddress;
    }();

    GoogleMaps.prototype._getCenter = function _getCenter(latitude, longitude) {
      return new window.google.maps.LatLng(parseFloat(latitude || this.latitude), parseFloat(longitude || this.longitude));
    };

    GoogleMaps.prototype._setCenter = function _setCenter(latitude, longitude) {
      this._map.setCenter(this._getCenter(latitude, longitude));
      this._publishBoundsChangedEvent();
    };

    GoogleMaps.prototype._getMapTypeId = function _getMapTypeId(mapTypeId) {
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
    };

    GoogleMaps.prototype._setMapTypeId = function _setMapTypeId(mapTypeId) {
      this._map.setMapTypeId(this._getMapTypeId(mapTypeId));
    };

    GoogleMaps.prototype._getZoom = function _getZoom(zoom) {
      return parseInt(zoom || this.zoom, 10);
    };

    GoogleMaps.prototype._setZoom = function _setZoom(zoom) {
      this._map.setZoom(this._getZoom(zoom));
    };

    GoogleMaps.prototype._createMarker = function _createMarker(marker) {
      var _this8 = this;

      var mapMarker = new window.google.maps.Marker({
        animation: marker.animation,
        icon: marker.icon,
        label: marker.label,
        map: this._map,
        position: new window.google.maps.LatLng(parseFloat(marker.latitude), parseFloat(marker.longitude)),
        title: marker.title,
        zIndex: marker.zIndex
      });
      if (marker.custom) mapMarker.custom = marker.custom;
      if (marker.infoWindow) {
        mapMarker.infoWindow = new window.google.maps.InfoWindow(marker.infoWindow);
        mapMarker.infoWindow.addListener('closeclick', function () {
          return _this8._infoWindowCloseClick(mapMarker.infoWindow);
        });
        mapMarker.infoWindow.addListener('content_changed', function () {
          return _this8._infoWindowContentChanged(mapMarker.infoWindow);
        });
        mapMarker.infoWindow.addListener('domready', function () {
          return _this8._infoWindowDomReady(mapMarker.infoWindow);
        });
      }
      mapMarker.addListener('click', function () {
        return _this8._markerClick(mapMarker);
      });
      mapMarker.addListener('dblclick', function () {
        return _this8._markerPan(mapMarker);
      });
      mapMarker.addListener('mouseout', function () {
        return _this8._markerMouseOut(mapMarker);
      });
      mapMarker.addListener('mouseover', function () {
        return _this8._markerMouseOver(mapMarker);
      });
      this._markers.push(mapMarker);
    };

    GoogleMaps.prototype._geocode = function _geocode(address) {
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        new window.google.maps.Geocoder().geocode({ address: address }, function (results, status) {
          if (status !== window.google.maps.GeocoderStatus.OK) return reject();
          _this9._eventAggregator.publish('aurelia-plugins:google-maps:address-geocoded', results);
          resolve(results[0]);
        });
      });
    };

    GoogleMaps.prototype._initialize = function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var _this10 = this;

        var result, center, options;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this._scriptPromise;

              case 2:
                if (!(this.address && !this.latitude && !this.longitude)) {
                  _context9.next = 8;
                  break;
                }

                _context9.next = 5;
                return this._geocode(this.address);

              case 5:
                _context9.t0 = _context9.sent;
                _context9.next = 9;
                break;

              case 8:
                _context9.t0 = undefined;

              case 9:
                result = _context9.t0;
                center = result ? this._getCenter(result.geometry.location.lat(), result.geometry.location.lng()) : this._getCenter();
                options = Object.assign(this.options || this._config.get('options'), { center: center, mapTypeId: this._getMapTypeId(), zoom: this._getZoom() });

                this._map = new window.google.maps.Map(this._element, options);
                this._eventAggregator.publish('aurelia-plugins:google-maps:map-created', this._map);
                this._mapResolve();
                this._map.addListener('click', function (event) {
                  return _this10._mapClick(event);
                });
                this._map.addListener('dragend', function () {
                  return _this10._publishBoundsChangedEvent();
                });
                this._map.addListener('zoom_changed', function () {
                  return _this10._publishBoundsChangedEvent();
                });

              case 18:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function _initialize() {
        return _ref9.apply(this, arguments);
      }

      return _initialize;
    }();

    GoogleMaps.prototype._infoWindowCloseClick = function _infoWindowCloseClick(infoWindow) {
      this._eventAggregator.publish('aurelia-plugins:google-maps:infowindow-closeclick', infoWindow);
    };

    GoogleMaps.prototype._infoWindowContentChanged = function _infoWindowContentChanged(infoWindow) {
      this._eventAggregator.publish('aurelia-plugins:google-maps:infowindow-content-changed', infoWindow);
    };

    GoogleMaps.prototype._infoWindowDomReady = function _infoWindowDomReady(infoWindow) {
      this._eventAggregator.publish('aurelia-plugins:google-maps:infowindow-domready', infoWindow);
    };

    GoogleMaps.prototype._loadApiScript = function _loadApiScript() {
      var _this11 = this;

      if (this._scriptPromise) return;
      if (window.google === undefined || window.google.maps === undefined) {
        var script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=aureliaPluginsGoogleMapsCallback&key=' + this._config.get('key') + '&language=' + this._config.get('language') + '&libraries=' + this._config.get('libraries') + '&region=' + this._config.get('region');
        script.type = 'text/javascript';
        document.body.appendChild(script);
        this._scriptPromise = new Promise(function (resolve, reject) {
          window.aureliaPluginsGoogleMapsCallback = function () {
            _this11._eventAggregator.publish('aurelia-plugins:google-maps:api-script-loaded', _this11._scriptPromise);
            resolve();
          };
          script.onerror = function (error) {
            return reject(error);
          };
        });
      } else if (window.google && window.google.maps) this._scriptPromise = new Promise(function (resolve) {
        return resolve();
      });
    };

    GoogleMaps.prototype._mapClick = function _mapClick(event) {
      if (this._element.attributes['map-click.delegate']) {
        var customEvent = void 0;
        if (window.CustomEvent) customEvent = new CustomEvent('map-click', { bubbles: true, detail: event });else {
          customEvent = document.createEvent('CustomEvent');
          customEvent.initCustomEvent('map-click', true, true, { data: event });
        }
        this._element.dispatchEvent(customEvent);
        this._eventAggregator.publish('aurelia-plugins:google-maps:map-click', event);
      } else if (this.autoCloseInfoWindows && this._previousInfoWindow) {
        this._previousInfoWindow.close();
        this._previousInfoWindow = null;
      }
    };

    GoogleMaps.prototype._markerClick = function _markerClick(marker) {
      if (!marker.infoWindow) this._eventAggregator.publish('aurelia-plugins:google-maps:marker-click', marker);else if (this.autoCloseInfoWindows) {
        if (this._previousInfoWindow) this._previousInfoWindow.close();
        this._previousInfoWindow = this._previousInfoWindow !== marker.infoWindow ? marker.infoWindow : null;
        if (this._previousInfoWindow) this._previousInfoWindow.open(this._map, marker);
      } else marker.infoWindow.open(this._map, marker);
    };

    GoogleMaps.prototype._markerHighlight = function _markerHighlight(id) {
      var marker = this._markers.find(function (marker) {
        return marker.custom.id === id;
      });
      if (!marker) return;
      marker.setIcon(marker.custom.highlightIcon);
      marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
    };

    GoogleMaps.prototype._markerIcon = function _markerIcon(data) {
      var marker = this._markers.find(function (marker) {
        return marker.custom.id === data.id;
      });
      if (!marker) return;
      marker.custom = data.custom;
      marker.setIcon(data.icon);
    };

    GoogleMaps.prototype._markerMouseOut = function _markerMouseOut(marker) {
      this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseout', marker);
    };

    GoogleMaps.prototype._markerMouseOver = function _markerMouseOver(marker) {
      this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseover', marker);
      marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
    };

    GoogleMaps.prototype._markerPan = function _markerPan(data) {
      var marker = this._markers.find(function (marker) {
        return marker.custom.id === data.id;
      });
      if (!marker) return;
      this._map.setZoom(data.zoom || 17);
      this._map.panTo(marker.position);
      if (data.open) this._markerClick(marker);
    };

    GoogleMaps.prototype._markerUnhighlight = function _markerUnhighlight(id) {
      var marker = this._markers.find(function (marker) {
        return marker.custom.id === id;
      });
      if (marker) marker.setIcon(marker.custom.defaultIcon);
    };

    GoogleMaps.prototype._publishBoundsChangedEvent = function _publishBoundsChangedEvent() {
      var bounds = this._map.getBounds();
      if (bounds) this._eventAggregator.publish('aurelia-plugins:google-maps:map-bounds-changed', bounds);
    };

    GoogleMaps.prototype._spliceMarkers = function _spliceMarkers(markers) {
      var _this12 = this;

      if (!markers.length) return;
      markers.forEach(function (marker) {
        if (marker.addedCount) _this12._createMarker(_this12.markers[marker.index]);
        if (!marker.removed.length) return;
        marker.removed.forEach(function (removed) {
          for (var i = 0, j = _this12._markers.length; i < j; i++) {
            var rendered = _this12._markers[i];
            if (rendered.position.lat().toFixed(12) !== removed.latitude.toFixed(12) || rendered.position.lng().toFixed(12) !== removed.longitude.toFixed(12)) continue;
            rendered.setMap(null);
            _this12._markers.splice(i, 1);
            break;
          }
        });
      });
    };

    return GoogleMaps;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'address', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'autoCloseInfoWindows', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'latitude', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'longitude', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mapTypeId', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 'ROADMAP';
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'markers', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'options', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'zoom', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 8;
    }
  })), _class2)) || _class) || _class) || _class);
});