// Add console.log to check to see if code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// create the second tile layer.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -4.5],
	zoom: 2,
	layers: [streets]
});

// Create a base layer that holds all maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets
};

// d1 - 1. Add a 2nd layer group for the tectonic plate data.
// d2 - 1. Add a 3rd layer group for the major earthquake data.
let allEarthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();

// d1 - 2. Add a reference to the tectonic plates group to the overlays object.
// d2 - 2. Add a reference to the major earthquake group to the overlays object.
let overlays = {
  "All Earthquakes": allEarthquakes,
  "Tectonic Plates": tectonicPlates,
  "Major Earthquakes": majorEarthquakes
};

// add a control to the map that will allow the user to change which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

  // style data for each of the earthquakes plotted on the map. pass the magnitude of the earthquake into a function to calculate the radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // determine the color of the circle based on the magnitude of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {
      return "#ea2c2c";
    }
    if (magnitude > 4) {
      return "#ea822c";
    }
    if (magnitude > 3) {
      return "#ee9c00";
    }
    if (magnitude > 2) {
      return "#eecc00";
    }
    if (magnitude > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  // determine the radius of the earthquake marker based on its magnitude. Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Create a GeoJSON layer with the retrieved data.
  L.geoJson(data, {

    // turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      // console.log(data);
      return L.circleMarker(latlng);
    },

    // set the style for each circleMarker using styleInfo function.
    style: styleInfo,

    // create a popup for each circleMarker to display the magnitude and location of the earthquake
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: " + feature.properties.mag 
        + "<br>Location: " + feature.properties.place);
    }
  }).addTo(allEarthquakes);

  // add earthquake layer to map
  allEarthquakes.addTo(map);
});

// d2 - 3. Retrieve the major earthquake GeoJSON data >4.5 mag for the week.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {

  // d2 - 4. Use the same style as the earthquake data.
  function majorStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: majorColor(feature.properties.mag),
      color: "#000000",
      radius: majorRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // d2 - 5. Change the color function to use three colors for the major earthquakes based on the magnitude of the earthquake.
  function majorColor(magnitude) {
    if (magnitude > 6) {
    return "purple";
    }
    if (magnitude >= 5) {
    return "red";
    }
    if (magnitude < 5) {
    return "skyblue";
    }
  }

  // d2 - 6. Use the function that determines the radius of the earthquake marker based on its magnitude.
  function majorRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // d2 - 7. Creating a GeoJSON layer with the retrieved data that adds a circle to the map, sets the style of the circle, and displays the magnitude and location of the earthquake after the marker has been created and styled.
  L.geoJson(data, {
    
    // Turn each feature into a circleMarker on the map
    pointToLayer: function(feature, latlng) {
      console.log(data);
      return L.circleMarker(latlng);
    },

    // Style each circle with styleInfo() function
    style: majorStyle,

    // Create a popup for the circle to display the magnitude and location of the earthquake
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
          "Magnitude: " + feature.properties.mag 
          + "<br>Location: " + feature.properties.place);
    }

  // d2 - 8. Add the major earthquakes layer to the map.
  }).addTo(majorEarthquakes);

  // d2 - 9. add the major earthquake layer group variable to the map and Close the braces and parentheses for the major earthquake data.
  majorEarthquakes.addTo(map);
});

// Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// add all the details for the legend
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");

  div.innerHTML += "<b>All</b><br>"

  const magnitudes = [0, 1, 2, 3, 4, 5];

  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
  ];

  // Loop through intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] 
      + "'></i> " + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" 
      + magnitudes[i + 1] + "<br>" : "+");
  }
  return div;
};

// add legend to map
legend.addTo(map);

// Create a legend control object.
let majorLegend = L.control({
  position: "bottomright"
});

// add all the details for the legend
majorLegend.onAdd = function() {
  let div = L.DomUtil.create("div", "info majorLegend");

  div.innerHTML += "<b>Major</b><br>"

  const mags = [0, 5, 6];

  const colors = [
    "skyblue",
    "red",
    "purple",
  ];

  // Loop through intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < mags.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] 
      + "'></i> " + mags[i] + (mags[i + 1] ? "&ndash;" 
      + mags[i + 1] + "<br>" : "+");
  }
  return div;
};

// add legend to map
majorLegend.addTo(map);

// d1 - 3. Use d3.json to make a call to get our Tectonic Plate geoJSON data.
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
  // Style the lines with a color and weight that will make it stand out on all maps
  let style = {
    color: "hotpink",
    weight: 3,
  };
  // Pass the tectonic plate data to the geoJSON() layer.
  L.geoJSON(data, {
    // add line styling
    style: style,
  // Add the tectonic layer group variable created in Step 1 to the map
  }).addTo(tectonicPlates);
  
  // add the tectonic layer group variable to the map 
  tectonicPlates.addTo(map);
});
