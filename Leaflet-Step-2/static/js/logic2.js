// logic2.js is for second case showing both earthquake and faultlines

// Assign the earthquake data url
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// console.log (earthquake_url)

// Assign the tectonic plates data url
var plate_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Function to scale marker size 
function markerSize(magnitude) {
    return magnitude * 4;
};

// Set earthquake layer group 
var earthquake = new L.LayerGroup();

d3.json(earthquake_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: colorScale(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquake);
    createMap(earthquake);
});

// Set fault lines layer group 
var faultLines = new L.LayerGroup();

d3.json(plate_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'blue'
            }
        },
    }).addTo(faultLines);
})

// Function to generate color scale
function colorScale(magnitude) {
    if (magnitude > 5) {
        return '#FF8C00'
    } else if (magnitude > 4) {
        return 'red'
    } else if (magnitude > 3) {
        return 'darkorange'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'yellowgreen'
    } else {
        return 'green'
    }
};

// Function createMap for multiple map layers
function createMap() {
   
    // Basemap Layer
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
    var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });
    var dark = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });
    
    // Base Layer object for select map types
    var baseLayer = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors,
        "Dark": dark       
    };

    // Overlay object
    var overlay = {
        "Fault Lines": faultLines,
        "Earthquakes": earthquake
    };

    // Map object
    var myMap = L.map('map', {
        center: [37.8968, -119.5828],
        zoom: 3.5,
        layers: [satellite, earthquake, faultLines]        
    });

    L.control.layers(baseLayer, overlay, {
      collapsed: false
    }).addTo(myMap);
 
    // Create legend
    var info = L.control({
      position: 'bottomright'
    });

    // Insert 'legend' div when layer control is added
    info.onAdd = function(){
      labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<h4>Magnitude</h4>'
      for (var i = 0; i <= 5; i++) {
        div.innerHTML += '<p><span style="font-size:22px; background-color:' + colorScale(i) +
          ';">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' + labels[i] + '</p>';
      }
    
      return div;
    };

    // Legend added to the map
    info.addTo(myMap);

  }
