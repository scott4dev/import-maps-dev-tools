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
        return (<span>{Math.round(size / 1024)}</span>)
    }
    return null;
};

function Files({ active, data }) {
    const files = [];
    Object.keys(data).sort().forEach(function (key) {
        if (data[key].source === active) {
            files.push(data[key]);
        }
    });
    return (
        <>
            <table className="details">
                <thead>
                    <tr>
                        <td>specifier</td>
                        <td>kb</td>
                        <td>file</td>
                    </tr>
                </thead>
                <tbody>
                    {files.map(function (file) {
                        return (
                            <tr key={file.key} id="file">
                                <td style={{ whiteSpace: "nowrap" }}>{file.key}</td>
                                <td style={{ textAlign: 'right' }}><FileSize size={file.size} /></td>
                                <td className="file"><span style={{ color: "#cf4c49" }}>{file.url}</span></td>
                                {/* <td className="file"><a href={file.url} target="_blank" style={{ color: "#cf4c49" }}>{file.url}</a></td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}

const Panel = () => {
    const [active, setActive] = useState();
    const [state, dispatch] = useReducer(reducer, initialState);
    const eventListener = useCallback((msg) => msg.detail && dispatch(msg.detail))
    useWindowEvent("ext-content-script", eventListener);
    console.log('render...', state);
    return (
        <React.Fragment>
            {state.sources.map((source) => (
                <>
                    <div className="row">
                        Found script[type="{source}"]
                    </div>
                    <div className="row">
                        <Files data={state.files} active={source} />
                    </div>
                </>
            ))}
            <div className="row">
                {/* <span>{new Date().toLocaleTimeString()}</span> */}
                <a href="#" onClick={() => dispatch({ type: 'reset' })}>clear</a>
            </div>
            {/* <div className="row">
                <Sources data={state.sources} onSelect={setActive} />
            </div>
            <div className="row">
                <Files data={state.files} active={active} />
            </div> */}
        </React.Fragment>
    )
}

export default () => (
    <React.StrictMode>
        <Panel />
    </React.StrictMode>
);
