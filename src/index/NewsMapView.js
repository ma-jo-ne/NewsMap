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

        closeLocationFinder = function () {
            $("#identify-location").on("click", function () {
                $("#location-start").hide();
            });
            $("#location-input").bind("enterKey", function (e) {
                $("#location-start").hide();
            });
            $("#location-input").keyup(function (e) {
                if (e.keyCode == 13) {
                    $(this).trigger("enterKey");
                }
            });
            $("#location-start-search").on("click", function () {
                $("#location-start").hide();
            });
        },

        menuItemClick = function () {
            $("#menu-list li").on("click", function () {
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
