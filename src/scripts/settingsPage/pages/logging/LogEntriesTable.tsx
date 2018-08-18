import * as React from "react";
import { observer, inject } from "mobx-react";
import Table from "semantic-ui-react/dist/commonjs/collections/Table/Table";
import { observable, computed, action } from "mobx";
import { Button } from "semantic-ui-react";
import { LogMessage } from "../../../common/logging";
import { LogEntry, ILogger } from "../../../lib/logging/types";

interface Props {
    logger?: ILogger;
    style: any;
    entries: LogEntry[];
}

@inject("logger")
@observer
export class LogEntriesTable extends React.Component<Props, {}> {
    render() {
        const { style, entries } = this.props;
        return (
            <Table celled style={style}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Time</Table.HeaderCell>
                        <Table.HeaderCell>Level</Table.HeaderCell>
                        <Table.HeaderCell>Page</Table.HeaderCell>
                        <Table.HeaderCell>Channel</Table.HeaderCell>
                        <Table.HeaderCell>Message</Table.HeaderCell>
                        <Table.HeaderCell>Args</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {entries.map((m, i) => <LogEntryRow key={i} entries={m} />)}
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
export class LogEntryRow extends React.Component<{ entries: LogEntry }, {}> {
    @observable isOpen = false;

    @computed
    get parts() {
        const obj: any[] = JSON.parse(this.props.entries.json);
        return {
            message: obj[0] + "",
            args: JSON.stringify(obj.slice(1))
        };
    }

    @action open = () => (this.isOpen = true);

    render() {
        const { entries } = this.props;
        const color = colors[entries.level];
        return (
            <Table.Row style={{ color }}>
                <Table.Cell>{entries.time}</Table.Cell>
                <Table.Cell>{entries.level}</Table.Cell>
                <Table.Cell>{entries.page}</Table.Cell>
                <Table.Cell>{entries.channel}</Table.Cell>
                <Table.Cell>{this.parts.message}</Table.Cell>
                <Table.Cell>
                    {this.isOpen ? this.parts.args : <Button onClick={this.open}>...</Button>}
                </Table.Cell>
            </Table.Row>
        );
    }
}
