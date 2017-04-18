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
  bindingEngine;
  config;
  element;
  eventAggregator;
  taskQueue;

  // PRIVATE PROPERTIES (CUSTOM)
  map = null;
  mapMarkers = [];
  mapPromise = null;
  mapResolve = null;
  previousInfoWindow = null;
  scriptPromise = null;
  subscription = null;

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
    this.bindingEngine = bindingEngine;
    this.config = config;
    this.element = element;
    this.eventAggregator = eventAggregator;
    this.taskQueue = taskQueue;
    if (!this.config.get('key')) return console.error('No Google API key has been specified.');
    this.mapPromise = new Promise(resolve => { this.mapResolve = resolve; });
    this.eventAggregator.subscribe('aurelia-plugins:google-maps:marker-highlight', data => this.markerHighlight(this.mapMarkers[data.index]));
    this.eventAggregator.subscribe('aurelia-plugins:google-maps:marker-pan', data => this.markerPan(this.mapMarkers[data.index]));
    this.eventAggregator.subscribe('aurelia-plugins:google-maps:marker-unhighlight', data => this.markerUnhighlight(this.mapMarkers[data.index]));
    if (this.config.get('loadApiScript')) { this.loadApiScript(); this.initialize(); return; }
    this.eventAggregator.subscribe(this.config.get('apiScriptLoadedEvent'), scriptPromise => { this.scriptPromise = scriptPromise; this.initialize(); });
  }

  // BINDABLE METHODS
  async addressChanged(newValue) {
    await this.mapPromise;
    if (!newValue) return;
    this.taskQueue.queueMicroTask(() => this.setAddress(newValue));
  }

  async latitudeChanged(newValue) {
    await this.mapPromise;
    if (!newValue) return;
    this.taskQueue.queueMicroTask(() => this.setCenter(newValue, null));
  }

  async longitudeChanged(newValue) {
    await this.mapPromise;
    if (!newValue) return;
    this.taskQueue.queueMicroTask(() => this.setCenter(null, newValue));
  }

  async mapTypeIdChanged(newValue) {
    await this.mapPromise;
    if (!newValue) return;
    this.taskQueue.queueMicroTask(() => this.setMapTypeId(newValue));
  }

  async markersChanged(newValue) {
    await this.mapPromise;
    if (!newValue || !newValue.length) return;
    if (this.subscription) {
      this.subscription.dispose();
      this.mapMarkers.forEach(marker => marker.setMap(null));
      this.mapMarkers = [];
    }
    this.subscription = this.bindingEngine.collectionObserver(this.markers).subscribe(splices => this.spliceMarkers(splices));
    newValue.forEach(marker => this.createMarker(marker));
    this.eventAggregator.publish('aurelia-plugins:google-maps:markers-changed');
  }

  async zoomChanged(newValue) {
    await this.mapPromise;
    if (!newValue) return;
    this.taskQueue.queueMicroTask(() => this.setZoom(newValue));
  }

  // PRIVATE PROPERTY METHODS
  setAddress(address) {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address || this.address }, (results, status) => {
      if (status !== window.google.maps.GeocoderStatus.OK) return;
      this.setCenter(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    });
  }

  getCenter(latitude, longitude) {
    return new window.google.maps.LatLng(parseFloat(latitude || this.latitude), parseFloat(longitude || this.longitude));
  }

  setCenter(latitude, longitude) {
    this.map.setCenter(this.getCenter(latitude, longitude));
    this.publishBoundsChangedEvent();
  }

  getMapTypeId(mapTypeId) {
    switch ((mapTypeId || this.mapTypeId).toUpperCase()) {
      case 'HYBRID': return window.google.maps.MapTypeId.HYBRID;
      case 'SATELLITE': return window.google.maps.MapTypeId.SATELLITE;
      case 'TERRAIN': return window.google.maps.MapTypeId.TERRAIN;
      default: return window.google.maps.MapTypeId.ROADMAP;
    }
  }

  setMapTypeId(mapTypeId) {
    this.map.setMapTypeId(this.getMapTypeId(mapTypeId));
  }

  getZoom(zoom) {
    return parseInt(zoom || this.zoom, 10);
  }

  setZoom(zoom) {
    this.map.setZoom(this.getZoom(zoom));
  }

  // PRIVATE METHODS
  createMarker(marker) {
    const mapMarker = new window.google.maps.Marker({
      animation: marker.animation,
      icon: marker.icon,
      label: marker.label,
      map: this.map,
      position: new window.google.maps.LatLng(parseFloat(marker.latitude), parseFloat(marker.longitude)),
      title: marker.title
    });
    if (marker.custom) mapMarker.custom = marker.custom;
    if (marker.infoWindow) {
      mapMarker.infoWindow = new window.google.maps.InfoWindow({ content: marker.infoWindow.content, pixelOffset: marker.infoWindow.pixelOffset, position: marker.infoWindow.position, maxWidth: marker.infoWindow.maxWidth });
      mapMarker.infoWindow.addListener('domready', () => this.infoWindowDomReady(mapMarker.infoWindow));
    }
    mapMarker.addListener('click', () => this.markerClick(mapMarker));
    mapMarker.addListener('dblclick', () => this.markerPan(mapMarker));
    mapMarker.addListener('mouseout', () => this.markerMouseOut(mapMarker));
    mapMarker.addListener('mouseover', () => this.markerMouseOver(mapMarker));
    this.mapMarkers.push(mapMarker);
  }

  async initialize() {
    await this.scriptPromise;
    const options = Object.assign(this.options || this.config.get('options'), { center: this.getCenter(), mapTypeId: this.getMapTypeId(), zoom: this.getZoom() });
    this.map = new window.google.maps.Map(this.element, options);
    this.eventAggregator.publish('aurelia-plugins:google-maps:map-created', this.map);
    this.mapResolve();
    this.map.addListener('click', event => this.mapClick(event));
    this.map.addListener('dragend', () => this.publishBoundsChangedEvent());
    this.map.addListener('zoom_changed', () => this.publishBoundsChangedEvent());
  }

  infoWindowDomReady(infoWindow) {
    this.eventAggregator.publish('aurelia-plugins:google-maps:infowindow-domready', infoWindow);
  }

  loadApiScript() {
    if (this.scriptPromise) return;
    if (window.google === undefined || window.google.maps === undefined) {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?callback=aureliaPluginsGoogleMapsCallback&key=${this.config.get('key')}&language=${this.config.get('language')}&libraries=${this.config.get('libraries')}`;
      script.type = 'text/javascript';
      document.body.appendChild(script);
      this.scriptPromise = new Promise((resolve, reject) => {
        window.aureliaPluginsGoogleMapsCallback = () => {
          this.eventAggregator.publish('aurelia-plugins:google-maps:api-script-loaded', this.scriptPromise);
          resolve();
        };
        script.onerror = error => reject(error);
      });
    }
    else if (window.google && window.google.maps)
      this.scriptPromise = new Promise(resolve => resolve());
  }

  mapClick(event) {
    if (this.element.attributes['map-click.delegate']) {
      let clickEvent;
      if (window.CustomEvent)
        clickEvent = new CustomEvent('map-click', { bubbles: true, detail: event });
      else {
        clickEvent = document.createEvent('CustomEvent');
        clickEvent.initCustomEvent('map-click', true, true, { data: event });
      }
      this.element.dispatchEvent(clickEvent);
      this.eventAggregator.publish('aurelia-plugins:google-maps:map-click', event);
    }
    else if (this.autoCloseInfoWindows && this.previousInfoWindow) {
      this.previousInfoWindow.close();
      this.previousInfoWindow = null;
    }
  }

  markerClick(marker) {
    if (!marker.infoWindow)
      this.eventAggregator.publish('aurelia-plugins:google-maps:marker-click', marker);
    else if (this.autoCloseInfoWindows) {
      if (this.previousInfoWindow) this.previousInfoWindow.close();
      this.previousInfoWindow = this.previousInfoWindow !== marker.infoWindow ? marker.infoWindow : null;
      if (this.previousInfoWindow) this.previousInfoWindow.open(this.map, marker);
    }
    else
      marker.infoWindow.open(this.map, marker);
  }

  markerHighlight(marker) {
    marker.setIcon(marker.custom.highlightIcon);
    marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
  }

  markerMouseOut(marker) {
    this.eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseout', marker);
  }

  markerMouseOver(marker) {
    this.eventAggregator.publish('aurelia-plugins:google-maps:marker-mouseover', marker);
    marker.setZIndex(window.google.maps.Marker.MAX_ZINDEX + 1);
  }

  markerPan(marker) {
    this.map.setZoom(17);
    this.map.panTo(marker.position);
  }

  markerUnhighlight(marker) {
    marker.setIcon(marker.custom.defaultIcon);
  }

  publishBoundsChangedEvent() {
    const bounds = this.map.getBounds();
    if (bounds) this.eventAggregator.publish('aurelia-plugins:google-maps:map-bounds-changed', bounds);
  }

  spliceMarkers(markers) {
    if (!markers.length) return;
    markers.forEach(marker => {
      if (marker.addedCount) this.createMarker(this.markers[marker.index]);
      if (marker.removed.length) return;
      marker.removed.forEach(removed => {
        for (let i = 0, j = this.mapMarkers.length; i < j; i++) {
          const rendered = this.mapMarkers[i];
          if (rendered.position.lat().toFixed(12) !== removed.latitude.toFixed(12) || rendered.position.lng().toFixed(12) !== removed.longitude.toFixed(12)) continue;
          rendered.setMap(null);
          this.mapMarkers.splice(i, 1);
          break;
        }
      });
    });
  }
}