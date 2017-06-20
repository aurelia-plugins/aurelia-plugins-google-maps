# aurelia-plugins-google-maps

A Google Maps plugin for Aurelia.

## Installation

**Webpack/Aurelia CLI**

```shell
npm install aurelia-plugins-google-maps --save
```

**JSPM**

```shell
jspm install aurelia-plugins-google-maps
```

**Bower**

```shell
bower install aurelia-plugins-google-maps
```

## Configuration

Inside of your `main.js` or `main.ts` file simply load the plugin inside of the configure method using `.plugin()`.

```javascript
export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.use
    .plugin('aurelia-plugins-google-maps', config => {
      config.options({
        apiScriptLoadedEvent: 'aurelia-plugins:google-places-autocomplete:api-script-loaded', // if loadApiScript is false, the event that is subscribed to, to know when the Google Maps API is loaded by another plugin
        key: '', // your Google API key retrieved from the Google Developer Console
        language: 'en', // see https://developers.google.com/maps/documentation/javascript/localization
        libraries: 'geometry', // see https://developers.google.com/maps/documentation/javascript/libraries
        loadApiScript: true|false, // whether or not the <script> tag of the Google Maps API should be loaded
        options: { panControl: true, panControlOptions: { position: 9 } }, // see https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions
        region: 'US' // see https://developers.google.com/maps/documentation/javascript/localization#Region
      });
    });

    await aurelia.start();
    aurelia.setRoot('app');
}
```

## Usage

Once Google Maps is configured, to use it simply add the custom element `<aup-google-maps></aup-google-maps>` in your view. Do not forgot to have some minimal css for the `<aup-google-maps>`.

```css
aup-google-maps { display: block; height: 100vh; width: 100%; }
```

### Google Maps API loaded

The `aurelia-plugins:google-maps:api-script-loaded` event is published when the Google Maps API Script is completely loaded. A Promise is returned as payload. This event is used together with other Aurelia Plugins in combination with the option `loadApiScript=false` to make sure the Google Maps API Script is loaded only once.

Google Maps needs at least the library `geometry`. Perhaps the other Aurelia Plugin that loads the Google Maps API Script doesn't include the library `geometry` by default. If so, add it to the `libraries` option of the other Aurelia Plugin.

### Latitude/Longitude

Provide standard latitude and longitude coordinates to center the map.

```html
<aup-google-maps latitude="51.037861" longitude="4.240528"></aup-google-maps>
```

### Address

Provide a string as an address which gets geocoded to center the map on this particular address.

```html
<aup-google-maps address="1600 Amphitheatre Parkway. Mountain View, CA 94043"></aup-google-maps>
```

### Zoom

Add a `zoom` attribute and supply a value to choose an appropriate zoom level. By default the zoom level is 8.

```html
<aup-google-maps latitude="51.037861" longitude="4.240528" zoom="15"></aup-google-maps>
```

### Map Type ID

