NewsMap.NewsMapView = (function () {
    var that = {},
        $buttonFindLocation = null,

        init = function () {

            console.log("NewsMapView");

            $buttonFindLocation = $('.button-find-location');

            popupClick();
            previewClose();
            closeLocationFinder();
            menuItemClick();
            closeMenuClick();

            return this;
        },

        popupClick = function () {
            $(".marker-title").on("click", function () {
                $("#menu-left").show();
            });
        },

        previewClose = function () {
            $("#close-preview").on("click", function () {
                $("#menu-left").hide();
            });
        },

        menuMarkerClick = function () {

        },

        closeLocationFinder = function () {
            $("#identify-location").on("click", function () {
                $("#location-start").hide();
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

                var zoom = 10;
            });


            /*            $("#location-input").bind("enterKey", function (e) {
                $("#location-start").hide();
            });
            $("#location-input").keyup(function (e) {
                if (e.keyCode == 13) {
                    $(this).trigger("enterKey");
                }
            });
            $("#location-start-search").on("click", function () {
                $("#location-start").hide();
             });*/
        },

        menuItemClick = function () {
            $("#menu-list li").on("click", function () {
                if (!$(this).attr("data-show") == "location") {
                    var $toShow = $("#" + $(this).attr("data-show") + "-wrapper");
                    if ($toShow.is(":visible")) {
                        $(".menu-item").hide();
                        $("#menu-items").hide();
                    }
                    else {
                        $(".menu-item").hide();
                        $toShow.show();
                        $("#menu-items").show(50);
                    }
                }
                else {
                    $("#location-start").show();
                }

            });
        },

        closeMenuClick = function () {
            $("#close-menu").on("click", function () {
                $(".menu-item").hide();
                $("#menu-items").hide();
            });

        };


    that.init = init;

    return that;
}());
