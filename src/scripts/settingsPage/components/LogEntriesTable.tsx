import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "mikeysee-helpers";
import Table from "semantic-ui-react/dist/commonjs/collections/Table/Table";
import { LogMessage } from "../../helpers/ExtensionMessagingLogger";
import { observable, computed } from "mobx";
import { Button } from "semantic-ui-react";

interface Props {
    logger?: ILogger;
    style: any;
    messages: LogMessage[];
}

@inject("logger")
@observer
export class LogEntriesTable extends React.Component<Props, {}> {
    render() {
        const { style, messages } = this.props;
        return (
            <Table celled style={style}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Level</Table.HeaderCell>
                        <Table.HeaderCell>Page</Table.HeaderCell>
                        <Table.HeaderCell>Message</Table.HeaderCell>
                        <Table.HeaderCell>Args</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {messages.map((m, i) => <LogEntryRow key={i} message={m} />)}
                </Table.Body>
            </Table>
        );
    }
}

const colors = {
    debug: "blue",
    info: "teal",
    warn: "orange",
    error: "red"
};

@observer
export class LogEntryRow extends React.Component<{ message: LogMessage }, {}> {
    @observable isOpen = false;

    @computed
    get openMsg() {
        var data: any[] = this.props.message.data;
        data = data.slice(1);
        return JSON.stringify(data);
    }

    open = () => (this.isOpen = true);

    render() {
        const { message } = this.props;
        const color = colors[message.level];
        return (
            <Table.Row style={{ color }}>
                <Table.Cell>{message.time}</Table.Cell>
                <Table.Cell>{message.level}</Table.Cell>
                <Table.Cell>{message.pageName}</Table.Cell>
                <Table.Cell>{message.data[0] + ""}</Table.Cell>
                <Table.Cell>
                    {this.isOpen ? this.openMsg : <Button onClick={this.open}>...</Button>}
                </Table.Cell>
            </Table.Row>
        );
    }
}
