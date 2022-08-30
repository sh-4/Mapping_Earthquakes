// Create the map object with a center and zoom level.
// // the center is at approximate center of the US
let map = L.map('mapid').setView([40.7, -94.5], 4);

// the center at the San Francisco airport
// let map = L.map('mapid').setView([37.6213, -122.3790], 5);

// Coordinates for each point to be used in the polyline.
let line = [
    [33.9416, -118.4085],   // LAX
    [37.6213, -122.3790],   // SFO
    [40.7899, -111.9791],   // SLC
    [47.4502, -122.3088]    // SEA
  ];

// Create a polyline using the line coordinates and make the line yellow.
L.polyline(line, {
    color: "green"
 }).addTo(map);

// airline route from SFO to JFK
let blueline = [
    [37.6213, -122.3790],   // SFO
    [30.1934,-97.6650],     // AUS
    [43.6785,-79.6291],     // YYZ
    [40.7418,-73.9893]      // JFK
    ];
    
// polyline with blue dashed line
L.polyline(blueline, {
    color: "blue",
    weight: 4,
    opacity: 0.5,
    dashArray: '5, 10'
    }).addTo(map);

// create the tile layer that will be the background of the map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// add the 'streets' tile layer to the map.
streets.addTo(map);