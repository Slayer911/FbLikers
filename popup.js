var frontController = {

    fbCLikerController: null,

    /**
     * Init
     */
    'init': function () {

        var storage = new StorageDb('fbLiker');
        /**
         * @type {FbLikerController}
         */
        this.fbCLikerController = new FbLikerController(storage);
        /**
         * @type {BrowserNavigation}
         */
        this.browserNavigator = new BrowserNavigation('#fbLikers');


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
            } else {
                self.elements.parserStartButton.show();
                self.elements.parserStopButton.hide();
                self.elements.urlListTextArea.removeAttr('disabled');
            }
            self.calculatePluginStat();
        });
    },

    /**
     * Init events
     */
    'initEvents': function () {
        var self = this;
        this.elements.parserStartButton.click(function () {
            var urlList = self.elements.urlListTextArea.val();
            urlList = urlList.split("\n");
            self.fbCLikerController.start(urlList);
            self.checkBlocks();
            // Move to next page
            var nextUrl = urlList.shift();
            if (nextUrl) {
                chrome.tabs.update({url: self.browserNavigator.getUrlWithModuleHash(nextUrl)});
            } else {
                alert('Нет записей');
                self.fbCLikerController.stop();
            }
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
            self.elements.resultStatus.html('Собрано профилей : ' + result.length);
        });
    }

};

$(function () {
    frontController.init()
});