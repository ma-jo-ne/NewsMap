/**
 * Created by majone on 30.11.15.
 */

function success(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    //alert('Dein Standort: latitude: ' + lat + 'longitude: ' + long);
}

function error(msg) {
    console.log(typeof msg == 'string' ? msg : "error");
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("GeoLocation API ist NICHT verfügbar!");
}

var zoom = 10;

$('input#loc-start-inp').on('input', function (e) {
    if ($(this).val().length >= 0) {
        var searchResults = [];

        $.ajax({
            url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + $("#loc-start-inp").val(),

        }).done(function (data) {
            searchResults = data;
            console.log(data)
            $("#autocomplete").empty();
            $.each(data, function (key) {

                var display_name = data[key]["display_name"],
                    $li = $("<li>");
                console.log(display_name)

                $li.attr("index", key).html(display_name);
                $("#autocomplete").append($li);
            });
            $("#autocomplete li").on("click", function () {
                var index = $(this).attr("index"),
                    lat = searchResults[index]["lat"],
                    lon = searchResults[index]["lon"];
                //map.setView(new L.LatLng(lat, lon), 12);
                console.log(searchResults[index]);
            });
        });
    }
});
