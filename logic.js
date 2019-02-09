
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Function to scale the Magnitude 
  function markerSize(magnitude) {
    return magnitude * 20000;
  };

  function chooseColor(magnitude) {
    if (magnitude > 5) {
      return "red";
    } else if (magnitude > 4) {
      return "lightsalmon";
    } else if (magnitude > 3) {
      return "orange";
    } else if (magnitude > 2) {
      return "gold";
    } else if (magnitude > 1) {
      return "yellowgreen";
    } else {
      return "lightgreen";
    }
  }

 


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    //onEachFeature: onEachFeature,
    //onEachFeature: style
    
      // Give each feature a popup describing with information pertinent to it
      onEachFeature: function(feature, layer){

        layer.bindPopup("<h3 > Magnitude: "+ feature.properties.mag + 
        "</h3><h3>Location: " + feature.properties.place +
        "</h3><hr><h3>" + new Date(feature.properties.time) + "</h3>" );
      },

      pointToLayer: function(feature, latlng){
        return new L.circle(latlng,
        { radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: .8,
          color: 'grey',
          weight: .5
        })
      },
      


    });
  

  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
var div = L.DomUtil.create("div", "info legend");
var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
var colors = ["lightgreen", "yellowgreen", "gold","orange", "lightsalmon", "red"];
var labels = [];

// Add min & max
var legendInfo = "<h1>Magnitude</h1>" +
"<div class=\"labels\">" +
      "<div>" + "&nbsp" + "&nbsp" + limits[0] + "&nbsp" + "&nbsp" + "&nbsp" + limits[1] 
      + "&nbsp" + "&nbsp" + "&nbsp" + "&nbsp" + limits[2] +
      "&nbsp" + "&nbsp" + "&nbsp" + "&nbsp" + "&nbsp" + limits[3] +
      "&nbsp" + "&nbsp" + "&nbsp" +  limits[4] +
      "&nbsp" + "&nbsp" + "&nbsp" + "&nbsp" + limits[5]
      +"</div>"
    "</div>";


div.innerHTML = legendInfo;

limits.forEach(function(limit, index) {
labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
});

div.innerHTML += "<ul>" + labels.join("") + "</ul>";
return div;
};

// Adding legend to the map
legend.addTo(myMap);
}

  


