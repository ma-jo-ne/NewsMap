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
//

function getArticleByTag($conn) {
    $sql = 'SELECT * FROM articles INNER JOIN articles_tags ON articles.post_id=articles_tags.article_id WHERE articles_tags.name LIKE "%' . $_GET["tag"] . '%"';
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
    $sql = 'SELECT *FROM articles WHERE title LIKE "%' . $_GET["title"] . '%"';
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
    $sql = 'SELECT * FROM articles INNER JOIN locations ON articles.post_id=article_id WHERE locations.city LIKE "%' . $_GET["location"] . '%"';
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