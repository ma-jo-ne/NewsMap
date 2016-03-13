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
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_GET["func"] == "tag") {
    getArticleByTag($conn);

} else if ($_GET["func"] == "title") {
    getArticleByTitle($conn);
} else if ($_GET["func"] == "location") {
    getArticleByLocation($conn);
}
else if ($_GET["func"] == "article") {
    getArticle($conn);
}

else if ($_GET["func"] == "id") {
    getLocationById($conn);
}

else if ($_GET["func"] == "tagAuto") {
    tagAutocomplete($conn);
}

else if ($_GET["func"] == "locAuto") {
    locationAutocomplete($conn);
}

else if ($_GET["func"] == "titleAuto") {
    titleAutocomplete($conn);
}

//

function tagAutocomplete($conn) {
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

function locationAutocomplete($conn) {
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

function titleAutocomplete($conn) {
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

function getArticle($conn) {
    $sql = 'SELECT content, link, pub_data, title, post_id, lat, lon, city FROM articles, locations WHERE articles.post_id = locations.article_id ';
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

function getLocation($conn) {
    $sql = 'SELECT lat, lon, article_id, city FROM locations' ;
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

function getArticleByTag($conn) {
    //$sql = 'SELECT * FROM articles INNER JOIN articles_tags ON articles.post_id=articles_tags.article_id WHERE articles_tags.name LIKE "%' . $_GET["tag"] . '%"';
    $sql = 'SELECT content, link, pub_data, title, post_id, lat, lon, articles_tags.name FROM articles, locations, articles_tags WHERE articles.post_id=locations.article_id AND articles.post_id=articles_tags.article_id AND articles_tags.name LIKE "%' . $_GET["query"] . '%"';

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

function getArticleByTitle($conn) {
    //$sql = 'SELECT * FROM articles WHERE title LIKE "%' . $_GET["title"] . '%"';
    $sql = 'SELECT content, link, pub_data, title, post_id, lat, lon FROM articles, locations WHERE articles.post_id=locations.article_id AND articles.title LIKE "%' . $_GET["query"] . '%"';

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

function getArticleByLocation($conn) {
    //$sql = 'SELECT * FROM articles, locations INNER JOIN locations ON articles.post_id=article_id WHERE locations.city LIKE "%' . $_GET["location"] . '%"';
    $sql = 'SELECT content, link, pub_data, title, post_id, lat, lon FROM articles, locations WHERE articles.post_id=locations.article_id AND locations.city LIKE "%' . $_GET["query"] . '%"';

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

function getLocationById($conn) {
    $sql = 'SELECT lat, lon FROM locations WHERE locations.article_id LIKE "%' . $_GET["id"] . '%"';
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