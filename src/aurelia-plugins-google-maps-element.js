// IMPORTS
import {BindingEngine} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TaskQueue} from 'aurelia-task-queue';
import {bindable, customElement, noView} from 'aurelia-templating';

import {Config} from './aurelia-plugins-google-maps-config';


// CLASS ATTRIBUTES
@customElement('aup-google-maps')
@noView()
@inject(Element, BindingEngine, Config, EventAggregator, TaskQueue)


// PUBLIC CLASS
export class GoogleMaps {
  // PRIVATE PROPERTIES (DI)
  _bindingEngine;
  _config;
  _element;
  _eventAggregator;
  _taskQueue;

  // PRIVATE PROPERTIES (CUSTOM)
  _init = { address: false, latitude: false, longitude: false };
  _map = null;
  _mapPromise = null;
  _mapResolve = null;
  _markers = [];
  _previousInfoWindow = null;
  _scriptPromise = null;
  _subscription = null;

  // BINDABLE PROPERTIES
  @bindable address = null;
  @bindable autoCloseInfoWindows = false;
  @bindable latitude = 0;
  @bindable longitude = 0;
  @bindable mapTypeId = 'ROADMAP';
  @bindable markers = [];
  @bindable options = null;
  @bindable zoom = 8;

  // CONSTRUCTOR
  constructor(element, bindingEngine, config, eventAggregator, taskQueue) {
    this._bindingEngine = bindingEngine;
    this._config = config;
    this._element = element;
    this._eventAggregator = eventAggregator;
    this._taskQueue = taskQueue;
    if (!this._config.get('key')) return console.error('No Google API key has been specified.');
    this._mapPromise = new Promise(resolve => { this._mapResolve = resolve; });
    this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-highlight', id => this._markerHighlight(id));
    this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-icon', data => this._markerIcon(data));
    this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-pan', data => this._markerPan(data));
    this._eventAggregator.subscribe('aurelia-plugins:google-maps:marker-unhighlight', id => this._markerUnhighlight(id));
    if (this._config.get('loadApiScript')) { this._loadApiScript(); this._initialize(); return; }
    this._eventAggregator.subscribe(this._config.get('apiScriptLoadedEvent'), scriptPromise => { this._scriptPromise = scriptPromise; this._initialize(); });
  }

  // BINDABLE METHODS
  async addressChanged(newValue) {
    await this._mapPromise;
    if (!newValue) return;
    if (!this._init.address) { this._init.address = true; return; }
    this._taskQueue.queueMicroTask(async () => await this._setAddress(newValue));
  }

  async latitudeChanged(newValue) {
    await this._mapPromise;
    if (!newValue) return;
    if (!this._init.latitude) { this._init.latitude = true; return; }
    this._taskQueue.queueMicroTask(() => this._setCenter(newValue, null));
  }

  async longitudeChanged(newValue) {
    await this._mapPromise;
    if (!newValue) return;
    if (!this._init.longitude) { this._init.longitude = true; return; }
    this._taskQueue.queueMicroTask(() => this._setCenter(null, newValue));
  }

  async mapTypeIdChanged(newValue) {
    await this._mapPromise;
    if (!newValue) return;
    this._taskQueue.queueMicroTask(() => this._setMapTypeId(newValue));
  }

  async markersChanged(newValue) {
    await this._mapPromise;
    if (!newValue || !newValue.length) return;
    if (this._subscription) {
      this._subscription.dispose();
      this._markers.forEach(marker => marker.setMap(null));
      this._markers = [];
    }
    this._subscription = this._bindingEngine.collectionObserver(this.markers).subscribe(splices => this._spliceMarkers(splices));
    newValue.forEach(marker => this._createMarker(marker));
    this._eventAggregator.publish('aurelia-plugins:google-maps:markers-changed', this._markers);
  }

  async zoomChanged(newValue) {
    await this._mapPromise;
    if (!newValue) return;
    this._taskQueue.queueMicroTask(() => this._setZoom(newValue));
  }

