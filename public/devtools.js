function onPanelCreated(panel) {
    let portToBackground;

    panel.onShown.addListener(panelWindow => {
        // connect inspectedWindow the background engine
        portToBackground = chrome.runtime.connect({
            name: '' + chrome.devtools.inspectedWindow.tabId,
        });
        portToBackground.onMessage.addListener(msg => {
            // forward incoming messages to the panel window
            const custEvent = new CustomEvent("ext-content-script", {
                detail: msg
            });
            panelWindow.dispatchEvent(custEvent);
        });
    });

    panel.onHidden.addListener(() => {
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