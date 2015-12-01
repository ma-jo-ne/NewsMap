/**
 * Created by majone on 26.11.15.
 */
NewsMap.NewsMapView = (function () {
    var that = {},
        buttonFindLocation,

        init = function () {

            console.log("NewsMapView");
            
            buttonFindLocation = $('.button-find-location');

            return this;
        };


    that.init = init;

    return that;
}());
