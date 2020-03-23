import React from "react";

const Entry = ({ url, size, description }) => {
    return <tr>
        <td>{description}</td>
        <td>{size}</td>
        <td><a href={url} target="_blank">file</a></td>
    </tr>
}

export default ({ title, data }) => (
    <div>
        <h6>{title}</h6>
        <table>
            {Object.keys(data).map(key => (
                <Entry key={key} {...data[key]} />
            ))}
        </table>
    </div>
)