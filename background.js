const ports = {};

function installContentScript(tabId) {
    chrome.tabs.executeScript(
        tabId,
        { file: '/content.js' },
        function () { },
    );
}

function isNumeric(str) {
    return +str + '' === str;
}

function doublePipe(one, two) {
    console.log('double-pipe', one, two)
    one.onMessage.addListener(lOne);
    function lOne(message) {
        console.log('lOne', message)
        two.postMessage(message);
    }
    two.onMessage.addListener(lTwo);
    function lTwo(message) {
        console.log('lOne', message)
        one.postMessage(message);
    }
    function shutdown() {
        one.onMessage.removeListener(lOne);
        two.onMessage.removeListener(lTwo);
        one.disconnect();
        two.disconnect();
    }
    one.onDisconnect.addListener(shutdown);
    two.onDisconnect.addListener(shutdown);
}

chrome.runtime.onConnect.addListener(function (port) {
    console.log('addListener', port.name)
    let tab = null;
    let name = null;
    if (isNumeric(port.name)) {
        tab = port.name;
        name = 'devtools';
        installContentScript(+port.name);
    } else {
        tab = port.sender.tab.id;
        name = 'content-script';
    }

    if (!ports[tab]) {
        ports[tab] = {
            devtools: null,
            'content-script': null,
        };
    }
    ports[tab][name] = port;

    console.log('onConnect', ports);

    if (ports[tab].devtools && ports[tab]['content-script']) {
        doublePipe(ports[tab].devtools, ports[tab]['content-script']);
    }
});
