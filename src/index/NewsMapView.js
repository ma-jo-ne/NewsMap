NewsMap.NewsMapView = (function () {
    var that = {},
        $buttonFindLocation = null,
        $buttonIdentifyLocation = null,
        currentArticle = "http://google.de",
        currentClickedArticle = null,
        favorites = [],
        $header = null,
        favoritesVisible = false,

        init = function () {

            $buttonFindLocation = $('.button-find-location');
            $buttonIdentifyLocation = $('#identify-location');
            $header = $("#header");

            popupClick();
            previewClose();
            identifyLocation();
            menuItemClick();
            searchButtonClick();
            toggleMenu();
            showFavArticle();


            $buttonIdentifyLocation.on("click", identifyLocation);
            $("#close-menu").on("click", _closeMenu);
            $("#menu-list li").on("click", menuItemClick);
            $("#search-select").on("change", searchSelectChanged);
            $("#right-menu-button").on("click", showRightMenu);
            $("#showFavOnMap").on("click", showFavoritesOnMap);
            $("#favorites-menu-star").on("click", showFavorites);
            $("#add-to-favorites").on("click", addToFavorites);

            $(".right-x").on("click", closeMenuRight);

            return this;
        },

        showFavArticle = function () {

            $('body').on('click', '.favorites-li', function () {
                var index = $(this).index();
                $(that).trigger("showFavArticle", index)
            });
        },

        closeMenuRight = function () {
            $("#menu-rechts").hide();
            $("#favorites-menu").hide();
        },

        addToFavorites = function () {
            $(that).trigger("addedToFavorites");

            var menuStar = $("#favorites-menu-star");
            var bg = menuStar.css('color');
            menuStar.css('color', 'yellow');
            setTimeout(function () {
                menuStar.css('color', bg);
            }, 1000)

        },

        showFavorites = function () {
            $("#favorites-menu").toggle();
            $("#menu-rechts").hide();

        },

        showFavoritesOnMap = function () {

            if (favoritesVisible) {
                $(this).html("Nur Favoriten anzeigen");
                favoritesVisible = false;
            }
            else {
                $(this).html("Alle Ergebnisse");
                favoritesVisible = true;
            }

            $(that).trigger("showFavorites");
        },

        showRightMenu = function () {
            $("#menu-rechts").toggle();
            $("#favorites-menu").hide();
        },

        searchSelectChanged = function () {
            $(that).trigger("searchSelectChanged");
        },

        popupClick = function () {
            $('body').on('click', '.marker-popup', function () {
                $(that).trigger("markerPopupClick", [$(this).attr("data-id")]);
                $(".menu-item").hide();
                $("#menu-items").hide();
                if (NewsMap.DrawMap._getArticle($(this).attr("data-id")).link != null)
                    currentArticle = NewsMap.DrawMap._getArticle($(this).attr("data-id")).link;

                $("#mailButton").attr("href", NewsMap.DrawMap.setUpEmailLink);
            });
        },

        getCurrentArticle = function () {
            return currentArticle;
        },

        searchButtonClick = function () {
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
            currentClickedArticle = clickedArticle;
            $(".title").html(clickedArticle.title);
            $(".more-link ").attr("href", clickedArticle.link);
            $(".entry-summary").html(clickedArticle.content);
            $(".pub-date").html(clickedArticle.pub_date);
            $("#menu-left").show();

            console.log(clickedArticle);

        },

        toggleMenu = function () {
            $("#menu-icon").on("click", function () {
                if ($("#menu-form").is(":visible")) {
                    $("#menu-form").hide()
                }
                else {
                    $("#menu-form").show();
                }
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
                $header.removeClass("menu-visible");

            }
            else {
                $(".menu-item").hide();
                $toShow.show();
                $("#menu-items").show(50);
                $("#menu-left").hide();
                $header.addClass("menu-visible");
            }
        },

        _closeMenu = function () {
            $(".menu-item").hide();
            $("#menu-items").hide();
            $header.removeClass("menu-visible");
        };

    that.getCurrentArticle = getCurrentArticle;
    that._closeMenu = _closeMenu;
    that._setArticleContent = _setArticleContent;
    that.init = init;

    return that;
}());
