import React, { useCallback, useReducer, useState } from "react";
import Imports from './imports';
import { useWindowEvent } from './hooks';
import { reducer, initialState } from './reducer';

const Sources = ({ data, onSelect }) => (
    <ul id="sources">
        {data.map(function (item) {
            return <li key={item} onClick={() => onSelect(item)}>{item}</li>
        })}
    </ul>
);

const FileSize = ({ size }) => {
    if (size) {
       return (<span>{Math.round(size/1024)} kb</span>)
    }
    return null;
};

function Files({ active, data }) {
    const files = [];
    Object.keys(data).forEach(function (key) {
        if (data[key].source === active) {
            files.push(data[key]);
        }
    });
    return (
        <>
            <span>{active}</span>
            <ul id="files">
                {files.map(function (file) {
                    return (
                        <li key={file.key} id="file">
                            <a href={file.url}>{file.key}</a> <FileSize size={file.size} />
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

const Panel = () => {
    const [active, setActive] = useState();
    const [state, dispatch] = useReducer(reducer, initialState);
    const eventListener = useCallback((msg) => dispatch(msg.detail))
    useWindowEvent("ext-content-script", eventListener);
    console.log('render...', state);
    return (
        <React.Fragment>
            <div id="actions">
                <span>{new Date().toLocaleTimeString()}</span>
                <button onClick={() => dispatch({ type: 'reset' })}>clear</button>
            </div>
            <Sources data={state.sources} onSelect={setActive} />
            <Files data={state.files} active={active} />
        </React.Fragment>
    )
}

export default () => (
    <React.StrictMode>
        <Panel />
    </React.StrictMode>
);
