/**
 * Fb posts parser
 * @constructor
 */
var FbPostsParser = function () {
    this.maxLoading = 1;
};

/**
 * Run parser
 * @param callback
 */
FbPostsParser.prototype.run = function (callback) {
    var self = this;
    this._loadAllPages(function () {
        var postsData = self._getPostData();
        callback(postsData);
    });
};

/**
 * Load all pages
 * @param callback
 * @private
 */
FbPostsParser.prototype._loadAllPages = function (callback) {

    // Load all
    var self = this,
        currentLoading = 0,
        nextPageInterval = setInterval(function () {

            nextPageElement = $('.uiMorePagerPrimary:visible');
            if (!nextPageElement.length || self.maxLoading < currentLoading) {
                clearInterval(nextPageInterval);
                setTimeout(callback, 3000);
            } else {
                currentLoading++;
                // eventFire(nextPageElement[0], 'click');
                window.scrollBy(0, 250000);
            }
        }, 4000);
};

/**
 * Get all posts data
 * @returns {*}
 */
FbPostsParser.prototype._getPostData = function () {

    // Parse profile urls
    var postBlocks = $('a').has('.timestampContent'),
        results = [];

    postBlocks.each(function () {
        var url = $(this).attr('href');
        url = 'https://www.facebook.com' + url;
        results.push({
            'post': url,
            'type': 'post'
        });
    });

    return results;
};