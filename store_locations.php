<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 09.03.2016
 * Time: 14:26
 */

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wordpress";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

$sql = "SELECT * from locations";


if ($result = $conn->query($sql)) {
    $rows = array();
    while ($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }

    /* free result set */
    $result->close();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "newsmap";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

for ($i = 0; $i < $rows; $i++) {
    $location = json_decode($rows[$i]["locationData_HGC"]);
    $articleId = $location->id;
    $locationData = $location->locations;
    /* print_r($articleId);
     print_r("<br>");*/
    for ($j = 0; $j < sizeof($locationData); $j++) {
        $currentLocation = $locationData[$j];
        $lat = $currentLocation->lat;
        $lon = $currentLocation->lon;
        $city = $currentLocation->name;
        $county = $currentLocation->county;
        $region = $currentLocation->region;
        // print_r($currentLocation);
        /*     print_r($lat);
                print_r($lon);
                print_r($municipality);
                print_r($city);
                print_r($state);
                print_r($county);
                print_r("<br>");*/
        $insert = "INSERT INTO locations (article_id, lat, lon, city, region, county) VALUES ('$articleId','$lat', '$lon', '$city', '$region', '$county')";
        $conn->query($insert);
    }
}
print_r("DONE");