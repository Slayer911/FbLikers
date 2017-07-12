/**
 * Fb Likers
 * @constructor
 */
FbLikers = function () {
};

/**
 * Run parser on current page
 * @param callback
 */
FbLikers.prototype.run = function (callback) {
    var self = this;
    self._openLikersPopup(function () {
        self._loadAllLikersPages(function () {
            var profilesId = self._getLikersProfilesId();
            callback(profilesId);
        })
    });
};

/**
 * Load all pages with likers on popup
 * @param callback
 */
FbLikers.prototype._loadAllLikersPages = function (callback) {
    // Load all likers pages
    var nextPageInterval = setInterval(function () {
        var nextPageElementSelector = '#reaction_profile_pager';

        nextPageElement = $(nextPageElementSelector + ' a');
        if (!nextPageElement.length) {
            clearInterval(nextPageInterval);
            callback();
        } else {
            eventFire(nextPageElement[0], 'click');
            nextPageElement.click();
        }
    }, 1000);
};

/**
 * Open popup with likers
 * @param {function} callback
 */
FbLikers.prototype._openLikersPopup = function (callback) {
    var self = this;

    setTimeout(function () {
        eventFire($('._2x4v')[0], 'click');
        setTimeout(function () {
            // Post open for full window
            if (self._closeFullScreenPost()) {
                // Try open popup again
                setTimeout(function () {
                    self._openLikersPopup(callback);
                }, 1000);
            } else {
                // return callback
                callback();
            }
        }, 1000);
    }, 2000);
};

/**
 * Close full screen post
 * @param callback
 * @returns {boolean}
 */
FbLikers.prototype._closeFullScreenPost = function (callback) {
    var closeButton = $('[data-testid="xhp_fb__photos__snowliftclose"]:visible');
    if (closeButton.length) {
        eventFire(closeButton[0], 'click');
        return true;

    }
    return false;
};

/**
 * Get array with profiles id
 * @param callback
 * @returns {Array}
 */
FbLikers.prototype._getLikersProfilesId = function (callback) {
    // Parse likers profile urls
    var likersAElements = $('._5j0e.fsl.fwb.fcb a'),
        results = [],
        profileData;
    likersAElements.each(function () {
        try {
            profileData = $(this).attr('data-gt');
            profileData = JSON.parse(profileData);
            results.push(profileData.engagement.eng_tid);
        }catch (e){}
    });
    return results;
};