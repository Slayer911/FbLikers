var currentHash = location.hash;
$(function () {
    // Run background
    var contentController = new ContentController('FbLiker');
    contentController.browserNavigator.currentHash = currentHash;
    contentController.run();
});