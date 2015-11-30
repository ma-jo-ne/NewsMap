/**
 * Created by majone on 30.11.15.
 */

function success(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    alert('Dein Standort: latitude: ' + lat + 'longitude: ' + long);
}

function error(msg) {
    console.log(typeof msg == 'string' ? msg : "error");
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("GeoLocation API ist NICHT verfügbar!");
}