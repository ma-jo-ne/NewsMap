NewsMap.DrawMap = (function () {
        var marker = [],
            articles = [],
            markers = new L.MarkerClusterGroup(),
            markersSet = false,
            searchSelect = null,

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
                drawmap();

                return this;
            },

            getArticles = function () {
                $.ajax({
                    type: "GET",
                    url: "http://" + location.host + "/NewsMap/get_data.php",
                    data: {func: "article"},
                    success: function (data) {
                        if (data.length == 0) {
                            console.log("Keine Ergebnisse");
                        }
                        else

                            addMarker(JSON.parse(data));
                        foundArticles = JSON.parse(data);


                    },
                    error: function () {
                        alert("error");
                    }
                });
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
                getArticles();
            },

            addMarker = function (data) {
                //map.setView(new L.LatLng(data[data.length - 1].lat, data[data.length - 1].lat));
                if (!markersSet) {

                    markers.clearLayers();

                    for (i = 0; i < data.length; i++) {
                        var marker = L.marker([data[i].lat, data[i].lon]);
                        var markerPopup = "<div class='marker-popup' data-id='" + data[i].post_id + "' ><h3 class='marker-title'>" + data[i].title + "</h3></div>";

                        marker.bindPopup(markerPopup);
                        $(markerPopup).attr("id", data[i].post_id);
                        markers.addLayer(marker); // push funktioniert nicht mehr seit Cluster Plugin verwendet, da markers = new L.MarkerClusterGroup()

                    }
                    map.addLayer(markers);
                    console.log("markers set");


                    markersSet = true;
                }
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
                        getArticleByTag($('#tag-search-input').val().toLowerCase());
                        $("#autocomplete").empty();
                        return false;    //<---- Add this line
                    }
                });


            },

            tagSearchClicked = function () {
                getArticleByTag($('#tag-search-input').val().toLowerCase());
            },

            autocomplete = function () {
                $('#tag-search-input').on('input', function (e) {
                    $("#autocomplete").empty();
                    var min_length = 1; // min caracters to display the autocomplete
                    var keyword = $('#tag-search-input').val();
                    if (keyword.length == 0) {
                        $("#autocomplete").hide();
                    }
                    if (keyword.length >= min_length) {
                        var selectedFunction;

                        switch (searchSelect) {
                            case "tag":
                                selectedFunction = "tagAuto";
                                break;
                            case "location":
                                selectedFunction = "locAuto";
                                break;
                            case "title":
                                selectedFunction = "titleAuto";
                                break;
                        }

                        $.ajax({
                            url: "http://" + location.host + "/NewsMap/get_data.php",
                            type: 'GET',
                            data: {func: selectedFunction, keyword: keyword},
                            success: function (data) {
                                $("#autocomplete").empty();
                                var parsedData = JSON.parse(data);
                                $("#autocomplete").show();
                                $.each(parsedData, function (key) {
                                    var display_name;
                                    if(selectedFunction == "tagAuto") {
                                        display_name = parsedData[key].name;
                                    }
                                    else if (selectedFunction == "locAuto") {
                                        display_name = parsedData[key].city;
                                    }
                                    else if (selectedFunction == "titleAuto") {
                                        display_name = parsedData[key].title;
                                    }
                                    var $li = $("<li>");
                                    $li.attr("index", key).html(display_name);
                                    $("#autocomplete").append($li);
                                });
                                $("#autocomplete li").on("click", function () {
                                    $("#tag-search-input").val($(this).html());
                                    if(selectedFunction == "tagAuto") {
                                        getArticleByTag($('#tag-search-input').val());
                                    }
                                    else if (selectedFunction == "locAuto") {
                                        console.log("noch nicht implementiert");
                                    }
                                    else if (selectedFunction == "titleAuto") {
                                        console.log("noch nicht implementiert");
                                    }
                                    $("#autocomplete").empty();
                                    $("#autocomplete").hide();
                                });
                            }
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
                if (foundArticles.length == 0)
                    alert("Keine Ergebnisse für " + selectedLocation + " gefunden");
                else {
                    addMarker();
                }
            },

            getArticleByTag = function (selectedTag) {
                $.ajax({
                    type: "GET",
                    url: "http://" + location.host + "/NewsMap/get_data.php",
                    data: {func: "tag", tag: selectedTag},
                    success: function (data) {
                        if (data.length == 0) {
                            console.log("Keine Ergebnisse");
                        }
                        else
                            console.log("TAG-SUCHE: SQL-AJAX-Ergebnisse", JSON.parse(data));
                        markersSet = false;
                        addMarker(JSON.parse(data));
                    },
                    error: function () {
                        alert("error");
                    }
                });
            },

            findArticlesByTitle = function (selectedTitle) {
                console.log(selectedTitle);
                foundArticles = [];
                for (var i = 0; i < articles.length; i++) {
                    var currentArticleTitle = articles[i]["title"].toLowerCase();
                    if (wordInString(selectedTitle, currentArticleTitle)) {
                        foundArticles.push(currentArticleTitle);
                    }
                }
                console.log(foundArticles);
                if (foundArticles.length == 0)
                    alert("Keine Ergebnisse für " + selectedTitle + " gefunden");
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

            _getArticle = function (articleID) {
                for (var i = 0; i < foundArticles.length; i++) {
                    if (articleID == foundArticles[i].post_id) {
                        return foundArticles[i];
                    }
                }
                return "0";
            },

            _bundleMarkers = function () {
                // console.log("some shit");

            },

            showShareOptions = function () {
                $("#menu-left").hide();
                $("#share-menu").toggle();

                //popUp in mitte des Fensters anzeigen, dort zur Auswahl "Outlook versenden" "link kopieren" "auf Facebook posten"
            },

            selectChanged = function () {
                searchSelect = $("#search-select").val();
                console.log(searchSelect);
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
                map.addLayer(markers);
                myLocationMarker.bindPopup("<div class='marker-popup'><h3 class='marker-title'>Ihr Standort!</h3></div>").openPopup();
            };


        /*
         return article by goiven articleID
         */
        that.showShareOptions = showShareOptions;
        that._setLocation = _setLocation;
        that._getArticle = _getArticle;
        that.tagSearchClicked = tagSearchClicked;
        that.selectChanged = selectChanged;
        that.init = init;

        return that;
    }
    ()
)
;





