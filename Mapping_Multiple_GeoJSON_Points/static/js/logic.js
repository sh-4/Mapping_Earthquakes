// Create the map object with a center and zoom level.
// the center is at approximate geographical center of the Earth
let map = L.map('mapid').setView([30, 30], 2);

// create the tile layer that will be the background of the map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// add the 'streets' tile layer to the map.
streets.addTo(map);

// Accessing the airport GeoJSON URL
let airportData = "https://raw.githubusercontent.com/sh-4/Mapping_Earthquakes/main/majorAirports.json";

// // Grabbing our GeoJSON data.
// d3.json(airportData).then(function(data) {
//     console.log(data);
//   // Creating a GeoJSON layer with the retrieved data.
//   L.geoJSON(data).addTo(map);
// });

// Grabbing our GeoJSON data
d3.json(airportData).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {
    // turn each feature into a marker on the map.
    onEachFeature: function(feature, layer) {
      console.log(layer);
      layer.bindPopup("<h3> Airport Name: " + feature.properties.name + "</h3><hr><h3>Airport Code: " + feature.properties.faa + "</h3>");
    }
  }).addTo(map);
});