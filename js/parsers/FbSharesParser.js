/**
 * Fb Shares
 * @constructor
 */
FbSharesParser = function () {};

/**
 * Run parser on current page
 * @param callback
 */
FbSharesParser.prototype.run = function (callback) {
    var self = this;
    self._openSharesPopup(function () {
        self._loadAllSharesPages(function () {
            var profilesId = self._getSharesProfilesId();
            var dataForReturn = [];
            for (var key in profilesId) {
                if (profilesId.hasOwnProperty(key)) {
                    dataForReturn.push({
                        'type' : 'share',
                        'fb_id': profilesId[key]
                    })
                }
            }
            callback(dataForReturn);
        })
    });
};

/**
 * Load all pages with shares
 * @param callback
 */
FbSharesParser.prototype._loadAllSharesPages = function (callback) {
    // Load all
    var nextPageInterval = setInterval(function () {

        nextPageElement = $('#repost_view_dialog .uiMorePager .uiMorePagerPrimary:visible');
        if (!nextPageElement.length) {
            clearInterval(nextPageInterval);
            setTimeout(callback,3000);
        } else {
            window.scrollBy(0,250000);
        }
    }, 1000);
};

/**
 * Open popup with likers
 * @param {function} callback
 */
FbSharesParser.prototype._openSharesPopup = function (callback) {
    setTimeout(function () {
        eventFire($('.UFIShareLink')[0], 'click');
        setTimeout(function () {
            // return callback
            callback();
        }, 1000);
    }, 2000);
};


/**
 * Get array with profiles id
 * @param callback
 * @returns {Array}
 */
FbSharesParser.prototype._getSharesProfilesId = function (callback) {
    // Parse profile urls
    var profilesLinks = $('#repost_view_dialog .clearfix .profileLink[data-hovercard]'),
        results = {},
        profileId,
        profileLink;
    profilesLinks.each(function () {
        try {
            profileLink = $(this).attr('data-hovercard');
            if (profileId = profileLink.match(/user\.php\?id=([0-9]+)&/)) {
                results[profileId[1]] = true;
            }
        } catch (e) {
            console.log('Error');
            console.log(e);
        }
    });

    return Object.keys(results);
};