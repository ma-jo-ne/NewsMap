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
        $$searchWrapper = null,
        $radiusBox = null,
        favoritesVisible = false,

        init = function () {

            $buttonFindLocation = $('.button-find-location');
            $buttonIdentifyLocation = $('#identify-location');
            $favoritesMenu = $("#favorites-menu");
            $timelineMenu = $("#menu-rechts");
            $header = $("#header");
            $radiusBox = $("#radius-box");
            $searchWrapper = $("#search-wrapper");

            popupClick();
            previewClose();
            searchButtonClick();
            toggleMenu();
            showFavArticle();
            removeQuery();
            setRadiusBoxPosition();


            $buttonIdentifyLocation.on("click", identifyLocation);
            $("#close-menu").on("click", _closeMenu);
            $("#menu-list li").on("click", menuItemClick);
            $("#menu-list li i").on("mouseover", menuItemHover).on("mouseout", menuItemMouseOut);
            $("#search-select").on("change", searchSelectChanged);
            $("#radius-select").on("change", radiusSelectChanged);
            $("#right-menu-button").on("click", showRightMenu);
            $("#showFavOnMap").on("click", showFavoritesOnMap);
            $("#add-to-favorites").on("click", addToFavorites);
            $("#close-timeline").on("click", closeChrono);
            $("#close-favorites").on("click", closeFavorites);
            $("#favorites-button").on("click", showFavoritesMenu);
            $('.remove-query').on("click", removeQuery);
            $("#close-radius-box").on("click", closeRadiusBox);
            $("#close-search-wrapper").on("click", closeSearchWrapper);

            $("#autocomplete").bind("clickoutside", function (event) {
                $(this).hide();
            });

            $(window).resize(function () {
                setAutocompletePoisition();
                setRadiusBoxPosition();
            });

            $radiusBox.hide();
            return this;
        },

        removeQuery = function () {
            $('body').on('click', '.remove-query', function () {
                var query = $(this).closest('li').attr("data-show");
                $(this).closest('li').remove();
                $(that).trigger("queryRemoved", query);
            });
        },
        closeChrono = function () {
            $timelineMenu.hide();
        },
        closeFavorites = function () {
            $favoritesMenu.hide();
        },

        showFavArticle = function () {

            $('body').on('click', '.favorites-li', function () {
                var index = $(this).index();
                $(that).trigger("showFavArticle", index)
            });
        },

        closeMenuRight = function () {
            $timelineMenu.hide();
            $favoritesMenu.hide();
        },

        addToFavorites = function () {
            $(that).trigger("addedToFavorites");


            var menuStar = $("#favorites-menu-star");
            var bg = menuStar.css('color');
            menuStar.css('color', 'yellow');
            $("#added-to-favorites").show();
            setTimeout(function () {
                menuStar.css('color', bg);
                $("#added-to-favorites").hide();
            }, 1000)


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
            $timelineMenu.show();
            $favoritesMenu.hide();
        },

        showFavoritesMenu = function () {
            $favoritesMenu.toggle();
            $timelineMenu.hide();
        },

        searchSelectChanged = function () {
            $("#label-search").html($("#search-select option:selected").html());
            $(that).trigger("searchSelectChanged");
        },

        radiusSelectChanged = function () {
            $(that).trigger("radiusSelectChanged");
        },

        popupClick = function () {
            $('body').on('click', '.marker-popup', function () {
                $radiusBox.hide();

                $(".menu-item").hide();
                $timelineMenu.hide();
                $favoritesMenu.hide();
                if (NewsMap.DrawMap._getArticle($(this).attr("data-id")).link != null)
                    currentArticle = NewsMap.DrawMap._getArticle($(this).attr("data-id")).link;

                if (!$(this).hasClass("my-location")) {
                    $(that).trigger("markerPopupClick", [$(this).attr("data-id")]);
                    $(".menu-item").hide();
                    $("#menu-items").hide();
                    if (NewsMap.DrawMap._getArticle($(this).attr("data-id")).link != null)
                        currentArticle = NewsMap.DrawMap._getArticle($(this).attr("data-id")).link;

                    $("#mailButton").attr("href", NewsMap.DrawMap.setUpEmailLink);
                }
            });
        },

        getCurrentArticle = function () {
            return currentArticle;
        },

        searchButtonClick = function () {
            $('body').on('click', '#search-button', function () {
                if (!Foundation.utils.is_large_up()) {
                    $header.removeClass("menu-visible");
                    $("#search-wrapper").hide();
                }
                $("#autocomplete").empty().hide();
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
            $(".pub-date").html(clickedArticle.pub_date);
            $("#menu-left").show();
            $(".entry-summary").html(clickedArticle.content).dotdotdot();
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
                $radiusBox.show();
                setRadiusBoxPosition();

                _closeMenu();
            }

            function error(msg) {
                alert(typeof msg == 'string' ? msg : "Bitte aktivieren Sie das GPS auf Ihrem Gerät und laden Sie die Seite neu.");
            }

            if (navigator && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error,
                    {enableHighAccuracy: true, timeout: 60000, maximumAge: 600000});
            } else {
                alert("GeoLocation API ist nicht verfügbar!");
            }

            var zoom = 10;

        },

        closeRadiusBox = function () {
            $radiusBox.slideUp(100);
        },

        closeSearchWrapper = function () {
            $searchWrapper.hide();
            $header.removeClass("menu-visible");
        },

        menuVisibleScroll = function () {
            $("#header").scroll(function () {
                setAutocompletePoisition();
            });
        },

        setRadiusBoxPosition = function () {
            var offsetTop = $header.height(),
                offsetLeft = $buttonIdentifyLocation.offset().left;
            $radiusBox.offset({top: offsetTop, left: offsetLeft});
        },

        setAutocompletePoisition = function () {
            var $inputField = $("#tag-search-input");
            var $autocomplete = $("#autocomplete");
            var offsetTop = $inputField.offset().top + $inputField.outerHeight(),
                offsetLeft = $inputField.offset().left,
                width = $inputField.outerWidth();
            $autocomplete.offset({top: offsetTop, left: offsetLeft});
            $autocomplete.width(width);
        },

        menuItemClick = function () {
            var $toShow = $("#" + $(this).attr("data-show") + "-wrapper");
            $header.removeClass("menu-visible");
            $("#autocomplete").empty().hide();
            $(".menu-off-canvas").hide();
            $radiusBox.hide();
            if ($toShow.is(":visible")) {
                $(".menu-item").hide();
                $("#menu-items").hide();
            }
            else {

                $(".menu-item").hide();
                $toShow.show();
                $("#menu-items").show(50);
                $("#menu-left").hide();

                if ($toShow[0] != $("#chrono-wrapper")[0] && $toShow[0] != $("#favorites-wrapper")[0]) {
                    $header.addClass("menu-visible");
                    setAutocompletePoisition();
                    menuVisibleScroll();
                }

            }
        },

        menuItemHover = function () {
            var func = $(this).parent().attr("data-function"),
                top = $(this).parent().offset().top + $(this).parent().height(),
                left = $(this).parent().offset().left,
                $tooltip = $("#tooltip");
            if (Foundation.utils.is_medium_up()) {
                top += 20;
                left += 16
            }

            $tooltip.show().html(func);
            $tooltip.offset({top: top, left: left});
        },

        menuItemMouseOut = function () {
            var $tooltip = $("#tooltip");
            $tooltip.hide();
        },

        _closeMenu = function () {
            $(".menu-item").hide();
            $("#menu-items").hide();
            $header.removeClass("menu-visible");
        };

    that.getCurrentArticle = getCurrentArticle;
    that._closeMenu = _closeMenu;
    that._setArticleContent = _setArticleContent;
    that.identifyLocation = identifyLocation;
    that.setAutocompletePosition = setAutocompletePoisition;
    that.setRadiusBoxPosition = setRadiusBoxPosition;
    that.init = init;

    return that;
}());
