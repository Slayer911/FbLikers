/**
 * Browser navigation
 * @param moduleHash
 * @constructor
 */
BrowserNavigation = function (moduleHash) {
    this.moduleHash = moduleHash;
};

/**
 * Check current module hash
 * @returns {boolean}
 */
BrowserNavigation.prototype.isCurrentModule = function () {
    return location.hash == this.moduleHash;
};

/**
 * Make browser request
 * @param url
 */
BrowserNavigation.prototype.request = function (url) {
    location.href = this.getUrlWithModuleHash(url);
};

/**
 * Get url with module hash
 * @param url
 * @returns {*}
 */
BrowserNavigation.prototype.getUrlWithModuleHash = function (url) {
    return url + this.moduleHash;
};