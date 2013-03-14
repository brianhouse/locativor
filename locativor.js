var mapbox_username = "brianhouse";
var mapbox_map_id = "124z30te";
var path_to_data = "markers.json";
var show_latlng = true;

var map;
var current_location_marker;
var hotspots = [];
var scale;

function initMap () {
    map = new L.map('map', {
        layers: new L.TileLayer("http://a.tiles.mapbox.com/v3/" + mapbox_username + ".map-" + mapbox_map_id + "/{z}/{x}/{y}.png"),
        // center: new L.LatLng(42.352455, -71.048069),
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        zoom: 17,
        minZoom: 17,                    
        maxZoom: 17
    });     
    // map.panTo([42.352455, -71.048069]);
    // map.setZoom(17);    
    map.locate({setView: true, watch: true});
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
}

function loadMarkers () {
    $.getJSON(path_to_data, function(data) {
        var items = [];
        $.each(data, function(index, o) {
            createHotspot(o['latlng'], o['radius'], o['color'], o['content'], o['video']);
        });
    });    
}

function feetToPixels (feet) {
    return feet * 0.29; // leaflet scale and geodistance disagree
}

function createHotspot (latlng, radius, color, content, video) {
    var marker = L.circleMarker(latlng, {radius: feetToPixels(radius), clickable: true, color: color}).addTo(map);     
    if (video != undefined && video.length) {
        content = '<iframe style="width: 160; height: 90px;" title="YouTube video player" src="http://www.youtube.com/embed/uYMOG2lquSE?HD=1;rel=0;showinfo=0;controls=0"></iframe>';
        content = '<iframe style="width: 160; height: 90px;" src="http://player.vimeo.com/video/61742609?title=0&amp;byline=0&amp;portrait=0&amp;color=ffff00" webkitAllowFullScreen mozallowfullscreen allowFullScreen ></iframe>';
    }
    marker.bindPopup(content, {closeButton: false, autoPan: true});
    hotspots.push([marker, radius, video]);
}

function listProperties (obj) {
   var propList = "";
   for(var propName in obj) {
      if(typeof(obj[propName]) != "undefined") {
         propList += (propName + ", ");
      }
   }
   console.log(propList);
}

function roundRead (value) {
    return Math.round(value * 10000) / 10000;
}

function onLocationFound (e) {
    if (show_latlng) {
        $('#current').html(roundRead(e.latlng.lat) + ", " + roundRead(e.latlng.lng));
    }
    if (current_location_marker == null) {
        current_location_marker = L.circleMarker(e.latlng, {radius: 10, color: "#009dff", stroke: false, fillOpacity: 1.0, clickable: false}).addTo(map);
    } else {
        current_location_marker.setLatLng(e.latlng);
    }       
    $.each(hotspots, function(index, hotspot) {
        var marker = hotspot[0];
        var radius = hotspot[1];
        var distance = geoDistance(e.latlng, marker.getLatLng());
        var video = hotspot[2];
        console.log(distance);
        console.log(video);
        if (distance < radius) {
            marker.openPopup();
            // if (video != undefined && video.length) {
            //     window.location = video;
            // }
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

$(document).ready(function() {                   

    loadMarkers();
    initMap();

    // track the users location and do something with it in hotspots
    // place hotspot, call up media when within range
    // get it cool on the mobile

    
});