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
            searchButtonClick();
            shareButtonClick();
            outlookButtonClick();


            $buttonIdentifyLocation.on("click", identifyLocation);
            $("#close-menu").on("click", _closeMenu);
            $("#menu-list li").on("click", menuItemClick);
            $("#search-select").on("change", searchSelectChanged)

            return this;
        },

        searchSelectChanged = function() {
            $(that).trigger("searchSelectChanged");
        },

        popupClick = function () {
            $('body').on('click', '.marker-popup', function () {
                $(that).trigger("markerPopupClick", [$(this).attr("data-id")]);
                $(".menu-item").hide();
                $("#menu-items").hide();
                console.log();
            });
        },


        outlookButtonClick = function () {
            $('body').on('click', '#outlook-button', function () {
                $(that).trigger("outlookButtonClick");
            });
        },

        shareButtonClick = function(){
            console.log("View: in share Button Click ");
            $('body').on('click', '#share-button', function () {
                $(that).trigger("shareButtonClick");
            });
        },

        searchButtonClick = function() {
            $('body').on('click', '#search-button', function () {
                $(that).trigger("searchButtonClick");
            });
        },


        previewClose = function () {
            $("#close-preview").on("click", function () {
                $("#menu-left").hide();
            });
        },

        _setArticleContent = function (clickedArticle) {
            $(".title").html(clickedArticle.title);
            $(".more-link ").attr("href", clickedArticle.link);
            $(".entry-summary").html(clickedArticle.content);
            $(".pub-date").html(clickedArticle.pub_data);
            $("#menu-left").show();

            console.log(clickedArticle);

            $("#foo").val(clickedArticle.link);
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
                $("#menu-left").hide();
            }
        },

        _closeMenu = function () {
            $(".menu-item").hide();
            $("#menu-items").hide();
        };

    that._closeMenu = _closeMenu;
    that._setArticleContent = _setArticleContent;
    that.init = init;

    return that;
}());
