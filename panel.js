/* global chrome */

let panelCreated = false;

function parsePageMessage(msg, error) {
    console.log('### parsePageElements', new Date())
    console.log(msg, error)
}

function createPanelIfReactLoaded() {
    if (panelCreated) {
        return;
    }

    const tabId = chrome.devtools.inspectedWindow.tabId;
    const port = chrome.runtime.connect({
        name: '' + tabId,
    });

    port.onMessage.addListener(parsePageMessage);
    panelCreated = true;
}

// Load (or reload) the DevTools extension when the user navigates to a new page.
function onNavigated() {
    console.log('chrome.devtools.network.onNavigated');
    // syncSavedPreferences();
    // createPanelIfReactLoaded();
}

chrome.devtools.network.onNavigated.addListener(onNavigated);
// fired when a network request is finished and all request data are available.
// https://developer.chrome.com/extensions/devtools_network#event-onRequestFinished
chrome.devtools.network.onRequestFinished.addListener(function (request) {
    chrome.devtools.inspectedWindow.eval(
        'console.log("Requested: " + unescape("' + escape(request.request.url) + '"))');
});

// Check to see if React has loaded once per second in case React is added
// after page load
// const loadCheckInterval = setInterval(function () {
//     createPanelIfReactLoaded();
// }, 1000);

// createPanelIfReactLoaded();
