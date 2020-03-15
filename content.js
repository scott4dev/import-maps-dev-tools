function query(selector) {
    const content = document.querySelector(selector) || {};
    return content.innerHTML;
}

function printImports(data) {
    const unordered = data.imports;
    const ordered = {};
    Object.keys(unordered).sort().forEach(function (key) {
        ordered[key] = unordered[key];
    });
    console.table(ordered);
}

function printSrcAttribute(content) {
    const src = content.getAttribute("src")
    if (src) {
        console.log("Fetched from:", src);
        fetch(src).then(function (response) {
            return response.json()
        }).then(printImports).catch(console.error);
    }
}

function printInnerHTML(content) {
    if (content.innerHTML) {
        console.log("Embedded in the DOM");
        printImports(JSON.parse(content.innerHTML));
    }
}

function print(selector) {
    const content = document.querySelector(selector);
    if (content) {
        console.log('Import-maps for:', selector);
        printInnerHTML(content);
        printSrcAttribute(content);
    }
}

let analyse = function () {
    chrome.runtime.sendMessage({ 'title': document.title });
    chrome.runtime.sendMessage({
        query: 'importmap',
        content: query("script[type='importmap']")
    });
    chrome.runtime.sendMessage({
        query: 'importmap-shim',
        content: query("script[type='importmap-shim']")
    });
    chrome.runtime.sendMessage({
        query: 'systemjs-importmap',
        content: query("script[type='systemjs-importmap']")
    });
}

analyse();
print("script[type='systemjs-importmap']");
print("script[type='importmap-shim']");