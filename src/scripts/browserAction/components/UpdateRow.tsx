import React = require("react");
import marked = require("marked");
import { Update } from "../../helpers/UpdatesLoader";

interface UpdateRowProps extends React.Props<any> {
    update: Update;
}

export class UpdateRow extends React.Component<UpdateRowProps, {}> {
    rawMarkup() {
        var rawMarkup = marked(this.props.update.notes, { sanitize: false });
        return { __html: rawMarkup };
    }

    render() {
        return (
            <div>
                <h2 className="update-title">
                    New in {this.props.update.version} ({this.props.update.date}){" "}
                </h2>
                <p dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}
