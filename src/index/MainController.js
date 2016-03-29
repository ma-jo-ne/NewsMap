NewsMap.MainController = (function () {
    var that = {},
        newsMapView = null,
        drawMap = null,
        currentClickedArticle = null,

        init = function () {
            newsMapView = NewsMap.NewsMapView.init();
            drawMap = NewsMap.DrawMap.init();

            $(newsMapView).on("locationFound", setLocation);
            $(newsMapView).on("markerPopupClick", getClickedArticlePopup);
            $(newsMapView).on("searchButtonClick", getTagsFromArticles);
            $(newsMapView).on("searchSelectChanged", changeSearchSelect);
            $(newsMapView).on("addedToFavorites", addToFavorites);
            $(newsMapView).on("showFavorites", showFavorites);
            $(drawMap).on("locationClicked", closeMenu);
            $(drawMap).on("showMenuLeftForFavorite", showMenuLeftforFavorite);
            $(drawMap).on("setAutocompletePosition", setAutocompletePosition);
            $(newsMapView).on("showFavArticle", showFavArticle);
            $(newsMapView).on("radiusSelectChanged", changeRadiusSelect);
            $(newsMapView).on("queryRemoved", removeQuery);
            $(drawMap).on("identifyLocation", identifyLocation);

            return this;
        },

        removeQuery = function(e, query) {
            drawMap.removeQuery(query);
        },

        showFavArticle = function(e, index) {
            drawMap.showFavArticle(index);
        },



        showFavorites = function() {
            drawMap.showFavorites();
        },

        addToFavorites = function() {
            drawMap.addToFavorites(currentClickedArticle);
        },

        showMenuLeftforFavorite = function(e, article) {
            currentClickedArticle = article;
            newsMapView._setArticleContent(article);
        },

        changeSearchSelect = function() {
            drawMap.selectChanged();
        },

        changeRadiusSelect = function () {
            drawMap.radiusSelectChanged();
        },

        setLocation = function (e, lat, long) {
            drawMap._setLocation(lat, long);
        },
        setAutocompletePosition = function(){
            newsMapView.setAutocompletePosition();
            newsMapView.setRadiusBoxPosition();
        },

        closeMenu = function () {
            newsMapView._closeMenu();
        },

        getTagsFromArticles = function(e) {
            drawMap.tagSearchClicked();
        },

        getClickedArticlePopup = function (e, articleID) {
            var clickedArticle = drawMap._getArticle(articleID);
            currentClickedArticle = clickedArticle;
            newsMapView._setArticleContent(clickedArticle);
        },

        identifyLocation = function () {
            newsMapView.identifyLocation();
        };

    that.init = init;

    return that;
}());