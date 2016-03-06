NewsMap.DrawMap = (function () {
    var marker = [],
        articles = [],
        markers = [],
        articlesLoaded = false,
        that = {},
        map = null,
        newsDataObjects = [],
        foundArticles = [],

        wordInString = function (s, word) {
            return new RegExp('\\b' + word.toLowerCase() + '\\b', 'i').test(s.toLowerCase());
        },

        init = function () {
            function isInArray(value, array) {
                return array.indexOf(value) > -1;
            }

            autocomplete();
            enterListen();

            var $xml;
            $.ajax({
                type: "GET",
                url: "http://" + location.host + "/NewsMap/xml/lokalreporter.wordpress.2016-01-20.xml",
                dataType: "xml",
                success: function (xml) {
                    $xml = $(xml);
                    var dataObject = new DataObjectFactory();
                    var $item = $xml.find("item");
                    var $allTags = [];
                    $item.each(function (index) {

                        var $title = $(this).find("title").text(),
                            $link = $(this).find("link").text(),
                            $pubDate = $(this).find("pubDate").text(),
                            $content = $(this).find("encoded").text(),
                            $postId = $(this).find("post_id").text(),
                            $categories = [],
                            $tags = [];
                        $(this).find("category").each(function (i, el) {
                            var text = $(el).text().toLowerCase();
                            $categories.push(text.trim());
                            if ($(el).text() != "Allgemein" && !isInArray(text, $tags)) {
                                $tags.push(text);
                                if (isInArray(text, $tags)) {
                                    $allTags.push(text);
                                }
                            }
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
                            tags: $tags,
                            postId: $postId,
                            exists: false,
                            city: "none"
                        };
                        var newsDataObject = dataObject.createDataObject(newsData);
                        newsDataObjects.push(newsDataObject);

                    });
                    //Remove Duplicates
                    var uniqueTags = [];
                    $.each($allTags, function (i, el) {
                        if ($.inArray(el, uniqueTags) === -1) uniqueTags.push(el);
                    });
                    uniqueTags.sort();
                    /*   $(newsDataObjects).each(function (i) {
                     console.log(this);
                     });*/
                    /*
                     check if geodata for article exists, if true -> build objects
                     */
                    $.ajax({
                        type: "GET",
                        url: "http://" + location.host + "/NewsMap/json/lokalreporter_geonames.json",
                        datatype: "JSON",
                        success: function (json) {
                            $(newsDataObjects).each(function (i) {
                                /*
                                 add additional info to object
                                 */
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
                            foundArticles = articles;
                            console.log(foundArticles);
                            articlesLoaded = true;
                            addMarker();
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

        },

        addMarker = function () {
            //hier wird ein beispielmarker gesetzt
            // var barttacke = L.marker([49.0134074, 12.101631]).addTo(map);
            // var mopat = L.marker([48.8777333, 12.5801538]).addTo(map);
            for (i = 0; i < markers.length; i++) {
                map.removeLayer(markers[i]);
            }
            map.setView(new L.LatLng(foundArticles[foundArticles.length - 1]["lat"], foundArticles[foundArticles.length - 1]["lon"]));

            if (articlesLoaded) {
                for (i = 0; i < foundArticles.length; i++) {
                    var marker = L.marker([foundArticles[i].lat, foundArticles[i].lon]).addTo(map);
                    var markerPopup = "<div class='marker-popup' data-id='" + foundArticles[i].postId + "' ><h3 class='marker-title'>" + foundArticles[i]["title"] + "</h3></div>";

                    marker.bindPopup(markerPopup);
                    $(markerPopup).attr("id", foundArticles[i].postId);
                    markers.push(marker);
                }
            }


            //und hier ein popup zu diesem marker hinzugefügt
            //barttacke.bindPopup("<div class='marker-popup'><b class='marker-title'>Barttacke</b><p><img class='popupPic' src=\"img/barttacke.jpg\" width=\"50\" height=\"20\"></p></div>").openPopup();
            //mopat.bindPopup("<div class='marker-popup'><h3 class='marker-title'>Digitales Gründerzentrum: Zwei Standorte in Oberfranken geplan</h3></div>").openPopup();

        },

        enterListen = function () {
            $('input#loc-start-inp').keypress(function (e) {
                if (e.which == 13) {
                    findArticlesByLocation($('input#loc-start-inp').val());
                    $("#autocomplete").empty();
                    return false;    //<---- Add this line
                }
            });

            $('#tag-search-input').keypress(function (e) {
                if (e.which == 13) {
                    findArticlesByTag($('#tag-search-input').val());
                    //$("#autocomplete").empty();
                    return false;    //<---- Add this line
                }
            });


        },

        tagSearchClicked = function() {
            findArticlesByTag($('#tag-search-input').val());
        },

        autocomplete = function () {
            $('input#loc-start-inp').on('input', function (e) {
                if ($(this).val().length >= 0) {
                    var searchResults = [];

                    $.ajax({
                        url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + $("#loc-start-inp").val()

                    }).done(function (data) {
                        searchResults = data;
                        $("#autocomplete").empty();
                        $.each(data, function (key) {

                            var display_name = data[key]["display_name"],
                                $li = $("<li>");
                            $li.attr("index", key).html(display_name);
                            $("#autocomplete").append($li);
                        });
                        $("#autocomplete li").on("click", function () {
                            $("#selected-location").html($(this).html());
                            findArticlesByLocation($('input#loc-start-inp').val());
                            // $('input#loc-start-inp').val("");
                            $("#autocomplete").empty();
                            var index = $(this).attr("index"),
                                lat = searchResults[index]["lat"],
                                lon = searchResults[index]["lon"];

                            //_setLocation(lat, lon);
                            //console.log(searchResults[index]);
                            $("#selected-location").show();
                            $(that).trigger("locationClicked");
                        });
                    });
                }
            });
        },

    /*
     foundArticles by Locationsearch / inputfield
     */
        findArticlesByLocation = function (selectedLocation) {
            foundArticles = [];
            for (var i = 0; i < articles.length; i++) {
                var currentArticle = articles[i],
                    city = currentArticle["city"],
                    county = currentArticle["county"],
                    region = currentArticle["region"],
                    municipality = currentArticle["municipality"];
                if (wordInString(selectedLocation, city) || wordInString(selectedLocation, county) || wordInString(selectedLocation, region) || wordInString(selectedLocation, municipality)) {
                    foundArticles.push(currentArticle);
                }
            }
            console.log(foundArticles);
            if (foundArticles.length == 0)
                alert("Keine Ergebnisse für " + selectedLocation + " gefunden");
            else {
                addMarker();
            }
        },

        findArticlesByTag = function (selectedTag) {
            console.log(selectedTag);
            foundArticles = [];
            for (var i = 0; i < articles.length; i++) {
                var currentArticle = articles[i];
                var tag;
                for (var k = 0; k < articles[i].tags.length; k++) {
                    tag = articles[i].tags[k];
                    console.log(tag);
                    if (wordInString(selectedTag, tag) ) {
                        foundArticles.push(currentArticle);
                    }
                }
            }
            console.log(foundArticles);
            if (foundArticles.length == 0)
                alert("Keine Ergebnisse für " + selectedTag + " gefunden");
            else {
                addMarker();
            }
        },

    /*
     compare string similarity
     UNUSED
     */
        stringSimilarity = function (a, b) {
            for (var result = 0, i = a.length; i--;) {
                if (typeof b[i] == 'undefined' || a[i] == b[i]);
                else if (a[i].toLowerCase() == b[i].toLowerCase())
                    result++;
                else
                    result += 4;
            }
            return 1 - (result + 4 * Math.abs(a.length - b.length)) / (2 * (a.length + b.length));
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
        },


    /*
     return article by goiven articleID
     */
        _getArticle = function (articleID) {
            for (var i = 0; i < foundArticles.length; i++) {
                if (articleID == foundArticles[i].postId) {
                    return foundArticles[i];
                }
            }
            return "0";
        };

    that._setLocation = _setLocation;
    that._getArticle = _getArticle;
    that.tagSearchClicked = tagSearchClicked;
    that.init = init;

    return that;
}());





