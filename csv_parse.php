<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 07.03.2016
 * Time: 19:29
 */
$file = fopen("locations.csv", "r");
while (($data = fgetcsv($file)) !== FALSE) {
    print_r($data);
    print_r("<br>");
}