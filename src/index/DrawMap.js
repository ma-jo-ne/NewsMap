NewsMap.DrawMap = (function () {
    var marker = [],
        that = {},
        articles = [],
        markers = new L.MarkerClusterGroup(),
        markersSet = false,
        searchSelect = $("#search-select").val(),
        $dateSelect = $("#date-select"),
        dateSelectionVal = $dateSelect.val(),
        radiusSelect = $("#radius-select"),
        myLocation = null,
        $loading = null,
        $autoComplete = null,
        initLoading = true,
        favorites = [],
        favoritesVisible = false,
        lastData = [],
        tempData = [],
        searchQueries = [],
        myLat,
        myLng,
        tempLat,
        tempLon,


        map = null,
        newsDataObjects = [],
        foundArticles = [],
        foundArticlesBySearch = [],

        wordInString = function (s, word) {
            return new RegExp('\\b' + word.toLowerCase() + '\\b', 'i').test(s.toLowerCase());
        },

        init = function () {
            function isInArray(value, array) {
                return array.indexOf(value) > -1;
            }

            $loading = $("#loading");
            $autoComplete = $("#autocomplete");

            $(document).ready(function () {
                dateSelection();
                autocomplete();
                enterListen();
                drawmap();
                checkFavorites();
            });

            return this;
        },


        getAllArticles = function () {
            foundArticles = [];
            $.ajax({
                type: "GET",
                url: "http://" + location.host + "/NewsMap/get_data.php",
                data: {func: "article", date: dateSelectionVal},
                beforeSend: function () {
                    $loading.show();
                },
                success: function (data) {
                    if (JSON.parse(data).length == 0) {
                        alert("Keine Ergebnisse zu Ihrer Anfrage gefunden");
                        console.log("Keine Ergebnisse");
                    }
                    else {
                        markersSet = false;
                        foundArticles = JSON.parse(data);
                        addMarker(foundArticles);

                    }

                },
                error: function () {
                    alert(null, "error");

                },
                complete: function () {
                    $loading.hide();
                }
            });
        },


        drawmap = function () {
            window.onload = load_map;
        },

        load_map = function () {
            map = new L.Map('map', {zoomControl: false});


            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttribution = 'Map data &copy; 2016 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

            map.setView(new L.LatLng(48.9533, 11.3973), 8).addLayer(osm);

            getAllArticles();
        },

        addMarker = function (data) {
            if (!favoritesVisible) {
                lastData = data;
            }

            if (!markersSet) {

                markers.clearLayers();


                for (i = 0; i < data.length; i++) {


                    if (radiusSelect.val() == 6666 || calculateDistance(myLat, myLng, data[i].lat, data[i].lon) < radiusSelect.val()) {
                        tempData.push(data[i]);


                        var marker = L.marker([data[i].lat, data[i].lon]);
                        $(marker).attr("data-id", data[i].post_id);
                        var markerPopup = "<div class='marker-popup' data-id='" + data[i].post_id + "' ><h3 class='marker-title'>" + data[i].title + "</h3></div>";

                        marker.bindPopup(markerPopup);

                        $(markerPopup).attr("id", data[i].post_id);

                        markers.addLayer(marker);
                    }
                }
                if(markers != null && map != null) {
                    map.addLayer(markers);
                }
                if (initLoading) {

                    map.setView(new L.LatLng(48.9533, 11.3973));
                    map.setZoom(8);
                    initLoading = false;
                }
                else {
                    map.setView(new L.LatLng(data[data.length - 1].lat, data[data.length - 1].lon));
                }

                setChronoView(tempData);
                tempData.length = 0;
                markersSet = true;


            }
            map.on('popupopen', function (e) {
                $(".marker-popup").dotdotdot();

            });
        },

        enterListen = function () {

            $('#tag-search-input').keypress(function (e) {
                if (e.which == 13) {
                    getArticle($('#tag-search-input').val().toLowerCase(), searchSelect);
                    $autoComplete.empty().hide();
                    return false;    //<---- Add this line
                }
            });


        },

        getLatLonFromCity = function () {
            /*
             $.ajax({
             url: "http://nominatim.openstreetmap.org/search?format=xml&q=gerolsbach",
             type: 'GET',
             success: function (data) {
             var parsedData = $.parseXML(data);
             $data=$(parsedData);
             $lati = $data.find()
             console.log(parsedData);
             }});
             */
        },


        calculateDistance = function (lat1, lon1, lat2, lon2) {


            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;


            function deg2rad(deg) {
                return deg * (Math.PI / 180)
            }

        },

        setChronoView = function (data) {

            $(".accordion-navigation").remove();
            //$(document).foundation()

            var EIDI,
                artikelTitel,
                artikelLink,
                accord,
                artikelOrt,
                artikelRegion,
                pubDate,
                region;
            for (i = 0; i < data.length; i++) {

              //  if (i != 0 && data[i - 1].title != data[i].title) {  //|| data.length == 2 mit in schleife ?
                    EIDI = "a" + i;
                    artikelTitel = data[i].title;
                    artikelLink = data[i].link;
                    artikelOrt = data[i].city;
                    pubDate = data[i].pub_date;
                    region = data[i].region;
                    accord = $('<li class="accordion-navigation">' +
                        '<a class="accordItem" href="#' + EIDI + '">' + '<div class="chronoPubDate" >' + pubDate + '</div>' + artikelTitel + '</a>' +
                        '<div' + ' id="' + EIDI + '" class="accordDiv content disabled">' + artikelOrt + ',' + region + '<br/><a href="' + artikelLink + '" id="' + EIDI + '" class="content" target="_blank">' +

                        '<i class="fi-arrow-right"> </i>zum Artikel</a>' +
                        '</div> </li>');

                    $("#chrono-wrapper").append(accord);
                    $("#chrono-wrapper").css("position", "absolute");
                    $("#chrono-wrapper").css("width", "100%");

            }
            $(document).foundation();
        },

        tagSearchClicked = function () {
            var query = ($('#tag-search-input').val());

            var selectedFunction;

            if (searchSelect == "location") {
                selectedFunction = "locAuto";
            }
            else if (searchSelect == "title") {
                selectedFunction = "titleAuto";
            }

            else if (searchSelect == "region") {
                selectedFunction = "regAuto";
            }
            else if (searchSelect == "tag") {
                selectedFunction = "tagAuto";
            }

            var queryItem = [query, selectedFunction];

            var queryExists = false;
            for (var i = 0; i < searchQueries.length; i++) {
                var obj = searchQueries[i];
                if (obj[0].toLowerCase() == queryItem[0].toLowerCase() && obj[1] == queryItem[1]) {
                    swal("Suchanfrage existiert bereits");
                    queryExists = true;
                    return false;
                }
            }
            if (!queryExists) {
                searchQueries.push(queryItem);

                var $queryLi = $("<li class='query-item'>");

                var $queryClose = $("<i class='fi-x remove-query'>");
                $queryLi.html(query);
                $($queryLi).append($queryClose);
                $($queryLi).attr('data-show', query);

                if (query != "") {
                    $("#search-queries").append($queryLi);
                }

                getArticleByQuery();
            }
            $('#autocomplete').empty().hide();
        },


        autocomplete = function () {

            $('#tag-search-input').on('input', function (e) {
                $autoComplete.empty().show();
                $(that).trigger("setAutocompletePosition");
                var min_length = 1; // min caracters to display the autocomplete
                var keyword = $('#tag-search-input').val();
                if (keyword.length == 0) {
                    $autoComplete.hide();
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
                        case "region":
                            selectedFunction = "regAuto";
                            break;
                        case "title":
                            selectedFunction = "titleAuto";
                            break;
                    }

                    $.ajax({
                        url: "http://" + location.host + "/NewsMap/get_data.php",
                        type: 'GET',
                        data: {func: selectedFunction, keyword: keyword, date: dateSelectionVal},
                        success: function (data) {
                            $autoComplete.empty();
                            var parsedData = JSON.parse(data);
                            $autoComplete.show();

                            var removedDuplicates = [];

                            if (selectedFunction == "tagAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.name, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.name);
                                    }
                                });
                            }
                            else if (selectedFunction == "locAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.city, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.city);
                                    }
                                });
                            }
                            else if (selectedFunction == "regAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.region, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.region);
                                    }
                                });
                            }
                            else if (selectedFunction == "titleAuto") {
                                $.each(parsedData, function (index, value) {
                                    if ($.inArray(value.title, removedDuplicates) == -1) {
                                        removedDuplicates.push(value.title);
                                    }
                                });
                            }

                            $.each(removedDuplicates, function (key) {
                                var display_name = removedDuplicates[key];

                                var $li = $("<li>");
                                $li.attr("index", key).html(display_name);
                                $autoComplete.append($li);
                            });
                            $("#autocomplete li").on("click", function () {
                                var query = $(this).html();
                                $("#tag-search-input").val(query);
                                var queryItem = [query, selectedFunction];

                                $autoComplete.empty().hide();
                                var queryExists = false;
                                for (var i = 0; i < searchQueries.length; i++) {
                                    var obj = searchQueries[i];
                                    if (obj[0].toLowerCase() == queryItem[0].toLowerCase() && obj[1] == queryItem[1]) {
                                        swal("Suchanfrage existiert bereits");
                                        queryExists = true;
                                        return false;
                                    }
                                }
                                if (!queryExists) {
                                    searchQueries.push(queryItem);

                                    var $queryLi = $("<li class='query-item'>");
                                    //$queryLi.html($('#tag-search-input').val());
                                    var $queryClose = $("<i class='fi-x remove-query'>");
                                    $queryLi.html(query);
                                    $($queryLi).append($queryClose);
                                    $($queryLi).attr('data-show', query);
                                    $("#search-queries").append($queryLi);


                                    $("#tag-search-input").val($(this).html());

                                    //getArticle($('#tag-search-input').val(), selectedFunction);
                                    getArticleByQuery();
                                }
                            });
                        }
                    });
                }
            });
        },

        getArticle = function (selectedQuery, selectedFunction) {

            if (selectedQuery == "") {
                getAllArticles();
            }
            else {

                if (selectedFunction == "tagAuto") {
                    selectedFunction = "tag";
                }
                else if (selectedFunction == "locAuto") {
                    selectedFunction = "location";
                }
                else if (selectedFunction == "regAuto") {
                    selectedFunction = "region";
                }
                else if (selectedFunction == "titleAuto") {
                    selectedFunction = "title";
                }

                $.ajax({
                    type: "GET",
                    url: "http://" + location.host + "/NewsMap/get_data.php",
                    data: {func: selectedFunction, query: selectedQuery, date: dateSelectionVal},
                    beforeSend: function () {
                        $loading.show();
                    },
                    success: function (data) {
                        if (JSON.parse(data).length == 0) {
                            console.log("Keine Ergebnisse");
                            swal("Keine Ergebnisse zu Ihrer Anfrage gefunden", null, "error");
                        }
                        else {
                            //console.log("SUCHE: SQL-AJAX-Ergebnisse", JSON.parse(data));
                            markersSet = false;
                            addMarker(JSON.parse(data));

                        }
                    },
                    error: function (HTTPREQUEST) {
                        swal("Fehler bei der Datenbankanbindung", null, "error");
                    },
                    complete: function () {
                        $loading.hide();
                    }
                });
            }
        },

        getArticleByQuery = function () {

            $.ajax({
                type: "GET",
                url: "http://" + location.host + "/NewsMap/get_data.php",
                data: {func: "getQueries", queries: searchQueries, date: dateSelectionVal},
                beforeSend: function () {
                    $loading.show();
                },
                success: function (data) {
                    console.log(JSON.parse(data));
                    if (JSON.parse(data).length == 0) {
                        console.log("Keine Ergebnisse");
                        swal("Keine Ergebnisse zu Ihrer Anfrage gefunden", null, "error");
                    }
                    else {
                        console.log("SUCHE: SQL-AJAX-Ergebnisse", JSON.parse(data));
                        markersSet = false;
                        addMarker(JSON.parse(data));

                    }


                },
                error: function () {
                    swal("Fehler bei der Datenbankanbindung", null, "error");
                },
                complete: function () {
                    $loading.hide();
                }
            });
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

        selectChanged = function () {
            searchSelect = $("#search-select").val();
            $("#tag-search-input").val("");
        },

        radiusSelectChanged = function () {
            var radiusSelectVal = radiusSelect.val();
            console.log("in radiusSelectChanged" + radiusSelectVal);
            markersSet = false;
            addMarker(lastData);
            $(that).trigger("identifyLocation");
        },

        dateSelection = function () {
            $dateSelect.on("change", function () {
                dateSelectionVal = $(this).val();
                if (searchQueries.length == 0) {
                    getAllArticles();
                }
                else {
                    getArticleByQuery();
                }
            });
        },

        fbshareCurrentPage = function () {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURI(NewsMap.NewsMapView.getCurrentArticle()) + "&t=" + document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
            return false;
        },

        setUpEmailLink = function () {
            var link = "mailto: ?body=" + encodeURI(NewsMap.NewsMapView.getCurrentArticle());
            return link;

        },

        twitterCurrentArticle = function () {
            {
                window.open("https://twitter.com/intent/tweet?text=" + encodeURI(NewsMap.NewsMapView.getCurrentArticle()), 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                return false;
            }
        },


        _setLocation = function (lat, long) {
            // Removing old markers
            myLat = lat;
            myLng = long;
            if (myLocation != null) {
                map.removeLayer(myLocation);
            }
            map.setView(new L.LatLng(lat, long));

            var myLocationIcon = L.icon({
                iconUrl: 'img/mylocationicon.png',
                iconSize: [50, 50], // size of the icon
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -100] // point from which the popup should open relative to the iconAnchor
            });

            var myLocationMarker = L.marker([lat, long], {icon: myLocationIcon});
            myLocation = myLocationMarker;
            map.addLayer(myLocationMarker);
            myLocationMarker.bindPopup("<div class='marker-popup my-location'><h3 class='marker-title'>Ihr Standort!</h3></div>").openPopup();

            $.ajax({
                url: "http://api.geonames.org/findNearbyPlaceNameJSON?lat=" + myLat + "&lng=" + myLng + "&username=mopat",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    var query = data["geonames"][0]["name"],
                        selectedQuery = "locAuto";

                    var queryItem = [query, selectedQuery];

                    var queryExists = false;
                    for (var i = 0; i < searchQueries.length; i++) {
                        var obj = searchQueries[i];
                        if (obj[0].toLowerCase() == queryItem[0].toLowerCase() && obj[1] == queryItem[1]) {

                            queryExists = true;
                            return false;
                        }
                    }

                    if (!queryExists) {
                        searchQueries.push(queryItem);

                        var $queryLi = $("<li class='query-item'>");

                        var $queryClose = $("<i class='fi-x remove-query'>");
                        $queryLi.html(query);
                        $($queryLi).append($queryClose);
                        $($queryLi).attr('data-show', query);

                        if (query != "") {
                            $("#search-queries").append($queryLi);
                        }
                        if (radiusSelect.val() == 6666) {
                            getAllArticles();
                        }
                        else
                        getArticleByQuery();
                    } else {
                        swal("Suchanfrage existiert bereits");
                    }
                },
                error: function () {
                    swal("Fehler beim Laden der Standortinformationen", null, "error");
                }
            });
        },

        checkFavorites = function () {

            if ($("#favorites-list li").size() == 0) {
                $("#favorites-list").html("<li id='no-favorites-info'>Noch keine Favoriten in Ihrer Liste.</li>")
            }
            else $("#no-favorites-info").remove();
        },

        addToFavorites = function (article) {
            if ($.inArray(article, favorites) == -1) {
                favorites.push(article);

                var display_name = favorites[favorites.length - 1].title;

                var $li = $("<li>");
                $li.attr("index", favorites.length - 1).html(display_name);
                $li.attr("class", "favorites-li");

                $("#favorites-list").append($li);

                checkFavorites();
            }
        },

        showFavorites = function () {
            markersSet = false;
            if (!favoritesVisible && !(jQuery.isEmptyObject(favorites))) {
                favoritesVisible = true;
                addMarker(favorites);
            }
            else if (favoritesVisible) {
                favoritesVisible = false;
                addMarker(lastData);
            }
        },

        showFavArticle = function (index) {
            map.setView(new L.LatLng(favorites[index].lat, favorites[index].lon));
            $(that).trigger("showMenuLeftForFavorite", favorites[index]);
        },

        removeQuery = function (query) {
            $.each(searchQueries, function (index) {
                if (searchQueries[index][0] == query) {
                    searchQueries.splice(index, 1);
                    return false;
                }
            });
            if (searchQueries.length == 0) {
                $("#radius-select").val("6666");
                getAllArticles();
            }
            else {
                getArticleByQuery();
            }
        };

    that.setUpEmailLink = setUpEmailLink;
    that.twitterCurrentArticle = twitterCurrentArticle;
    that.fbshareCurrentPage = fbshareCurrentPage;
    that._setLocation = _setLocation;
    that._getArticle = _getArticle;
    that.tagSearchClicked = tagSearchClicked;
    that.selectChanged = selectChanged;
    that.radiusSelectChanged = radiusSelectChanged;
    that.addToFavorites = addToFavorites;
    that.showFavorites = showFavorites;
    that.showFavArticle = showFavArticle;
    that.removeQuery = removeQuery;
    that.init = init;

    return that;
}());