  // PRIVATE PROPERTY METHODS
  async _setAddress(address) {
    const result = await this._geocode(address);
    this._setCenter(result.geometry.location.lat(), result.geometry.location.lng());
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
      case 'HYBRID': return window.google.maps.MapTypeId.HYBRID;
      case 'SATELLITE': return window.google.maps.MapTypeId.SATELLITE;
      case 'TERRAIN': return window.google.maps.MapTypeId.TERRAIN;
      default: return window.google.maps.MapTypeId.ROADMAP;
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

  // PRIVATE METHODS
  _createMarker(marker) {
    const mapMarker = new window.google.maps.Marker({
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
      mapMarker.infoWindow.addListener('closeclick', () => this._infoWindowCloseClick(mapMarker.infoWindow));
      mapMarker.infoWindow.addListener('content_changed', () => this._infoWindowContentChanged(mapMarker.infoWindow));
      mapMarker.infoWindow.addListener('domready', () => this._infoWindowDomReady(mapMarker.infoWindow));
    }
    mapMarker.addListener('click', () => this._markerClick(mapMarker));
    mapMarker.addListener('dblclick', () => this._markerPan(mapMarker));
    mapMarker.addListener('mouseout', () => this._markerMouseOut(mapMarker));
    mapMarker.addListener('mouseover', () => this._markerMouseOver(mapMarker));
    this._markers.push(mapMarker);
  }

  _geocode(address) {
    return new Promise((resolve, reject) => {
      new window.google.maps.Geocoder().geocode({ address: address }, (results, status) => {
        if (status !== window.google.maps.GeocoderStatus.OK) return reject();
        this._eventAggregator.publish('aurelia-plugins:google-maps:address-geocoded', results);
        resolve(results[0]);
      });
    });
  }

  async _initialize() {
    await this._scriptPromise;
    const result = this.address && !this.latitude && !this.longitude ? await this._geocode(this.address) : undefined;
    const center = result ? this._getCenter(result.geometry.location.lat(), result.geometry.location.lng()) : this._getCenter();
    const options = Object.assign(this.options || this._config.get('options'), { center: center, mapTypeId: this._getMapTypeId(), zoom: this._getZoom() });
    this._map = new window.google.maps.Map(this._element, options);
    this._eventAggregator.publish('aurelia-plugins:google-maps:map-created', this._map);
    this._mapResolve();
    this._map.addListener('click', event => this._mapClick(event));
    this._map.addListener('dragend', () => this._publishBoundsChangedEvent());
    this._map.addListener('zoom_changed', () => this._publishBoundsChangedEvent());
  }

  _infoWindowCloseClick(infoWindow) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:infowindow-closeclick', infoWindow);
  }

  _infoWindowContentChanged(infoWindow) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:infowindow-content-changed', infoWindow);
  }

  _infoWindowDomReady(infoWindow) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:infowindow-domready', infoWindow);
  }

  _loadApiScript() {
    if (this._scriptPromise) return;
    if (window.google === undefined || window.google.maps === undefined) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?callback=aureliaPluginsGoogleMapsCallback&key=${this._config.get('key')}&language=${this._config.get('language')}&libraries=${this._config.get('libraries')}&region=${this._config.get('region')}`;
      script.type = 'text/javascript';
      document.body.appendChild(script);
      this._scriptPromise = new Promise((resolve, reject) => {
        window.aureliaPluginsGoogleMapsCallback = () => {
          this._eventAggregator.publish('aurelia-plugins:google-maps:api-script-loaded', this._scriptPromise);
          resolve();
        };
        script.onerror = err => reject(err);
      });
    }
    else if (window.google && window.google.maps)
      this._scriptPromise = new Promise(resolve => resolve());
  }

  _mapClick(event) {
    if (this._element.attributes['map-click.delegate']) {
      let customEvent;
      if (window.CustomEvent)
        customEvent = new CustomEvent('map-click', { bubbles: true, cancelable: true, detail: event });
      else {
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent('map-click', true, true, { data: event });
      }
      this._element.dispatchEvent(customEvent);
      this._eventAggregator.publish('aurelia-plugins:google-maps:map-click', event);
    }
    else if (this.autoCloseInfoWindows && this._previousInfoWindow) {
      this._previousInfoWindow.close();
      this._previousInfoWindow = null;
    }
  }

  _markerClick(marker) {
    if (!marker.infoWindow)
      this._eventAggregator.publish('aurelia-plugins:google-maps:marker-click', marker);
    else if (this.autoCloseInfoWindows) {
      if (this._previousInfoWindow) this._previousInfoWindow.close();
      this._previousInfoWindow = this._previousInfoWindow !== marker.infoWindow ? marker.infoWindow : null;
      if (this._previousInfoWindow) this._previousInfoWindow.open(this._map, marker);
    }
    else
      marker.infoWindow.open(this._map, marker);
  }

  _markerHighlight(id) {
    const marker = this._markers.find(marker => marker.custom.id === id);
    if (!marker) return;
    marker.setIcon(marker.custom.highlightIcon);
    marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
  }

  _markerIcon(data) {
    const marker = this._markers.find(marker => marker.custom.id === data.id);
    if (!marker) return;
    marker.custom = data.custom;
    marker.setIcon(data.icon);
  }

  _markerMouseOut(marker) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseout', marker);
  }

  _markerMouseOver(marker) {
    this._eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseover', marker);
    marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
  }

  _markerPan(data) {
    const marker = this._markers.find(marker => marker.custom.id === data.id);
    if (!marker) return;
    this._map.setZoom(data.zoom || 17);
    this._map.panTo(marker.position);
    if (data.open) this._markerClick(marker);
  }

  _markerUnhighlight(id) {
    const marker = this._markers.find(marker => marker.custom.id === id);
    if (marker) marker.setIcon(marker.custom.defaultIcon);
  }

  _publishBoundsChangedEvent() {
    const bounds = this._map.getBounds();
    if (bounds) this._eventAggregator.publish('aurelia-plugins:google-maps:map-bounds-changed', bounds);
  }

  _spliceMarkers(markers) {
    if (!markers.length) return;
    for (const marker of markers) {
      if (marker.addedCount) this._createMarker(this.markers[marker.index]);
      if (!marker.removed.length) continue;
      for (const removed of marker.removed) {
        for (let i = 0; i < this._markers.length; i++) {
          const rendered = this._markers[i];
          if (rendered.position.lat().toFixed(12) !== removed.latitude.toFixed(12) || rendered.position.lng().toFixed(12) !== removed.longitude.toFixed(12)) continue;
          rendered.setMap(null);
          this._markers.splice(i, 1);
          break;
        }
      }
    }
  }
}