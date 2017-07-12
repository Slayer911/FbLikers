$(function () {

    var storage = new StorageDb('fbLiker');
    /**
     * @type {FbLikerController}
     */
    var fbCLikerController = new FbLikerController(storage);

    // Check activity
    fbCLikerController.isActive(function (isActive) {
        if (isActive) {

            // Create browser navigator
            var browserNavigator = new BrowserNavigation('#fbLikers');

            // Check tab for work
            if (browserNavigator.isCurrentModule()) {

                // Get url list
                fbCLikerController.getUrlList(function (urlList) {

                    // WORK with post
                    var fbLikers = new FbLikers();
                    fbLikers.run(function (profilesId) {

                        // Add result to storage
                        var currentUrl = urlList.shift();
                        fbCLikerController.addResult(currentUrl, profilesId);

                        // Move to next page
                        var nextUrl = urlList.shift();
                        if (nextUrl) {
                            browserNavigator.request(nextUrl);
                        } else {
                            // Stop
                            fbCLikerController.stop();
                            alert('complete');
                        }
                    });
                });
            }
        }
    });
});