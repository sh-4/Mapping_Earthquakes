// Create the map object with a center and zoom level.
// // the center is at approximate center of the US
// let map = L.map('mapid').setView([40.7, -94.5], 14);

// // the center is at approximate center of LA, CA
let map = L.map('mapid').setView([34.0522, -118.2437], 14);

// add a circle marker to the map for Los Angeles, California.
 L.circleMarker([34.0522, -118.2437], {
    radius: 300,
    color: "black",
    fillColor: "#ffffa1"
 }).addTo(map);

// create the tile layer that will be the background of the map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
// add the 'streets' tile layer to the map.
streets.addTo(map);