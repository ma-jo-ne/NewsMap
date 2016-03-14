NewsMap.MainController = (function () {
    var that = {},
        newsMapModal = null,
        newsMapView = null,
        drawMap = null,

        init = function () {
            newsMapModal = NewsMap.NewsMapModal.init();
            newsMapView = NewsMap.NewsMapView.init();
            drawMap = NewsMap.DrawMap.init();

            $(newsMapView).on("locationFound", setLocation);
            $(newsMapView).on("markerPopupClick", getClickedArticlePopup);
            $(newsMapView).on("searchButtonClick", getTagsFromArticles);
            $(newsMapView).on("shareButtonClick", setShareOptions);
            $(newsMapView).on("searchSelectChanged", changeSearchSelect);
            $(drawMap).on("locationClicked", closeMenu);

            return this;
        },

        changeSearchSelect = function() {
            drawMap.selectChanged();
        },

        setLocation = function (e, lat, long) {
            drawMap._setLocation(lat, long);
        },

        setShareOptions = function(){
            console.log("MainController: in setShareOptions");
            drawMap.showShareOptions();
        },

        closeMenu = function () {
            newsMapView._closeMenu();
        },

        getTagsFromArticles = function(e) {
            drawMap.tagSearchClicked();
        },

        getClickedArticlePopup = function (e, articleID) {
            var clickedArticle = drawMap._getArticle(articleID);
            newsMapView._setArticleContent(clickedArticle);
        };

    that.init = init;

    return that;
}());