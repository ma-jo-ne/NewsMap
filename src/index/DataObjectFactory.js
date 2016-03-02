/**
 * Created by Patrick on 01.02.2016.
 */
function DataObject(newsData) {
    this.title = newsData.title;
    this.link = newsData.link;
    this.pubDate = newsData.pubDate;
    this.content = newsData.content;
    this.categories = newsData.categories;
    this.tags = newsData.tags;
    this.postId = newsData.postId;
    this.city = newsData.city;
    this.exists = newsData.exists;
}

function DataObjectFactory() {
    DataObjectFactory.prototype.createDataObject = function createDataObject(newsData) {
        var parentClass = newsData;

        return parentClass
    }
}