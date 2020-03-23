function onPanelCreated(panel) {
    let portToBackground;

    panel.onShown.addListener(panelWindow => {
        // connect inspectedWindow the background engine
        portToBackground = chrome.runtime.connect({
            name: '' + chrome.devtools.inspectedWindow.tabId,
        });
        portToBackground.onMessage.addListener(function (msg) {
            // forward incoming messages to the panel window
            const custEvent = new CustomEvent("ext-content-script", {
                detail: msg
            });
            panelWindow.dispatchEvent(custEvent);
        });

        chrome.devtools.network.onRequestFinished.addListener(function (event) {
            // forward incoming messages to the panel window
            const custEvent = new CustomEvent("ext-content-script", {
                detail: {
                    type: 'request',
                    event
                }
            });
            panelWindow.dispatchEvent(custEvent);
        });
    });

    panel.onHidden.addListener(function () {
        portToBackground.disconnect();
        portToBackground = null;
    });
}

// Create a new panel
chrome.devtools.panels.create(
    "Import maps", //title
    null, //iconPath
    "panel.html", //pagePath
    onPanelCreated //callback
);