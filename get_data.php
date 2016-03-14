<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 07.03.2016
 * Time: 18:28
 */

$servername = "localhost";
$username = "root";
$password = "";
/*$servername = "newsmap.mysql5.loomes.net";
$username = "newsmap";
$password = "AMeiSE";*/
$dbname = "newsmap";
//print_r($array);
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
$dateSelection = $_GET["date"];
//$dateUpperBorder = date("Y-m-d H:i:s");
/*
 * Daten mit locations sind erst ab 28.11. verfügbar
 */
$dateUpperBorder = "2015-11-28";
$dateLowerBorder = "0";

if($dateSelection == "today"){
    //$dateLowerBorder = date("Y-m-d") . " 00:00:00";
    $dateLowerBorder = $dateUpperBorder. " 00:00:00";
    $dateUpperBorder = $dateUpperBorder. " 23:59:59";
}
else if($dateSelection == "yesterday"){
    $dateLowerBorder = date("Y-m-d", strtotime($dateUpperBorder."-1 day")) . " 00:00:00";
    $dateUpperBorder = date("Y-m-d", strtotime($dateUpperBorder."-1 day")) . " 23:59:59";
}
else if ($dateSelection == "last-week"){
    $dateLowerBorder = date("Y-m-d", strtotime($dateUpperBorder."-7 days")) . " 00:00:00";
    $dateUpperBorder = $dateUpperBorder. " 23:59:59";

}
else if($dateSelection == "last-four-weeks"){
    $dateLowerBorder = date("Y-m-d", strtotime($dateUpperBorder."-28 days")) . " 00:00:00";
    $dateUpperBorder = $dateUpperBorder. " 23:59:59";

}
else if($dateSelection == "entire-time"){
    //first pub_date in table
    $dateLowerBorder = "2015-09-16 00:00:00";
    $dateUpperBorder = $dateUpperBorder. " 23:59:59";

}

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_GET["func"] == "tag") {
    getArticleByTag($conn, $dateLowerBorder, $dateUpperBorder);

} else if ($_GET["func"] == "title") {
    getArticleByTitle($conn, $dateLowerBorder, $dateUpperBorder);
} else if ($_GET["func"] == "location") {
    getArticleByLocation($conn, $dateLowerBorder, $dateUpperBorder);
}
else if ($_GET["func"] == "article") {
    getArticle($conn, $dateLowerBorder, $dateUpperBorder);
}

else if ($_GET["func"] == "id") {
    getLocationById($conn, $dateLowerBorder, $dateUpperBorder);
}
else if ($_GET["func"] == "tagAuto") {
    tagAutocomplete($conn, $dateLowerBorder, $dateUpperBorder);
}

else if ($_GET["func"] == "locAuto") {
    locationAutocomplete($conn, $dateLowerBorder, $dateUpperBorder);
}

else if ($_GET["func"] == "titleAuto") {
    titleAutocomplete($conn, $dateLowerBorder, $dateUpperBorder);
}


//

function tagAutocomplete($conn, $dateLowerBorder, $dateUpperBorder) {
    $keyword = '%'.$_GET['keyword'].'%';
    $sql = 'SELECT articles_tags.name FROM articles_tags WHERE articles_tags.name LIKE "%' . $_GET["keyword"] . '%"';
    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function locationAutocomplete($conn, $dateLowerBorder, $dateUpperBorder) {
    $keyword = '%'.$_GET['keyword'].'%';
    $sql = 'SELECT city FROM locations WHERE city LIKE "%' . $_GET["keyword"] . '%"';
    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function titleAutocomplete($conn, $dateLowerBorder, $dateUpperBorder) {
    $keyword = '%'.$_GET['keyword'].'%';
    $sql = 'SELECT title FROM articles WHERE title LIKE "%' . $_GET["keyword"] . '%"';
    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function getArticle($conn, $dateLowerBorder, $dateUpperBorder) {
    $sql = 'SELECT * FROM articles INNER JOIN locations ON articles.post_id=locations.article_id  AND articles.pub_date BETWEEN ("'.$dateLowerBorder.'") AND ("'.$dateUpperBorder.'") ORDER BY articles.pub_date DESC';
    //$sql = 'SELECT * FROM articles INNER JOIN locations ON articles.post_id=article_id  BETWEEN ("' .$dateLowerBorder. '") AND ("'. $dateUpperBorder.'") ORDER BY articles.pub_date DESC';
    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }error_log($sql);
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function getLocation($conn, $dateLowerBorder, $dateUpperBorder) {
    $sql = 'SELECT lat, lon, article_id, city FROM locations AND articles.pub_date BETWEEN ("' . $dateLowerBorder . '") AND ("' . $dateUpperBorder . '") ORDER BY articles.pub_date DESC';
    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function getArticleByTag($conn, $dateLowerBorder, $dateUpperBorder) {
    //$sql = 'SELECT * FROM articles INNER JOIN articles_tags ON articles.post_id=articles_tags.article_id WHERE articles_tags.name LIKE "%' . $_GET["tag"] . '%"';
    $sql = 'SELECT content, link, pub_date, title, post_id, lat, lon, articles_tags.name FROM articles, locations, articles_tags WHERE articles.post_id=locations.article_id AND articles.post_id=articles_tags.article_id AND articles_tags.name LIKE "%' . $_GET["query"] . '%" AND articles.pub_date BETWEEN ("' . $dateLowerBorder . '") AND ("' . $dateUpperBorder . '") ORDER BY articles.pub_date DESC';

    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function getArticleByTitle($conn, $dateLowerBorder, $dateUpperBorder) {
    //$sql = 'SELECT * FROM articles WHERE title LIKE "%' . $_GET["title"] . '%"';
    $sql = 'SELECT content, link, pub_date, title, post_id, lat, lon FROM articles, locations WHERE articles.post_id=locations.article_id AND articles.title LIKE "%' . $_GET["query"] . '%" AND articles.pub_date BETWEEN ("' . $dateLowerBorder . '") AND ("' . $dateUpperBorder . '") ORDER BY articles.pub_date DESC';

    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function getArticleByLocation($conn, $dateLowerBorder, $dateUpperBorder) {
    //$sql = 'SELECT * FROM articles, locations INNER JOIN locations ON articles.post_id=article_id WHERE locations.city LIKE "%' . $_GET["location"] . '%"';
    $sql = 'SELECT content, link, pub_date, title, post_id, lat, lon FROM articles, locations WHERE articles.post_id=locations.article_id AND locations.city LIKE "%' . $_GET["query"] . '%" AND articles.pub_date BETWEEN ("' . $dateLowerBorder . '") AND ("' . $dateUpperBorder . '") ORDER BY articles.pub_date DESC';

    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}

function getLocationById($conn, $dateLowerBorder, $dateUpperBorder) {
    $sql = 'SELECT lat, lon FROM locations WHERE locations.article_id = "' . $_GET["id"] . '"AND AND articles.pub_date BETWEEN ("' . $dateLowerBorder . '") AND ("' . $dateUpperBorder . '") ORDER BY articles.pub_date DESC';
    if ($result = $conn->query($sql)) {

        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
        /* free result set */
        $result->close();
    }
}