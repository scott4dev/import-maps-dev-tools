// const ordered = {};
//     Object.keys(unordered).sort().forEach(function (key) {
//         ordered[key] = unordered[key];
//     });
//     console.table(ordered);

function log() {
    console.log('app.js', arguments);
}

window.addEventListener("ext-content-script", log);