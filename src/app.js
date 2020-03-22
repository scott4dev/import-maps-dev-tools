import React, { useState, useEffect, useCallback } from "react";

const Imports = ({ title, data }) => (
    <div>
        <h6>{title}</h6>
        <ul>
            {Object.keys(data).map(key => (
                <li key={key}><a href={data[key]} target="_blank">{key}</a></li>
            ))}
        </ul>
    </div>
)

function contentScriptListener(setData, msg) {
    if (msg.detail.type === "query") {
        const ordered = {};
        const { imports } = JSON.parse(msg.detail.content);
        Object.keys(imports).sort().forEach(function (key) {
            ordered[key] = imports[key];
        });
        setData(prevData => Object.assign({}, prevData, { [msg.detail.key]: ordered }));
    }
}

const Panel = () => {
    const [data, setData] = useState({});
    const eventListener = useCallback((msg) => contentScriptListener(setData, msg))
    useEffect(() => {
        window.addEventListener("ext-content-script", eventListener);
        return () => {
            window.removeEventListener("ext-content-script", eventListener);
        };
    }, []);
    console.log('render...', data, Object.keys(data));
    return (
        <React.Fragment>
            {Object.keys(data).map(key => (
                <Imports key={key} title={key} data={data[key]} />
            ))}
        </React.Fragment>
    )
}

export default () => (
    <React.StrictMode>
        <Panel />
    </React.StrictMode>
);
