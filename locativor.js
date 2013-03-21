/* change these to customize your map */
var mapbox_username = "brianhouse";
var mapbox_map_id = "124z30te";
var path_to_data = "hotspots.json";
var show_latlng = true; // show the latlng display - turn this off for your final version

/////

/* global variables */
var map;                     // the map object
var current_location_marker; // dot for the location of the user
var current_marker;          // the marker of the currently activated hotspot
var hotspots = [];           // hotspot data
var narratives = [];         // holder for text data
var images = [];             // holder for image urls

/* create the map */
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
    map.locate({setView: true, watch: true, enableHighAccuracy: true}); // detect current location
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('popupclose', function(e) {
        var marker = e.popup._source;
        if (marker == current_marker) {
            current_marker = null;
        }
    });
}

/* load data file */
function loadMarkers () {
    $.getJSON(path_to_data, function(data) {
        var items = [];
        $.each(data, function(index, o) {
            createHotspot(o['latlng'], o['radius'], o['color'], o['text'], o['image'], o['video']);
        });
    }).error(function(e) { console.log("Failed to load " + path_to_data + ": " + e.statusText); });    
}

/* create hotspots */
function createHotspot (latlng, radius, color, text, image, video) {
    var marker = L.circleMarker(latlng, {radius: feetToPixels(radius), clickable: false, color: color}).addTo(map);
    content = '<div style="width: 160px">';
    if (image != undefined && image.length) {
        images.push('<img src="'+ image + '" style="width: 100%" />');
        content += '<a href="javascript:openImage(' + (images.length - 1) + ');"><img style="width: 160px;" src="' + image + '" /></a>';
    }
    if (text != undefined && text.length) {
        narratives.push(text);
        content += '<a href="javascript:openNarrative(' + (narratives.length - 1) + ');"><img style="width: 160px; height: 90px;" src="text_icon.png" /></a>';
    }
    if (video != undefined && video.length) {
        content += '<iframe style="width: 160; height: 90px;" src="http://player.vimeo.com/video/' + video + '?title=0&amp;byline=0&amp;portrait=0&amp;color=ffff00" webkitAllowFullScreen mozallowfullscreen allowFullScreen ></iframe>';
    }
    content += '</div>';
    marker.bindPopup(content, {closeButton: false, autoPan: true});
    hotspots.push([marker, radius, text, video]);
}

/* when the user's location is found */
function onLocationFound (e) {
    if (show_latlng) {
        // show current lat/lng
        $('#current').html(roundRead(e.latlng.lat) + ", " + roundRead(e.latlng.lng));
    }
    if (current_location_marker == null) {
        // create the user's marker
        current_location_marker = L.circleMarker(e.latlng, {radius: 10, color: "#009dff", stroke: false, fillOpacity: 1.0, clickable: false}).addTo(map);
    } else {
        // move the user's marker
        current_location_marker.setLatLng(e.latlng);
    }       
    // open nearby hotspots
    $.each(hotspots, function(index, hotspot) {
        var marker = hotspot[0];
        var radius = hotspot[1];
        var distance = geoDistance(e.latlng, marker.getLatLng());
        if (distance < radius) {
            if (current_marker != marker) {
                marker.openPopup();
                current_marker = marker;
            }
        }
    });       
}

/* if something goes wrong with finding the user's location */
function onLocationError (e) {
    alert(e.message);
}

/* open the content screens */
function openNarrative (id) {
    $('#narrative #content').html(narratives[id]);
    $('#narrative').show();
}

function openImage (id) {
    $('#image #content').html(images[id]);
    $('#image').show();
}


//// utilities ////

/* calculate the distance between two physical points in ft */
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

function feetToPixels (feet) {
    return feet * 0.29; // leaflet scale and geodistance disagree
}

function roundRead (value) {
    return Math.round(value * 10000) / 10000;
}

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}


/* executes on load */
$(document).ready(function() {
    loadMarkers();
    initMap();
    $('#narrative').hide();
    $('#image').hide();
});

