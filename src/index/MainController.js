/**
 * Created by majone on 26.11.15.
 */
NewsMap.MainController = (function () {
    var that = {},
        newsMapModal = null,
        newsMapView = null,

        init = function () {
            console.log("MainController");
            newsMapModal = NewsMap.NewsMapModal.init();
            newsMapView = NewsMap.NewsMapView.init();


            return this;
        };

    that.init = init;

    return that;
}());