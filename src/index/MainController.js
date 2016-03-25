NewsMap.MainController = (function () {
    var that = {},
        newsMapModal = null,
        newsMapView = null,
        drawMap = null,
        currentClickedArticle = null,

        init = function () {
            newsMapModal = NewsMap.NewsMapModal.init();
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
            $(newsMapView).on("showFavArticle", showFavArticle);
            $(newsMapView).on("radiusSelectChanged", changeRadiusSelect);
            $(newsMapView).on("queryRemoved", removeQuery);

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
        };

    that.init = init;

    return that;
}());