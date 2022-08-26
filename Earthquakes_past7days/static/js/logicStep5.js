// Create the tile layer that will be the background of the map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create a base layer that holds both maps
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets
};

// Create the earthquake layer
let earthquakes = new L.layerGroup();

// Define an object that contains the overlays
let overlays = {
    Earthquakes: earthquakes
};

// Create the map object with a center and zoom level.
let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the Toronto neighborhoods GeoJSON URL
let earthquakes_past7days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing our GeoJSON data
d3.json(earthquakes_past7days).then(function(data) {
    // Get the style data for each earthquake
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    // Function to determine the color of the circle based on magnitude
    function getColor(magnitude) {
        if (magnitude > 5) {
            return "DarkRed";
        }
        if (magnitude > 4) {
            return "DeepPink";
        }
        if (magnitude > 3) {
            return "HotPink";
        }
        if (magnitude > 2) {
            return "Pink";
        }
        if (magnitude > 1) {
            return "LightPink";
        }
        return "MistyRose"
    }
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4; 
    }
    // Creating a GeoJSON layer with the retrieved data
    L.geoJSON(data, {
        // Turn each feature into a circleMarker
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Set the style
        style: styleInfo,
        // Createa  popup for each marker
        onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }}).addTo(earthquakes);

    // Then add the earthquake layer to ou rmap
    earthquakes.addTo(map);

    // Create a legend control object
    var legend = L.control({position: 'bottomright'});

    // Then add all the details for the legend
    legend.onAdd = function () {
    
        var div = L.DomUtil.create('div', 'info legend');
            const magnitudes = [0, 1, 2, 3, 4, 5];
            const colors = ["MistyRose", "LightPink", "Pink", "HotPink", "DeepPink", "DarkRed"];
    
        // loop through our intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magnitudes.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(map);
})

