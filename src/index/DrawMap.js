NewsMap.DrawMap = (function () {
    var marker = new Array();
    var articles = new Array();
    var that = {},
        map = null,

        init = function () {

            autocomplete();

            var $xml;
            var newsDataObjects = [];
            $.ajax({
                type: "GET",
                url: "http://" + location.host + "/NewsMap/xml/lokalreporter.wordpress.2016-01-20.xml",
                dataType: "xml",
                success: function (xml) {
                    $xml = $(xml);
                    var dataObject = new DataObjectFactory();
                    var $item = $xml.find("item");
                    $item.each(function (index) {
                        var $title = $(this).find("title").text(),
                            $link = $(this).find("link").text(),
                            $pubDate = $(this).find("pubDate").text(),
                            $content = $(this).find("encoded").text(),
                            $postId = $(this).find("post_id").text(),
                            $categories = [];
                        $(this).find("category").each(function (i, el) {
                            $categories.push($(el).text());
                        });


                        /*
                         Problem: Aufbau der Kategorien ist nicht immer gleich. haben verschieden Längen;
                         indizes sind auch verschieden, also index 1 ist nicht immer ort, sondern auch kategorie etc.
                         */
                        var newsData = {
                            title: $title,
                            link: $link,
                            pubData: $pubDate,
                            content: $content,
                            categories: $categories,
                            postId: $postId,
                            exists: false,
                            city: "none"
                        };
                        var newsDataObject = dataObject.createDataObject(newsData);
                        newsDataObjects.push(newsDataObject);

                    });
                    $(newsDataObjects).each(function (i) {
                        //  console.log(this);
                    });
                    $.ajax({
                        type: "GET",
                        url: "http://" + location.host + "/NewsMap/json/lokalreporter_geonames.json",
                        datatype: "JSON",
                        success: function (json) {
                            $(newsDataObjects).each(function (i) {
                                if (json["articles"][this.postId]) {
                                    {
                                        this.exists = true;
                                        this.city = json["articles"][this.postId]["name"];
                                        this.region = json["articles"][this.postId]["region"];
                                        this.county = json["articles"][this.postId]["county"];
                                        this.municipality = json["articles"][this.postId]["municipality"];
                                        this.lat = json["articles"][this.postId]["coords"]["lat"];
                                        this.lon = json["articles"][this.postId]["coords"]["lon"];
                                        // console.log(this);
                                    }
                                    articles.push(this);
                                }
                            });
                            console.log(articles);
                        },
                        error: function () {
                            alert("ERROR loading JSON");
                        }
                    });
                },
                error: function () {
                    alert("ERROR loading XML");
                }
            });
            drawmap();

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

            if (articles[0] != undefined) {
                var marker1 = L.marker([articles[0][420].coords.lat, articles[0][420].coords.lon]).addTo(map);
                var marker2 = L.marker([articles[0][423].coords.lat, articles[0][423].coords.lon]).addTo(map);
                var marker3 = L.marker([articles[0][928].coords.lat, articles[0][928].coords.lon]).addTo(map);
            }


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
                            $("#selected-location").html($(this).html());
                            $('input#loc-start-inp').val("");
                            $("#autocomplete").empty();
                            var index = $(this).attr("index"),
                                lat = searchResults[index]["lat"],
                                lon = searchResults[index]["lon"];

                            _setLocation(lat, lon);
                            //console.log(searchResults[index]);
                            $("#selected-location").show();
                            $(that).trigger("locationClicked");
                        });
                    });
                }
            });
        },

        _setLocation = function (lat, long) {

            // Removing old markers
            for (i = 0; i < marker.length; i++) {
                map.removeLayer(marker[i]);
            }
            map.setView(new L.LatLng(lat, long));

            var myLocationIcon = L.icon({
                iconUrl: 'img/mylocationicon.png',
                iconSize: [50, 50], // size of the icon
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -100] // point from which the popup should open relative to the iconAnchor
            });

            var myLocationMarker = L.marker([lat, long], {icon: myLocationIcon});
            marker.push(myLocationMarker);
            map.addLayer(marker[marker.length - 1]);
            myLocationMarker.bindPopup("<div class='marker-popup'><h3 class='marker-title'>Ihr Standort!</h3></div>").openPopup();
        };

    that._setLocation = _setLocation;
    that.init = init;

    return that;
}());





