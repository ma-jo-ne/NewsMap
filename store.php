<?php
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
storeArticles($conn);
storeRelations($conn);

function storeArticles($conn) {
    $newsdata = $_POST["newsData"];
    for ($i = 0; $i < sizeof($newsdata); $i++) {
        $cur = $newsdata[$i];
        $title = $cur["title"];
        $content = $cur["content"];
        $link = $cur["link"];
        $post_id = $cur["postId"];
        $pub_date = $cur["pubDate"];
        $pub_date = date('Y-m-d H:i:s', strtotime($pub_date));
        $sql = "INSERT INTO articles (link, content, title, post_id, pub_date) VALUES('$link','$content','$title','$post_id','$pub_date')";


        $result = $conn->query($sql);
        echo $result;
    }

}

function storeRelations($conn) {
    $articleTagsRelated = $_POST["articleTagsRelated"];
    for ($j = 0; $j < sizeof($articleTagsRelated); $j++) {
        $curTag = $articleTagsRelated[$j];
        $tag_id = (int)$curTag["tag_id"];
        $article_id = (int)$curTag["article_id"];
        $name = $curTag["name"];
        $sql2 = "INSERT INTO articles_tags (article_id, tag_id, tag_name) VALUES ('$article_id','$tag_id', '$name')";
        $result = $conn->query($sql2);
        echo $result;
    }
}


//echo $result2;
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 06.03.2016
 * Time: 21:51
 */