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

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

  var GoogleMaps = exports.GoogleMaps = (_dec = (0, _aureliaTemplating.customElement)('aup-google-maps'), _dec2 = (0, _aureliaTemplating.noView)(), _dec3 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaBinding.BindingEngine, _aureliaPluginsGoogleMapsConfig.Config, _aureliaEventAggregator.EventAggregator, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function () {
    function GoogleMaps(element, bindingEngine, config, eventAggregator, taskQueue) {
      var _this = this;

      

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

      _initDefineProp(this, 'zoom', _descriptor7, this);

      this._bindingEngine = bindingEngine;
      this._config = config;
      this._element = element;
      this._eventAggregator = eventAggregator;
      this._taskQueue = taskQueue;
      if (!this._config.get('key')) return console.error('No Google API key has been specified.');
      this._mapPromise = new Promise(function (resolve) {
        _this._mapResolve = resolve;
      });
      this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-highlight', function (data) {
        _this._markerHighlight(_this._markers[data.index]);
      });
      this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-pan', function (data) {
        _this._markerPan(_this._markers[data.index]);
      });
      this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-unhighlight', function (data) {
        _this._markerUnhighlight(_this._markers[data.index]);
      });
      if (this._config.get('loadApiScript')) {
        this._loadApiScript();this._initialize();return;
      }
      this._eventAggregator.subscribe(this._config.get('apiScriptLoadedEvent'), function (scriptPromise) {
        _this._scriptPromise = scriptPromise;_this._initialize();
      });
    }

    GoogleMaps.prototype.addressChanged = function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(newValue) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._mapPromise;

              case 2:
                if (newValue) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return');

              case 4:
                this._taskQueue.queueMicroTask(function () {
                  _this2._setAddress(newValue);
                });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function addressChanged(_x) {
        return _ref.apply(this, arguments);
      }

      return addressChanged;
    }();

    GoogleMaps.prototype.latitudeChanged = function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(newValue) {
        var _this3 = this;

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
                this._taskQueue.queueMicroTask(function () {
                  _this3._setCenter(newValue, null);
                });

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function latitudeChanged(_x2) {
        return _ref2.apply(this, arguments);
      }

      return latitudeChanged;
    }();

    GoogleMaps.prototype.longitudeChanged = function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(newValue) {
        var _this4 = this;

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
                this._taskQueue.queueMicroTask(function () {
                  _this4._setCenter(null, newValue);
                });

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function longitudeChanged(_x3) {
        return _ref3.apply(this, arguments);
      }

      return longitudeChanged;
    }();

    GoogleMaps.prototype.mapTypeIdChanged = function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(newValue) {
        var _this5 = this;

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
                this._taskQueue.queueMicroTask(function () {
                  _this5._setMapTypeId(newValue);
                });

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function mapTypeIdChanged(_x4) {
        return _ref4.apply(this, arguments);
      }

      return mapTypeIdChanged;
    }();

    GoogleMaps.prototype.markersChanged = function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(newValue) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this._mapPromise;

              case 2:
                if (!(!newValue || !newValue.length)) {
                  _context5.next = 4;
                  break;
                }

                return _context5.abrupt('return');

              case 4:
                if (this._subscription) {
                  this._subscription.dispose();
                  this._markers.forEach(function (marker) {
                    marker.setMap(null);
                  });
                  this._markers = [];
                }
                this._subscription = this._bindingEngine.collectionObserver(this.markers).subscribe(function (splices) {
                  _this6._spliceMarkers(splices);
                });
                newValue.forEach(function (marker) {
                  _this6._createMarker(marker);
                });
                this._eventAggregator.publish('aurelia-plugins:google-maps:markers-changed');

              case 8:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function markersChanged(_x5) {
        return _ref5.apply(this, arguments);
      }

      return markersChanged;
    }();

    GoogleMaps.prototype.zoomChanged = function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(newValue) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._mapPromise;

              case 2:
                if (newValue) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt('return');

              case 4:
                this._taskQueue.queueMicroTask(function () {
                  _this7._setZoom(newValue);
                });

              case 5:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function zoomChanged(_x6) {
        return _ref6.apply(this, arguments);
      }

      return zoomChanged;
    }();

    GoogleMaps.prototype._setAddress = function _setAddress(address) {
      var _this8 = this;

      var geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address || this.address }, function (results, status) {
        if (status !== window.google.maps.GeocoderStatus.OK) return;
        _this8._setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
      });
    };

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
      var _this9 = this;

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
        _marker.infoWindow.addListener('domready', function () {
          _this9._infoWindowDomReady(_marker.infoWindow);
        });
      }
      _marker.addListener('click', function () {
        _this9._markerClick(_marker);
      });
      _marker.addListener('dblclick', function () {
        _this9._markerPan(_marker);
      });
      _marker.addListener('mouseout', function () {
        _this9._markerMouseOut(_marker);
      });
      _marker.addListener('mouseover', function () {
        _this9._markerMouseOver(_marker);
      });
      this._markers.push(_marker);
    };

    GoogleMaps.prototype._initialize = function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var _this10 = this;

        var options;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this._scriptPromise;

              case 2:
                options = Object.assign(this._config.get('options'), { center: this._getCenter(), mapTypeId: this._getMapTypeId(), zoom: this._getZoom() });

                this._map = new window.google.maps.Map(this._element, options);
                this._eventAggregator.publish('aurelia-plugins:google-maps:map-created', this._map);
                this._mapResolve();
                this._map.addListener('click', function (event) {
                  _this10._mapClick(event);
                });
                this._map.addListener('dragend', function () {
                  _this10._publishBoundsChangedEvent();
                });
                this._map.addListener('zoom_changed', function () {
                  _this10._publishBoundsChangedEvent();
                });

              case 9:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function _initialize() {
        return _ref7.apply(this, arguments);
      }

      return _initialize;
    }();

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
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=aureliaPluginsGoogleMapsCallback&key=' + this._config.get('key') + '&language=' + this._config.get('language') + '&libraries=' + this._config.get('libraries');
        script.type = 'text/javascript';
        document.body.appendChild(script);
        this._scriptPromise = new Promise(function (resolve, reject) {
          window.aureliaPluginsGoogleMapsCallback = function () {
            _this11._eventAggregator.publish('aurelia-plugins:google-maps:api-script-loaded', _this11._scriptPromise);
            resolve();
          };
          script.onerror = function (error) {
            reject(error);
          };
        });
      } else if (window.google && window.google.maps) this._scriptPromise = new Promise(function (resolve) {
        resolve();
      });
    };

    GoogleMaps.prototype._mapClick = function _mapClick(event) {
      if (this._element.attributes['map-click.delegate']) {
        var clickEvent;
        if (window.CustomEvent) clickEvent = new CustomEvent('map-click', { bubbles: true, details: event });else {
          clickEvent = document.createEvent('CustomEvent');
          clickEvent.initCustomEvent('map-click', true, true, { data: event });
        }
        this._element.dispatchEvent(clickEvent);
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

    GoogleMaps.prototype._markerHighlight = function _markerHighlight(marker) {
      marker.setIcon(marker.custom.highlightIcon);
      marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
    };

    GoogleMaps.prototype._markerMouseOut = function _markerMouseOut(marker) {
      this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseout', marker);
    };

    GoogleMaps.prototype._markerMouseOver = function _markerMouseOver(marker) {
      this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseover', marker);
      marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
    };

    GoogleMaps.prototype._markerPan = function _markerPan(marker) {
      this._map.setZoom(17);
      this._map.panTo(marker.position);
    };

    GoogleMaps.prototype._markerUnhighlight = function _markerUnhighlight(marker) {
      marker.setIcon(marker.custom.defaultIcon);
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
        if (marker.removed.length) return;
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
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'zoom', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 8;
    }
  })), _class2)) || _class) || _class) || _class);
});