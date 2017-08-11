/**
 * Controller of parse item options
 * @param {StorageDb} storageDb
 * @param {string} inputBaseName
 * @constructor
 */
var ParserActivityController = function (storageDb, inputBaseName) {
    if (!(storageDb instanceof StorageDb)) {
        throw('Input variable "storageDb" must be instance of "StorageDb" class');
    }
    /* @var {StorageDb} storage */
    this.storage = storageDb;
    this.inputBaseName = inputBaseName;

    this.$allInputs = $(this._getInputSelectorOfKey());
};

/**
 * Disable dom interface
 */
ParserActivityController.prototype.disableDomInterface = function () {
    this.$allInputs.attr("disabled", true);
};

/**
 * Activate dom interface
 */
ParserActivityController.prototype.activateDomInterface = function () {
    this.$allInputs.removeAttr("disabled");
};

/**
 * Parsed dom, and return new parsers activity
 * @returns {{}}
 */
ParserActivityController.prototype.getNewActivity = function () {
    var self = this,
        parseOptions = {};
    this.$allInputs.each(function () {
        var key = self._getKeyOfInputName($(this).attr('name'));
        parseOptions[key] = $(this).is(':checked');
    });
    this.storage.set('parserActivity', parseOptions);

    return parseOptions;
};


/**
 * Get last cached parser activity
 * @param callback
 */
ParserActivityController.prototype.getCachedActivity = function (callback) {
    this.storage.get('parserActivity', function (doneUrlList) {
        callback(doneUrlList || {});
    });
};


/**
 * Check, if cached date have active parsers
 * @param callback
 */
ParserActivityController.prototype.cachedParsedActivityHasActive = function (callback) {
    var self = this;
    this.getCachedActivity(function (data) {
        callback(self.atLeastOneItemIsActive(data));
    });
};

/**
 * Check, if at least one item is active
 * @param data
 */
ParserActivityController.prototype.atLeastOneItemIsActive = function (data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key]) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Get active parsers
 * @param data
 * @returns {Array}
 */
ParserActivityController.prototype.getActiveParsers = function (data) {
    var activeParsers = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key]) {
                activeParsers.push(key);
            }
        }
    }

    return activeParsers;
};


/**
 * Set handler for change activity, and change also cache
 */
ParserActivityController.prototype.setChangeDetector = function () {
    var self = this;
    this.$allInputs.change(function () {
        self.getNewActivity();
    });
};


/**
 * Restore parse options by last cached data
 */
ParserActivityController.prototype.restoreDomInterfaceOptions = function () {
    var self = this;
    this.getCachedActivity(function (data) {
        var keyValue;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                keyValue = data[key];
                $input = $(self._getInputSelectorOfKey(key));
                if ($input.length) {
                    $input.prop("checked", keyValue);
                }
            }
        }
    });
};


/**
 * Get key by input name
 * @param inputName
 * @returns {*}
 */
ParserActivityController.prototype._getKeyOfInputName = function (inputName) {
    inputName = inputName.replace((this.inputBaseName + '['), '');
    inputName = inputName.replace(']', '');
    return inputName;
};

/**
 * Get input selector by key
 * @param key
 * @returns {string}
 */
ParserActivityController.prototype._getInputSelectorOfKey = function (key) {
    return '[name^="' + this._getInputNameOfKey(key) + '"]';
};

/**
 * Get input name by key
 * @param key
 * @returns {string}
 * @private
 */
ParserActivityController.prototype._getInputNameOfKey = function (key) {
    var inputName = this.inputBaseName + '[';
    if (key) {
        inputName = inputName + key + ']';
    }

    return inputName;
};