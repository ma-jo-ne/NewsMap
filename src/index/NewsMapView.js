NewsMap.NewsMapView = (function () {
    var that = {},
        $buttonFindLocation = null,
        $buttonIdentifyLocation = null,
        currentArticle = "http://google.de",
        currentClickedArticle = null,
        favorites = [],
        $favoritesMenu = null,
        $timelineMenu = null,
        $header = null,

        init = function () {

            $buttonFindLocation = $('.button-find-location');
            $buttonIdentifyLocation = $('#identify-location');
            $favoritesMenu = $("#favorites-menu");
            $timelineMenu = $("#menu-rechts");
            $header = $("#header");

            popupClick();
            previewClose();
            identifyLocation();
            menuItemClick();
            searchButtonClick();
            toggleMenu();


            $buttonIdentifyLocation.on("click", identifyLocation);
            $("#close-menu").on("click", _closeMenu);
            $("#menu-list li").on("click", menuItemClick);
            $("#search-select").on("change", searchSelectChanged);
            $("#right-menu-button").on("click", showRightMenu);
            $("#favorites-button").on("click", showFavorites);
            $("#add-to-favorites").on("click", addToFavorites);
            $("#close-timeline").on("click", closeChrono);
            $("#close-favorites").on("click", closeFavorites);

            return this;
        },
        closeChrono = function () {
            $timelineMenu.hide();
        },
        closeFavorites = function () {
            $favoritesMenu.hide();
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
            $(".entry-summary").dotdotdot();

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
            $header.removeClass("menu-visible");
            if ($toShow.is(":visible")) {
                $(".menu-item").hide();
                $("#menu-items").hide();
            }
            else {
                $(".menu-off-canvas").hide();
                $(".menu-item").hide();
                $toShow.show();
                $("#menu-items").show(50);
                $("#menu-left").hide();
                console.log($(this).attr("data-show") + "-wrapper");
                if ($toShow[0] != $("#chrono-wrapper")[0] && $toShow[0] != $("#favorites-wrapper")[0])
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
