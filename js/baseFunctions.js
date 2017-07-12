/**
 * Event fire
 * @param el
 * @param type
 */
function eventFire(el, type) {
    if (el.fireEvent) {
        el.fireEvent('on' + type);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(type, true, false);
        el.dispatchEvent(evObj);
    }
}

/**
 * Create csv file from objct
 * @param objectsArray
 * @param delimiter
 * @returns {string|*}
 */
function objectToCsv(objectsArray, delimiter) {
    var csvHeaders = [],
        csvArray = [],
        csvArrayItem = [],
        itemObject;

    delimiter = delimiter ? delimiter : ';';

    for (var lineNumber in objectsArray) {
        if (objectsArray.hasOwnProperty(lineNumber)) {
            itemObject = objectsArray[lineNumber];
            csvArrayItem = [];
            for (var itemAttributeKey in itemObject) {
                if (itemObject.hasOwnProperty(itemAttributeKey)) {
                    // Add to csv header
                    if (lineNumber == 0) {
                        csvHeaders.push(itemAttributeKey);
                    }
                    // Add to csv string
                    itemAttributeValue = itemObject[itemAttributeKey];
                    csvArrayItem.push(itemAttributeValue);
                }
            }
            csvArray.push(csvArrayItem.join(delimiter));
        }
    }

    csvString = csvArray.join("\n");
    csvString = csvHeaders.join(delimiter) + "\n" + csvString;

    return csvString;
}

/**
 * Push data to download as file
 * @param fileName
 * @param urlData
 */
function downloadFile(fileName, urlData) {
    var hiddenElement = document.createElement('a');
    urlData = encodeURIComponent(urlData);
    hiddenElement.href = 'data:text/text;charset=UTF-8,' + '\uFEFF' + urlData;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName;
    hiddenElement.click();
}

/**
 * Cache jQuery selectors
 * @param selector
 * @returns {*}
 */
$.cache = function (selector) {
    if (!this._cacheElements) {
        this._cacheElements = [];
    }
    if (typeof this._cacheElements[selector] == "undefined") {
        this._cacheElements[selector] = $(selector);
    }

    return this._cacheElements[selector];
};