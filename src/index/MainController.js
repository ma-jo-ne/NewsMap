/**
 * Created by majone on 26.11.15.
 */
NewsMap.MainController = (function () {
    var that = {},
        newsMapModal = null,
        newsMapView = null,
        drawMap = null,

        init = function () {
            console.log("MainController");
            newsMapModal = NewsMap.NewsMapModal.init();
            newsMapView = NewsMap.NewsMapView.init();
            drawMap = NewsMap.DrawMap.init();

            $(newsMapView).on("locationFound", setLocation);
            $(drawMap).on("locationClicked", closeMenu);

            return this;
        },

        setLocation = function (e, lat, long) {
            drawMap._setLocation(lat, long);
        },

        closeMenu = function () {
            newsMapView._closeMenu();
        };

    that.init = init;

    return that;
}());