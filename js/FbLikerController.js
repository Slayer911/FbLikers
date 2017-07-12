/**
 * Fb Liker
 * @param {StorageDb} storageDb
 * @constructor
 */
var FbLikerController = function (storageDb) {
    if (!(storageDb instanceof StorageDb)) {
        throw('Input variable "storageDb" must be instance of "StorageDb" class');
    }
    /**
     * @var {StorageDb} storage
     */
    this.storage = storageDb;
};

/**
 * Set start date, which auto accept background script
 * @param urlList
 * @returns {boolean}
 */
FbLikerController.prototype.start = function (urlList) {
    if (!(urlList instanceof Array)) {
        throw('"urlList" must be array');
    }
    if (urlList.length) {
        this._setUrlList(urlList);
        this._setStatus(true);
    }
    this._flushDoneUrlList();

    return true;
};

/**
 * Stop search, and flush url list
 */
FbLikerController.prototype.stop = function () {
    this._setStatus(false);
};

/**
 * Is module is active
 * @returns {boolean}
 */
FbLikerController.prototype.isActive = function (callback) {
    this.storage.get('status', function (status) {
        callback(!!status);
    });
};

/**
 * Get current url list
 * @returns {Array}
 */
FbLikerController.prototype.getUrlList = function (callback) {
    this.storage.get('urlList', function (urlList) {
        callback(urlList);
    });
};

/**
 * Get "Done url list"
 * @returns {Array}
 */
FbLikerController.prototype.getDoneUrlList = function (callback) {
    this.storage.get('doneUrlList', function (doneUrlList) {
        callback(doneUrlList || []);
    });
};

/**
 * Add result by parsing
 * @param url
 * @param profilesId
 */
FbLikerController.prototype.addResult = function (url, profilesId) {
    var self = this;
    this._moveUrlForParseToDoneUrlList(url);
    this.getResult(function (result) {
        var profileId;
        for (var key in profilesId) {
            if (profilesId.hasOwnProperty(key)) {
                profileId = profilesId[key];
                result.push({
                    'from': url,
                    'fb_id': profileId
                });
            }
        }

        self.storage.set('result', result);
    });
};

/**
 * Get result
 */
FbLikerController.prototype.getResult = function (callback) {
    this.storage.get('result', function (result) {
        callback(result || []);
    });
};

/**
 * Flush result
 */
FbLikerController.prototype.flushResult = function () {
    this.storage.set('result', []);
};

/**
 * Download result as csv file
 * @param fileName
 */
FbLikerController.prototype.downloadResults = function (fileName) {
    this.getResult(function (result) {
        result = objectToCsv(result);

        downloadFile(fileName + '.csv', result);
    });
};

/**
 * Move url from "Task url list" to "Done url list"
 * @param url
 * @private
 */
FbLikerController.prototype._moveUrlForParseToDoneUrlList = function (url) {
    var self = this;
    this._addToDoneUrlList(url);
    this.getUrlList(function (urlList) {
        urlIndex = urlList.indexOf(url);
        if (urlIndex != -1) {
            urlList.splice(urlIndex, 1);
            self._setUrlList(urlList);
        }
    });
};

/**
 * Add url to "Done url list"
 * @param url
 * @private
 */
FbLikerController.prototype._addToDoneUrlList = function (url) {
    var self = this;
    this.getDoneUrlList(function (doneUrlList) {
        doneUrlList.push(url);
        self.storage.set('doneUrlList', doneUrlList);
    });
};

/**
 * Flush "Done url list"
 * @param url
 * @private
 */
FbLikerController.prototype._flushDoneUrlList = function (url) {
    this.storage.set('doneUrlList', []);
};

/**
 * Set status of activity
 * @param active
 * @private
 */
FbLikerController.prototype._setStatus = function (active) {
    active = active ? 1 : 0;
    this.storage.set('status', active);
};

/**
 * Set url list
 * @param urlList
 */
FbLikerController.prototype._setUrlList = function (urlList) {
    this.storage.set('urlList', urlList);
};