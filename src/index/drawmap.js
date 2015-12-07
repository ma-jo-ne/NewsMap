var map;


function drawmap() {

    //wegen leafletjs hier neuer kartenaufruf...
    var map;

    function load_map() {
        map = new L.Map('map', {zoomControl: false});

        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

        map.setView(new L.LatLng(49.0134074, 12.101631), 10).addLayer(osm);

        //hier wird ein beispielmarker gesetzt
        var barttacke = L.marker([49.0134074, 12.101631]).addTo(map);
        var mopat = L.marker([48.8777333, 12.5801538]).addTo(map);

        //und hier ein popup zu diesem marker hinzugefügt
        barttacke.bindPopup("<div class='marker-popup'><b class='marker-title'>Barttacke</b><p><img class='popupPic' src=\"img/barttacke.jpg\" width=\"50\" height=\"20\"></p></div>").openPopup();
        mopat.bindPopup("<div class='marker-popup'><h3 class='marker-title'>Digitales Gründerzentrum: Zwei Standorte in Oberfranken geplan</h3></div>").openPopup();
    }


    window.onload = load_map;

}

