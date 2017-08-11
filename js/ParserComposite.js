/**
 * ParserComposite
 * @param {Array} parsers
 * @param {FbLikerController} fbCLikerController
 * @constructor
 */
var ParserComposite = function (parsers, fbCLikerController) {
    if (!(fbCLikerController instanceof FbLikerController)) {
        throw('Input variable "fbCLikerController" must be instance of "FbLikerController" class');
    }
    this.parsers = parsers;
    this.fbCLikerController = fbCLikerController;
    this.currentUrl = location.href;
};

/**
 * Run all parsers
 * @param callback
 */
ParserComposite.prototype.run = function (callback) {
    var self = this,
        parserObject,
        currentParser = this.parsers.shift();
    if (currentParser) {
        this._clearPageForNextParser();
        console.log('Run parser "'+currentParser+'"');
        parserObject = self._createParserObject(currentParser);
        self._createRunParserPromise(parserObject).then(function () {
            self.run(callback);
        })
    } else {
        callback();
    }
};


/**
 * Create parser object
 * @param name
 * @returns {*}
 */
ParserComposite.prototype._createParserObject = function (name) {
    var parserObject;
    if (typeof window[name] != 'undefined') {
        parserObject = new window[name];
    } else {
        throw('Parser "' + name + '" not found');
    }

    return parserObject;
};

/**
 * Clear page by previous parser work
 */
ParserComposite.prototype._clearPageForNextParser = function () {
    $('.layerCancel,[data-testid="xhp_fb__photos__snowliftclose"]').each(function () {
        eventFire($(this)[0], 'click')
    });
};

/**
 * Create promise for running parser
 * @param parser
 * @returns {Promise}
 */
ParserComposite.prototype._createRunParserPromise = function (parser) {
    var self = this;

    this._clearPageForNextParser();

    return new Promise(function (resolve) {
        parser.run(function (data) {

            // Add result to storage
            self.fbCLikerController.addResult(self.currentUrl, data);

            resolve();
        });
    });
};