Set to one of the following Google Basic Map Type. See the [Google Maps documentation](<https://developers.google.com/maps/documentation/javascript/maptypes#BasicMapTypes>).

* HYBRID - This map type displays a transparent layer of major streets on satellite images.
* ROADMAP - This map type displays a normal street map. (This is the default map type.)
* SATELLITE - This map type displays satellite images.
* TERRAIN - This map type displays maps with physical features such as terrain and vegetation.

```html
<aup-google-maps latitude="51.037861" longitude="4.240528" map-type-id="HYBRID"></aup-google-maps>
```

### Options

When you add `options` to the config, these options are used on all instances of `<aup-google-maps>`. You can set specific options on each `<aup-google-maps>` instance via the optional bindable attribute `options`.

```html
<aup-google-maps latitude="51.037861" longitude="4.240528" options.bind="options1"></aup-google-maps>
<aup-google-maps latitude="51.037861" longitude="4.240528" options.bind="options2"></aup-google-maps>
```

```javascript
export class App {
  constructor() {}

  options1 = { panControl: true, panControlOptions: { position: 9 } };
  options2 = { styles: [/* add your styles here */] };
}
```

### Markers

Markers can be bound to `<aup-google-maps>` with the `markers` attribute. The markers attribute should be an array of objects with at minimum the `latitude` and `longitude` key/value pairs.

```html
<aup-google-maps latitude="51.037861" longitude="4.240528" markers.bind="myMarkers"></aup-google-maps>
```

```javascript
export class App {
  constructor() {}

  myMarkers = [
    {
      animation: google.maps.Animation.BOUNCE,
      custom: { id: 1234, ... },
      icon: '/img/myMarkerIcon.png',
      infoWindow: {
        content: '<strong>insert some HTML content here</strong>',
        pixelOffset: new google.maps.Size(-13, 0),
        position: new google.maps.LatLng(51.037861, 4.240528),
        maxWidth: 300
      },
      label: 'My Marker Label',
      latitude: 51.037861,
      longitude: 4.240528,
      title: 'My Marker Title'
    },
    { ... }
  ];
}
```

#### Supported properties

* `latitude` (required) - float
* `longitude` (required) - float
* `icon` (optional) - string|Icon|Symbol - see [Google Maps documentation](<https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions>)
* `label` (optional) - string|MarkerLabel - see [Google Maps documentation](<https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions>)
* `title` (optional) - string - see [Google Maps documentation](<https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions>)
* `custom` (optional) - object - store arbitrary data (e.g. an `id` field) in this object, retrieve it from the `aurelia-plugins:google-maps:marker-click` event payload
* `animation` (optional) - google.maps.Animation constant - see [Google Maps documentation](<https://developers.google.com/maps/documentation/javascript/3.exp/reference#Animation>)
* `infoWindow` (optional) - object - if set, the `aurelia-plugins:google-maps:marker-click` event will not be called, instead an infoWindow containing the given content will be shown - see [Google Maps documentation](<https://developers.google.com/maps/documentation/javascript/infowindows>)
  * `content` (required) - string|Node - content to display in the InfoWindow. This can be an HTML element, a plain-text string, or a string containing HTML. 
  * `pixelOffset` (optional) - google.maps.Size - the offset, in pixels, of the tip of the info window from the point on the map at whose geographical coordinates the info window is anchored.
  * `position` (optional) - google.maps.LatLng - the LatLng at which to display this InfoWindow.
  * `maxWidth` (optional) - number - maximum width of the infowindow, regardless of content's width.

### Map Click Event

It is possible to catch the map click event as specified by the [Google Maps documentation](https://developers.google.com/maps/documentation/javascript/events#ShapeEvents). The `map-click` event is added as a CustomEvent to the `<aup-google-maps>` DOM element with the event data added to the `detail` key.

```html
<aup-google-maps latitude="51.037861" longitude="4.240528" map-click.delegate="myEventHandler($event)"></aup-google-maps>
```

```javascript
export class App {
  constructor() {}

  myEventHandler(event) {
    const latLng = event.detail.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
  }
}
```

When the `map-click` event is triggered, the `aurelia-plugins:google-maps:map-click` event is also published via the Aurelia Event Aggregator framework. The payload is the `event` object.

### Automatically Close infoWindows

Automatically close the previous opened infoWindow when opening a new one, or when clicking somewhere on the map (assuming the `map-click` event is not set up).

```html
<aup-google-maps auto-close-info-windows="true" latitude="51.037861" longitude="4.240528"  markers.bind="myMarkers"></aup-google-maps>
```

### Events

#### Published by aurelia-plugins-google-maps

In addition to the `map-click` event mentioned above, there are several events propagated via the Aurelia Event Aggregator framework:

* `aurelia-plugins:google-maps:api-script-loaded` - published when the Google Maps API is completely loaded, a `promise` is returned as payload.

* `aurelia-plugins:google-maps:map-bounds-changed` - published when the map is dragged or zoomed, payload is the new map bounds as a `LatLngBounds` object.

* `aurelia-plugins:google-maps:map-click` - published when the map is clicked, payload is the `event` object.

* `aurelia-plugins:google-maps:map-created` - published when the map is created, payload is the `Map` object.

* `aurelia-plugins:google-maps:infowindow-domready` - published when the infoWindow is fully loaded, payload is the `InfoWindow` object for the related marker.

* `aurelia-plugins:google-maps:marker-click` - published when a map marker is clicked, payload is the `Marker` object for the clicked marker.

* `aurelia-plugins:google-maps:marker-mouseout` - published when the mouse exits the marker, payload is the `Marker` object for the exited marker.

* `aurelia-plugins:google-maps:marker-mouseover` - published when the mouse enters the marker, payload is the `Marker` object for the entered marker.

* `aurelia-plugins:google-maps:markers-changed` - published when all the markers are added to the map, there is no payload.

#### Subscribed to by aurelia-plugins-google-maps

* `aurelia-plugins:google-maps:marker-highlight` - in your viewModel publish to this event with the index of the marker in the `markers` array to highlight the marker. Highlighting is done by changing the `icon` property of the marker to the value in the property `custom.highlightIcon`.

* `aurelia-plugins:google-maps:marker-pan` - in your viewModel publish to this event with the index of the marker in the `markers` array to pan and zoom to the marker on the map.

* `aurelia-plugins:google-maps:marker-unhighlight` - in your viewModel publish to this event with the index of the marker in the `markers` array to remove the highligh of the marker. The `icon` property of the marker is changed to the value in the property `custom.defaultIcon`.