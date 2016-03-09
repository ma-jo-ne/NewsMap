<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 07.03.2016
 * Time: 19:29
 */
$file = fopen("locations.csv", "r");
/*$d = array();
while (($data = fgetcsv($file)) !== FALSE) {
    //echo(json_encode($data));
    array_push($d, json_encode($data));
}
print_r( json_encode($d));*/

$csvData = file_get_contents("locations.csv");
$lines = explode(PHP_EOL, $csvData);
$array = array();
//print_r($lines);
for ($i = 0; $i < sizeof($lines); $i++) {
    //$line = explode("\n", $lines);
    // $jsonObj = explode(";", $line[1]);
    $line = $lines[$i];
    $parsedJsonObj = substr($line, 1, -1);
    //print_r(substr($jsonObj, 1, -1));
    //print_r("<br>");

    array_push($array, $parsedJsonObj);

}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "newsmap";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//print_r($array);
for ($i = 0; $i < sizeof($array); $i++) {
    $decodedArray = $array[$i];
    for ( $j = 0; $j < sizeof($decodedArray); $j++){
        $locationsArr = explode(";", $decodedArray[0][9]);
        print_r($locationsArr);
    }

    echo("<br>");
}
//print_r($array);
//print_r($array);
//print_r( substr($array[0][0], 1, -1));
//echo (explode(";",$array[0][0])[1]);