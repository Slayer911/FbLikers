/**
 * Background script, which run parsers
 * @constructor
 */
var ContentController = function (prefix) {

    /* @type {BrowserNavigation} */
    this.browserNavigator = new BrowserNavigation('#'+prefix);

    /* @type {StorageDb} */
    this.storage = new StorageDb(prefix);

    /* @type {ParserActivityController} */
    this.parserActivityController = new ParserActivityController(this.storage, 'Parse');

    /* @type {FbLikerController} */
    this.fbCLikerController = new FbLikerController(this.storage);

    // Set time limit for one page
    this.timeLimitForOnePage = 180;
};

/**
 * Run
 */
ContentController.prototype.run = function () {
    // Check tab for work
    if (this.browserNavigator.isCurrentModule()) {
        this._checkActivity();
    }
};

/**
 * Check activity
 * @private
 */
ContentController.prototype._checkActivity = function () {
    var self = this;

    // Check fbCLikerController activity
    this.fbCLikerController.isActive(function (isActive) {
        if (isActive) {

            // Check parsers activity
            self.parserActivityController.cachedParsedActivityHasActive(function (isActive) {
                if (isActive) {

                    // Run activity
                    self._runActivity();

                } else {
                    self.fbCLikerController.stop();
                    alert('You must select at least one parser');
                }
            });
        }
    });
};


/**
 * Run activity
 */
ContentController.prototype._runActivity = function () {

    var self = this;

    // Get url list
    this.fbCLikerController.getUrlList(function (urlList) {

        console.log(urlList);
        var currentUrl = urlList.shift();
        console.log('Current url '+currentUrl);

        // Make parser composite, and run all parsers
        self.parserActivityController.getCachedActivity(function (parserActivity) {
            var activeParsers = self.parserActivityController.getActiveParsers(parserActivity),
                parserComposite = new ParserComposite(activeParsers, self.fbCLikerController);
            parserComposite.currentUrl = currentUrl;

            parserComposite.run(function () {

                // Note url as completed
                self.fbCLikerController.moveUrlForParseToDoneUrlList(currentUrl);

                // Active next step
                self._afterActivity(urlList);

            });
        });

        // Create time limit
        self.pageTimeOut = setTimeout(function () {

            console.log('Page timeOut of ' + self.timeLimitForOnePage + ' sec.');

            // Active next step
            self._afterActivity(urlList);

        }, (self.timeLimitForOnePage * 1000));

    });
};

/**
 * After activity
 * @param urlList
 */
ContentController.prototype._afterActivity = function (urlList) {

    console.log(urlList);
    var nextUrl = urlList.shift();
    console.log('NextUrl url '+nextUrl);

    // Clear time limit
    if (typeof this.pageTimeOut != 'undefined') {
        clearTimeout(this.pageTimeOut);
    }

    if (nextUrl) {
        // Move to next page
        this.browserNavigator.request(nextUrl);
    } else {

        // Activate parser activity interface
        this.parserActivityController.activateDomInterface();

        // Stop
        this.fbCLikerController.stop();

        alert('complete');
        window.close();
    }
};