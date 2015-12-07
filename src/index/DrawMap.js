NewsMap.DrawMap = (function () {
    var that = {},
        map = null,

        init = function () {
            console.log("DrawMap");

            drawmap();
            autocomplete();

            return this;
        },

        drawmap = function () {
            load_map();
            map.remove();
            window.onload = load_map;
        },

        load_map = function () {
            map = new L.Map('map', {zoomControl: false});

            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

            map.setView(new L.LatLng(49.0134074, 12.101631), 10).addLayer(osm);

            //hier wird ein beispielmarker gesetzt
            var barttacke = L.marker([49.0134074, 12.101631]).addTo(map);
            var mopat = L.marker([48.8777333, 12.5801538]).addTo(map);

            //und hier ein popup zu diesem marker hinzugefügt
            barttacke.bindPopup("<div class='marker-popup'><b class='marker-title'>Barttacke</b><p><img class='popupPic' src=\"img/barttacke.jpg\" width=\"50\" height=\"20\"></p></div>").openPopup();
            mopat.bindPopup("<div class='marker-popup'><h3 class='marker-title'>Digitales Gründerzentrum: Zwei Standorte in Oberfranken geplan</h3></div>").openPopup();

        },

        autocomplete = function () {
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
                            $li.attr("index", key).html(display_name);
                            $("#autocomplete").append($li);
                        });
                        $("#autocomplete li").on("click", function () {
                            var index = $(this).attr("index"),
                                lat = searchResults[index]["lat"],
                                lon = searchResults[index]["lon"];
                            map.setView(new L.LatLng(lat, lon));
                            console.log(searchResults[index]);
                        });
                    });
                }
            });
        },

        _setLocation = function (lat, long) {
            map.setView(new L.LatLng(lat, long));
        };

    that._setLocation = _setLocation;
    that.init = init;

    return that;
}());





