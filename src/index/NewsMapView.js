NewsMap.NewsMapView = (function () {
    var that = {},
        $buttonFindLocation = null,
        $buttonIdentifyLocation = null,

        init = function () {

            $buttonFindLocation = $('.button-find-location');
            $buttonIdentifyLocation = $('#identify-location');

            popupClick();
            previewClose();
            identifyLocation();
            menuItemClick();

            $buttonIdentifyLocation.on("click", identifyLocation);
            $("#close-menu").on("click", _closeMenu);
            $("#menu-list li").on("click", menuItemClick);

            return this;
        },

        popupClick = function () {
            $('body').on('click', '.marker-popup', function () {
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

            }

            function error(msg) {
                alert(typeof msg == 'string' ? msg : "error");
            }

            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error,
                    {enableHighAccuracy: true, timeout: 60000, maximumAge: 600000});
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
