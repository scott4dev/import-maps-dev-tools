/* global chrome */
'use strict';

let backendDisconnected = false;
let backendInitialized = false;

const selectors = {
    'systemjs-importmap': "script[type='systemjs-importmap']",
    'importmap-shim': "script[type='importmap-shim']",
    'importmap': "script[type='importmap']"
}

function extract(key) {
    const element = document.querySelector(selectors[key])
    console.log(key, element);
    if (element) {
        // window.postMessage(
        //     {
        //         source: 'import-maps-devtools-content-script',
        //         payload: {
        //             key,
        //             content: element.innerHTML
        //         },
        //     },
        //     '*',
        // );
        port.postMessage({
            type: 'query',
            key,
            content: element.innerHTML
        });
    }
}

function handleMessageFromDevtools(message) {
    console.log('handleMessageFromDevtools', message);
    // window.postMessage(
    //     {
    //         source: 'import-maps-devtools-content-script',
    //         payload: message,
    //     },
    //     '*',
    // );
}

function handleMessageFromPage(evt) {
    if (
        evt.source === window &&
        evt.data // &&
        // evt.data.source === 'import-maps-devtools-bridge'
    ) {
        backendInitialized = true;
        port.postMessage(evt.data.payload);
    }
}

function handleDisconnect() {
    backendDisconnected = true;
    window.removeEventListener('message', handleMessageFromPage);
    window.postMessage(
        {
            source: 'import-maps-devtools-content-script',
            payload: {
                type: 'event',
                event: 'shutdown',
            },
        },
        '*',
    );
}

// proxy from main page to devtools (via the background page)
const port = chrome.runtime.connect({
    name: 'content-script',
});
port.onMessage.addListener(handleMessageFromDevtools);
port.onDisconnect.addListener(handleDisconnect);

window.addEventListener('message', handleMessageFromPage);
// window.addEventListener('popstate', handleMessageFromPage);

extract('systemjs-importmap');
extract('importmap-shim');
extract('importmap');