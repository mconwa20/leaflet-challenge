 // Define darkmap layer
var darkmap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", 
  {
    maxZoom: 18,
    tileSize: 512,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  }
);

// Create our map, giving it the streetmap and earthquakes layers to display on load
var map = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5,
});

darkmap.addTo(map);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  function quakeStyle(feature) {
    return {
      opacity: 1.5,
      fillOpacity: 1,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  } 

  function markerColor(depth) {
    switch(true) {
      case depth > 60:
        return "#FE3004"
      case depth > 40:
        return "#FEA404";
      case depth > 20:
        return "#FEED04";
    }
  }

  function markerRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 10;
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style:quakeStyle,
    }).addTo(map);
});