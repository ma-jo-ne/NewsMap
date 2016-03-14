<script src="js/vendor/jquery.js"></script>
<?php
if ($_GET["store"] == true):
    ?>
    <script>
        var $xml,
            newsData = [],
            uniqueTags = [];
        var $allTags = [];
        function isInArray(value, array) {
            return array.indexOf(value) > -1;
        }

        /*
         durchsuchen, speichern in einem objekt
         */
        $.ajax({
            type: "GET",
            url: "http://" + location.host + "/NewsMap/xml/lokalreporter.wordpress.2016-01-20.xml",
            dataType: "xml",
            success: function (xml) {
                $xml = $(xml);

                var $item = $xml.find("item");


                $item.each(function (index) {

                    var $title = $(this).find("title").text(),
                        $link = $(this).find("link").text(),
                        $pubDate = $(this).find("pubDate").text(),
                        $content = $(this).find("encoded").text(),
                        $postId = $(this).find("post_id").text(),
                        $categories = [],
                        $tags = [];
                    $(this).find("category").each(function (i, el) {
                        var text = $(el).text().toLowerCase();
                        $categories.push(text.trim());
                        if ($(el).text() != "Allgemein" && !isInArray(text, $tags)) {
                            $tags.push(text);
                            if (isInArray(text, $tags)) {
                                $allTags.push(text);
                            }
                        }
                    });
                    /*
                     Problem: Aufbau der Kategorien ist nicht immer gleich. haben verschieden Längen;
                     indizes sind auch verschieden, also index 1 ist nicht immer ort, sondern auch kategorie etc.
                     */
                    var nd = {
                        title: $title,
                        link: $link,
                        pubDate: $pubDate,
                        content: $content,
                        categories: $categories,
                        tags: $tags,
                        postId: $postId
                    };
                    newsData.push(nd);
                });

                //Remove Duplicates


                /*   $(newsDataObjects).each(function (i) {
                 console.log(this);
                 });*/
                /*
                 check if geodata for article exists, if true -> build objects
                 */
                //console.log(newsData)
                //store_in_db();
                $.each($allTags, function (i, el) {
                    if ($.inArray(el, uniqueTags) === -1) uniqueTags.push(el);
                });
                uniqueTags.sort();
                document.write("tags sorted<br>");
                relateTagIdArticleId();
                console.log(articleTagsRealted);
                document.write("articles and tags related<br>");
                store_in_db();
                document.write("storing data<br>")
            },
            error: function () {
                alert("ERROR loading XML");
            },
            complete: function () {

            }
        });

        var articleTagsRealted = [];
        function relateTagIdArticleId() {

            for (var i = 0; i < newsData.length; i++) {
                var article_id = i;
                //console.log(newsData[i]["tags"]);
                for (var k = 0; k < uniqueTags.length; k++) {
                    //console.log(uniqueTags[k]);
                    var tag_id = k;
                    for (var j = 0; j < newsData[i]["tags"].length; j++) {
                        //console.log(newsData[i]["tags"][j], uniqueTags[k]);
                        if (newsData[i]["tags"][j] == uniqueTags[k]) {
                            var tagname = newsData[i]["tags"][j];
                            var obj = {
                                tag_id: tag_id,
                                article_id: newsData[i]["postId"],
                                name: tagname
                            };
                            articleTagsRealted.push(obj);
                            //console.log(obj);
                            //console.log(newsData[i]["tags"][j], uniqueTags[k]);
                        }
                    }
                }
            }
        }
        function store_in_db() {
            $.ajax({
                data: {newsData: newsData, tags: uniqueTags, articleTagsRelated: articleTagsRealted},
                type: "POST",
                url: "http://" + location.host + "/NewsMap/store.php?store=true",
                success: function (success) {
                    console.log(success)
                    alert("DONE");
                },
                error: function () {
                    alert("ERROR")
                }
            });
        }
    </script>
    <?php
endif;
?>
<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 06.03.2016
 * Time: 21:03
 */