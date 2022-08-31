// create the tile layers for the map
// street view layer
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// satellite street view layer
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    Street: streets,
    "Satellite Street": satelliteStreets
  };

// Create the map object with center (Toronto), zoom level and default layer.
let map = L.map('mapid', {
    center: [43.7, -79.3],
    zoom: 11,
    layers: [streets]
})

// Pass map layers into layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Accessing the Toronto neighborhoods GeoJSON URL.
let torontoHoods = "https://raw.githubusercontent.com/sh-4/Mapping_Earthquakes/main/torontoNeighborhoods.json";

// basic:

// // Grabbing GeoJSON data.
// d3.json(torontoHoods).then(function(data) {
//   console.log(data);
//   // creating a GeoJSON layer with retrieved data
//   L.geoJSON(data).addTo(map);
// });


// stylized with pop-up:

// Create a style for the lines.
let style = {
  color: "blue",
  fillColor: "yellow",
  weight: 1
}
// Grabbing GeoJSON data.
d3.json(torontoHoods).then(function(data) {
  console.log(data);
  // creating a GeoJSON layer with retrieved data
  L.geoJSON(data, {
      style: style,
      onEachFeature: function(feature, layer) {
          console.log(layer);
          layer.bindPopup("<h3>Neighborhood: " + feature.properties.AREA_NAME + "</h3>");
        }
  }).addTo(map);
});