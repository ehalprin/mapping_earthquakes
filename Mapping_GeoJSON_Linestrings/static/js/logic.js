// Create the tile layer that will be the background of the map
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps
let baseMaps = {
    Light: light,
    Dark: dark
};

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
    center: [44.0, -80.0],
    zoom: 2,
    layers: [light]
});

// Pass our map layers into our layers control and add the layers control to the map
L.control.layers(baseMaps).addTo(map);

// Accessing the Toronto airline routes GeoJSON URL
let torontoData = "https://raw.githubusercontent.com/ehalprin/mapping_earthquakes/Mapping_GeoJSON_LineStrings/torontoRoutes.json";

// Create a style for the lines
let myStyle = {
    color: "magenta",
    weight: 2
}

// Grabbing our GeoJSON data
d3.json(torontoData).then(function(data) {
    console.log(data);
    // Creating a GeoJSON layer with the retrieved data
    L.geoJSON(data, {
        style: myStyle,
        onEachFeature: function(feature, layer) {
        layer.bindPopup("<h2>To destination " + feature.properties.dst + " on airline " + feature.properties.airline + "</h2>");
    }}).addTo(map);
})

