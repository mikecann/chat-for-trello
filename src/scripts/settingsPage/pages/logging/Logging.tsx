import * as React from "react";
import { observer, inject } from "mobx-react";
import { Header, Segment, Form, Dropdown, Button, Icon } from "semantic-ui-react";
import { observable, action } from "mobx";
import { LogEntriesTable } from "./LogEntriesTable";
import { Page } from "../../components/Page";
import { SaveButton } from "../../components/SaveButton";
import { AppSettings } from "../../../common/config";
import { waitForMilliseconds } from "../../../common/utils";
import { ILogger, LogLevel } from "../../../lib/logging/types";
import { AppSettingsStore } from "../../../lib/settings/AppSettingsStore";
import { LogsStore } from "../../../lib/logging/LogsStore";
import { Extension } from "../../../lib/extension/Extension";

interface Props {
    logger?: ILogger;
    location: Location;
    settings: AppSettingsStore<AppSettings>;
    logs: LogsStore;
    extension: Extension;
}

const loggingLevelOptions = [
    {
        text: "Debug",
        value: "debug"
    },
    {
        text: "Info",
        value: "info"
    },
    {
        text: "Warn",
        value: "warn"
    },
    {
        text: "Error",
        value: "error"
    }
];

@inject("logger", "settings", "logs", "extension")
@observer
export class Logging extends React.Component<Props, {}> {
    @observable logEntriesTableVisible = false;

    onLogLevelChanged = (e: any, { value }: { value: LogLevel }) =>
        this.props.settings.update({ logLevel: value });

    onDownloadLogsClicked = () => this.props.logs.download();

    @action
    toggleLogEntriesTableVisible = () =>
        (this.logEntriesTableVisible = !this.logEntriesTableVisible);

    onSave = () => {
        if (!confirm("Changing the log level will restart the extension.")) return false;

        this.props.settings.commit();
        waitForMilliseconds(250).then(() => {
            this.props.extension.sendReboot();
            window.close();
        });

        return true;
    };

    render() {
        const settingsStore = this.props.settings;
        const settings = settingsStore.settings;
        const logs = this.props.logs;

        return (
            <Page location={this.props.location}>
                <Segment>
                    <Header as="h1">Logging Settings</Header>
                    <Form>
                        <Form.Field style={{ marginTop: 40, marginBottom: 40 }}>
                            <label>Log Level</label>
                            <Dropdown
                                placeholder="Level"
                                selection
                                value={settings.logLevel}
                                onChange={this.onLogLevelChanged}
                                options={loggingLevelOptions}
                                style={{ width: 200 }}
                            />
                        </Form.Field>

                        <SaveButton needsSave={settingsStore.isDirty} onSave={this.onSave} />
                    </Form>
                </Segment>
                <Segment>
                    <Header as="h3">Log</Header>

                    {this.logEntriesTableVisible ? (
                        <Button onClick={this.toggleLogEntriesTableVisible}>
                            {" "}
                            <Icon name="eye" /> Hide
                        </Button>
                    ) : (
                        <Button onClick={this.toggleLogEntriesTableVisible}>
                            {" "}
                            <Icon name="eye slash" /> Show
                        </Button>
                    )}

                    <Button onClick={() => logs.clear()}>
                        <Icon name="trash" /> Clear
                    </Button>

                    <Button onClick={this.onDownloadLogsClicked}>
                        <Icon name="download" /> Download
                    </Button>

                    {this.logEntriesTableVisible ? (
                        <Form style={{ marginTop: 20 }}>
                            <LogEntriesTable style={{ minHeight: 500 }} entries={logs.entries} />
                        </Form>
                    ) : null}
                </Segment>
            </Page>
        );
    }
}
