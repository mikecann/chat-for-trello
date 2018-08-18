import { UpdateRow } from "./UpdateRow";
import { Update } from "../../lib/updates/UpdatesLoader";
import React = require("react");

interface UpdatesProps extends React.Props<any> {
    updates: Update[];
}

export class Updates extends React.Component<UpdatesProps, {}> {
    render() {
        return (
            <div
                className="updates"
                style={{
                    maxHeight: 400,
                    width: 500,
                    overflowY: "scroll",
                    overflowX: "hidden"
                }}
            >
                {this.props.updates.map(u => (
                    <UpdateRow key={u.date + " " + u.version} update={u} />
                ))}
            </div>
        );
    }
}
