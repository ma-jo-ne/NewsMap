var map;
var layer_mapnik;
var layer_tah;
var layer_markers;

function drawmap() {
    OpenLayers.Lang.setCode('de');

    // Position und Zoomstufe der Karte
    var lon = 12.101631;
    var lat = 49.0134074;
    var zoom = 10;



    map = new OpenLayers.Map('map', {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.LayerSwitcher()]
            /*new OpenLayers.Control.PanZoomBar()],
        maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34,
            20037508.34, 20037508.34),
        numZoomLevels: 18,
        maxResolution: 156543,
        units: 'meters'*/
    });

    layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    layer_markers = new OpenLayers.Layer.Markers("Address", {
        projection: new OpenLayers.Projection("EPSG:4326"),
        visibility: true, displayInLayerSwitcher: false
    });

    map.addLayers([layer_mapnik, layer_markers]);
    jumpTo(lon, lat, zoom);
}

function addMyMarkers() {

    // Popup und Popuptext mit evtl. Grafik
    var popupbarttacke = "<font color=\"black\"><b>Barttacke</b><p><img class='popupPic' src=\"img/barttacke.jpg\" width=\"50\" height=\"50\"></p></font>";

    var popupmopat = "<font color=\"red\"><b>Mopat</b><p><img class='popupPic' src=\"img/mopat.jpg\" width=\"50\" height=\"50\"></p></font>";
    // Position des Markers
    addMarker(layer_markers, 12.101631, 49.0134074, popupbarttacke);
    addMarker(layer_markers, 12.5801538, 48.8777333, popupmopat);

}

function popupClick() {
    $(".popupPic").on("click", function() {
        $("#menu-left").show();
    });
}

function previewClose() {
    $("#close-preview").on("click", function () {
        $("#menu-left").hide();
    });
}

function menuItemClick() {
    $("#menu-list li").on("click", function () {
        var $toShow = $("#" + $(this).attr("data-show") + "-wrapper");
        if ($toShow.is(":visible")) {
            $(".menu-item").hide();
            $("#menu-items").hide();
        }
        else {
            $(".menu-item").hide();
            $toShow.show();
            $("#menu-items").show(50);
        }
    });
}

function closeMenuClick() {
    $("#close-menu").on("click", function () {
        $(".menu-item").hide();
        $("#menu-items").hide();
    });
}