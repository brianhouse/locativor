var map;
var current_location_marker;
var hotspots = [];

function initMap () {
    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/brianhouse.map-124z30te/{z}/{x}/{y}.png'),
        // center: new L.LatLng(42.352455, -71.048069),
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        zoom: 13,
        minZoom: 10,                    
        maxZoom: 17
    });     
    // map.panTo([42.352455, -71.048069]);
    // map.setZoom(17);    
    map.locate({setView: true, watch: true});
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}

function loadMarkers () {
    $.getJSON("markers.json", function(data) {
        var items = [];
        $.each(data, function(index, o) {
            createHotspot(o['latlng'], o['radius'], o['color'], o['content']);
        });
    });    
}

function createHotspot (latlng, radius, color, content) {
    var marker = L.circleMarker(latlng, {radius: radius, clickable: true, color: color}).addTo(map);     
    marker.bindPopup(content, {closeButton: false, autoPan: true});
    hotspots.push([marker, radius]);
}

function onLocationFound (e) {
    var radius = e.accuracy / 2;
    if (current_location_marker == null) {
        current_location_marker = L.marker(e.latlng, {clickable: false}).addTo(map);
    } else {
        current_location_marker.setLatLng(e.latlng);
    }       
    $.each(hotspots, function(index, hotspot) {
        var marker = hotspot[0];
        var radius = hotspot[1];
        var distance = geoDistance(e.latlng, marker.getLatLng());
        console.log(distance);
        if (distance < radius) {
            console.log("TRIGGER");
            marker.openPopup();
        } else {
            console.log(marker);            
            marker.closePopup();
        }
    });       
}

function onLocationError (e) {
    alert(e.message);
}

function geoDistance (latlng1, latlng2) {
    var R = 6371; // km
    var d_lat = (latlng2.lat - latlng1.lat).toRad();
    var d_lng = (latlng2.lng - latlng1.lng).toRad();
    lat1 = latlng1.lat.toRad();
    lat2 = latlng2.lat.toRad();
    var a = Math.sin(d_lat/2) * Math.sin(d_lat/2) + 
            Math.sin(d_lng/2) * Math.sin(d_lng/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return (R * c) * 3280.84; // convert to ft
}

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

// def geo_distance(pt0, pt1, miles=True):
//     """Return the distance between two points, specified (lon, lat), in miles (or kilometers)"""
//     LON, LAT = 0, 1
//     pt0 = math.radians(pt0[LON]), math.radians(pt0[LAT])
//     pt1 = math.radians(pt1[LON]), math.radians(pt1[LAT])
//     lon_delta = pt1[LON] - pt0[LON]
//     lat_delta = pt1[LAT] - pt0[LAT]
//     a = math.sin(lat_delta / 2)**2 + math.cos(pt0[LAT]) * math.cos(pt1[LAT]) * math.sin(lon_delta / 2)**2    
//     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
//     d = 6371 * c # radius of Earth in km
//     if miles:
//         d *= 0.621371192
//     return d

$(document).ready(function() {                   

    loadMarkers();
    initMap();

    // remove a marker
    // track the users location and do something with it in hotspots
    // place hotspot, call up media when within range
    // get it cool on the mobile

    ///

    // recreate morning, evening, night views from openpaths data
    // connect the points with a line
    // follow them                

});