NewsMap.NewsMapView = (function () {
    var that = {},
        $buttonFindLocation = null,

        init = function () {

            console.log("NewsMapView");

            $buttonFindLocation = $('.button-find-location');

            popupClick();
            previewClose();
            identifyLocation();
            menuItemClick();
            $("#identify-location").on("click", identifyLocation);
            $("#close-menu").on("click", _closeMenu);
            $("#menu-list li").on("click", menuItemClick);

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


        identifyLocation = function () {
            function success(position) {
                var lat = position.coords.latitude,
                    long = position.coords.longitude;

                $(that).trigger("locationFound", [lat, long]);
                _closeMenu();

                //alert('Dein Standort: latitude: ' + lat + 'longitude: ' + long);
            }

            function error(msg) {
                alert(typeof msg == 'string' ? msg : "error");
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                alert("GeoLocation API ist NICHT verfügbar!");
            }

            var zoom = 10;


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
        },

        _closeMenu = function () {
            $(".menu-item").hide();
            $("#menu-items").hide();
        };

    that._closeMenu = _closeMenu;
    that.init = init;

    return that;
}());
