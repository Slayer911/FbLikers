var frontController = {

    fbCLikerController: null,

    /**
     * Init
     */
    'init': function () {

        var storage = new StorageDb('FbLiker');
        /**
         * @type {FbLikerController}
         */
        this.fbCLikerController = new FbLikerController(storage);
        /**
         *  @type {ParserActivityController}
         **/
        this.parserActivityController = new ParserActivityController(storage, 'Parse');

        /**
         * @type {BrowserNavigation}
         */
        this.browserNavigator = new BrowserNavigation('#FbLiker');


        this.initElements();
        this.checkBlocks();
        this.initEvents();
    },

    /**
     * Init elements
     */
    'initElements': function () {
        this.elements = {};
        this.elements = {
            'parserStopButton': $('.btn_parser_stop'),
            'parserStartButton': $('.btn_parser_start'),
            'urlListTextArea': $('[name="postsUrl"]'),
            'urlListStatus': $('#urlList-status'),
            'resultStatus': $('#result-status'),
            'downloadResults': $('#result-download'),
            'resultFlush': $('#result-flush')
        };

        // Restore last parser activity values
        this.parserActivityController.restoreDomInterfaceOptions();
    },


    /**
     * Check blocks
     */
    'checkBlocks': function () {
        var self = this;
        this.fbCLikerController.isActive(function (isActive) {
            if (isActive) {
                self.elements.parserStopButton.show();
                self.elements.parserStartButton.hide();
                self.elements.urlListTextArea.attr('disabled', 'disabled');
                // Disable parser activity interface
                self.parserActivityController.disableDomInterface();

            } else {
                self.elements.parserStartButton.show();
                self.elements.parserStopButton.hide();
                self.elements.urlListTextArea.removeAttr('disabled');
                // Activate parser activity interface
                self.parserActivityController.activateDomInterface();
            }
            self.calculatePluginStat();
        });
    },

    /**
     * Init events
     */
    'initEvents': function () {
        var self = this;
        self.elements.urlListTextArea.change(function () {
            self.fbCLikerController.setUrlList(self._getUrlListFromField());
        });
        this.elements.parserStartButton.click(function () {
            self._eventParserStart();
        });
        this.elements.parserStopButton.click(function () {
            self.fbCLikerController.stop();
            self.checkBlocks();
        });
        this.elements.downloadResults.click(function () {
            self.fbCLikerController.downloadResults('result');
        });
        this.elements.resultFlush.click(function () {
            if (confirm('Вы точно хотите очистить собранные профили с памяти ?')) {
                self.fbCLikerController.flushResult();
                self.checkBlocks();
            }
        });
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            self.checkBlocks();
        });
        // Set change detector of parser activity
        this.parserActivityController.setChangeDetector();
    },

    /**
     * Event - start parser
     */
    '_eventParserStart': function () {
        var urlList = this._getUrlListFromField();
        this.fbCLikerController.start(urlList);
        this.checkBlocks();
        // Move to next page
        var nextUrl = urlList.shift();
        if (nextUrl) {

            // Check parsers
            var parserActivity = this.parserActivityController.getNewActivity();
            if (this.parserActivityController.atLeastOneItemIsActive(parserActivity)) {

                if(parserActivity.FbPostsParser){
                    var activeParsers = this.parserActivityController.getActiveParsers(parserActivity);
                    if(activeParsers.length > 1){
                        alert('Парсер "post" нельзя запускать с другими парсерами.');
                        this.fbCLikerController.stop();
                        return;
                    }
                }

                window.open(this.browserNavigator.getUrlWithModuleHash(nextUrl),this.browserNavigator.moduleHash,'location,width=1200,height=1000,top=0');
            } else {
                alert('Вы должны выбрать по крайней мере 1 тип парсинга');
                this.fbCLikerController.stop();
            }

        } else {
            alert('Нет записей');
            this.fbCLikerController.stop();
        }
    },

    /**
     * Get url list from client field
     * @returns {*}
     */
    '_getUrlListFromField': function () {
        var urlList = this.elements.urlListTextArea.val();
        urlList = urlList.split("\n");

        return urlList;
    },

    /**
     * Init plugin stat
     */
    'calculatePluginStat': function () {
        var self = this;
        this.fbCLikerController.getUrlList(function (urlList) {
            self.elements.urlListTextArea.val(urlList.join("\n"));
        });
        this.fbCLikerController.getDoneUrlList(function (urlDoneList) {
            self.elements.urlListStatus.html('Обработано ' + parseInt(urlDoneList.length) + ' url');
        });
        this.fbCLikerController.getResult(function (result) {
            self.elements.resultStatus.html('Собрано записей : ' + result.length);
        });
    }

};

$(function () {
    frontController.init()
});