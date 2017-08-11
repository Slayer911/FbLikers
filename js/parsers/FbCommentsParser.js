/**
 * Fb comments parser
 * @constructor
 */
var FbCommentsParser = function () {
    this.maxCommentLenth = 100;
};

/**
 * Run parser
 * @param callback
 */
FbCommentsParser.prototype.run = function (callback) {
    var self = this;
    this._loadAllCommentsPages(function () {
        var commentData = self._getCommentsData();
        callback(commentData);
    });
};

/**
 * Load all comments of post
 * @param callback
 * @private
 */
FbCommentsParser.prototype._loadAllCommentsPages = function (callback) {
    // Load all
    var nextPageInterval = setInterval(function () {

        nextPageElement = $('.permalinkPost .UFIPagerLink:visible');
        if (!nextPageElement.length) {
            clearInterval(nextPageInterval);
            setTimeout(callback, 3000);
        } else {
            eventFire(nextPageElement[0], 'click');
        }
    }, 1500);
};

/**
 * Get all comments data
 * @returns {*}
 */
FbCommentsParser.prototype._getCommentsData = function () {
    // Parse profile urls
    var self = this,
        commentBlocks = $('.permalinkPost .UFICommentContentBlock,#stream_pagelet .UFICommentContentBlock'),
        results = {};

    commentBlocks.each(function () {
        var $this = $(this),
            $textBlock = $this.find('.UFICommentBody'),
            $clientLink = $this.find('.UFICommentActorName[data-hovercard]');

        var fbId = self._getClintIdByDataHoverCardElement($clientLink);
        var comment = $textBlock.text();
        comment = self._makeReadableComment(comment);
        if (fbId) {
            results[fbId] = {
                'fb_id': fbId,
                'type': 'comment',
                'text': comment
            };
        }
    });

    return results;
};


/**
 * Transform comment
 * @param comment
 * @returns {void|string|XML|*}
 */
FbCommentsParser.prototype._makeReadableComment = function (comment) {
    if (this.maxCommentLenth) {
        if (comment.length > this.maxCommentLenth) {
            comment = comment.slice(0, this.maxCommentLenth) + '...';
        }
    }
    comment = comment.replace(/\r|\n|;/g, '');
    return comment;
};

/**
 * Get client id by element 'a' with 'data-hovercard' attribute
 * @param $element
 * @returns {*}
 */
FbCommentsParser.prototype._getClintIdByDataHoverCardElement = function ($element) {
    var fbId, profileId;
    var profileLink = $element.attr('data-hovercard');
    if (profileLink) {
        if (profileId = profileLink.match(/\?id=([0-9]+)&/)) {
            fbId = profileId[1];
        }
    }
    return fbId;
};