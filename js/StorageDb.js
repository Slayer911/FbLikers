/**
 * StorageDb controller
 * @param {string} prefix
 * @constructor
 */
var StorageDb = function (prefix) {
    this._prefix = prefix + '_';
};

/**
 * Save to StorageDb
 * @param {string} name
 * @param {*} data
 */
StorageDb.prototype.set = function (name, data) {
    name = this._getStorageDbFullKey(name);
    storage = {};
    storage[name] = data;
    chrome.storage.local.set(storage);
};

/**
 * Get from StorageDb
 * @param name
 * @param callback
 */
StorageDb.prototype.get = function (name, callback) {
    name = this._getStorageDbFullKey(name);
    chrome.storage.local.get(function (storage) {
        result = undefined;
        if (typeof storage[name] != "undefined") {
            result = storage[name];
        }
        callback(result);
    });
};

/**
 * Get StorageDb full key
 * @param {string} name
 * @returns {*}
 * @private
 */
StorageDb.prototype._getStorageDbFullKey = function (name) {
    name = this._prefix + name;
    return name;
};