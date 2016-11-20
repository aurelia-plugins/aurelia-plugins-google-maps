import {
  BindingEngine
} from 'aurelia-binding';
import {
  inject
} from 'aurelia-dependency-injection';
import {
  EventAggregator
} from 'aurelia-event-aggregator';
import {
  TaskQueue
} from 'aurelia-task-queue';
import {
  bindable,
  customElement,
  noView
} from 'aurelia-templating';

// PUBLIC CLASS
export declare class Config {
  
  // CONSTRUCTOR
  constructor();
  
  // PUBLIC METHODS
  get(key?: any): any;
  options(obj?: any): any;
  set(key?: any, value?: any): any;
}

// PUBLIC CLASS

// IMPORTS
// CLASS ATTRIBUTES
export declare class GoogleMaps {
  address: any;
  autoCloseInfoWindows: any;
  latitude: any;
  longitude: any;
  mapTypeId: any;
  markers: any;
  options: any;
  zoom: any;
  
  // CONSTRUCTOR
  constructor(element?: any, bindingEngine?: any, config?: any, eventAggregator?: any, taskQueue?: any);
  
  // BINDABLE METHODS
  addressChanged(newValue?: any): any;
  latitudeChanged(newValue?: any): any;
  longitudeChanged(newValue?: any): any;
  mapTypeIdChanged(newValue?: any): any;
  markersChanged(newValue?: any): any;
  zoomChanged(newValue?: any): any;
}

// IMPORTS
// PUBLIC METHODS
export declare function configure(aurelia?: any, configCallback?: any): any;