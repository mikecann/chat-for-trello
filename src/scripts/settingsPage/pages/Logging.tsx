import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Header, Segment, Form, Dropdown, Button, Icon } from 'semantic-ui-react';
import { AppSettingsModel } from '../../models/AppSettingsModel';
import { LogLevel } from '../../helpers/Logging';
import { LogMessagesFromExtensionModel } from '../../models/LogMessagesFromExtensionModel';
import { observable, runInAction } from 'mobx';
import { LogEntriesTable } from '../components/LogEntriesTable';
import { Page } from '../components/Page';
import { SettingsSaveButton } from '../components/SettingsSaveButton';
import { SaveButton } from '../components/SaveButton';
import { BackgroundPage } from '../../background/background';

interface Props {
    logger?: ILogger,
    location: Location,
    model: AppSettingsModel,
    logsModel: LogMessagesFromExtensionModel,
    background?: BackgroundPage
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
]
@inject("logger", "model", "logsModel", "background")
@observer
export class Logging extends React.Component<Props, {}>
{
    @observable logEntriesTableVisible = false;

    onLogLevelChanged = (e: any, { value }: { value: LogLevel }) =>
        runInAction(() => this.props.model.settings.logLevel = value);

    onDownloadLogsClicked = () => this.props.logsModel.download();

    toggleLogEntriesTableVisible = () => this.logEntriesTableVisible = !this.logEntriesTableVisible;

    onSave = () => {
        if (!confirm("Changing the log level will restart the extension."))
            return false;

        this.props.model.persist()
            .then(() =>  {
                this.props.background!.restart();
                window.close();
            })        

        return true;
    }

    render() {
        const { model, logsModel } = this.props;
        const settings = model.settings;

        return <Page location={this.props.location}>
            <Segment>
                <Header as="h1">Logging Settings</Header>
                <Form>

                    <Form.Field style={{ marginTop: 40, marginBottom: 40 }}>
                        <label>Log Level</label>
                        <Dropdown placeholder='Level' selection value={settings.logLevel}
                            onChange={this.onLogLevelChanged}
                            options={loggingLevelOptions} style={{ width: 200 }} />
                    </Form.Field>

                    <SaveButton needsSave={model.isDirty} onSave={this.onSave} />
                </Form>
            </Segment>
            <Segment>
                <Header as="h3">Log</Header>

                {this.logEntriesTableVisible ?
                    <Button onClick={this.toggleLogEntriesTableVisible}> <Icon name="eye" /> Hide</Button> :
                    <Button onClick={this.toggleLogEntriesTableVisible}> <Icon name="eye slash" /> Show</Button>}

                <Button onClick={() => logsModel.clear()}><Icon name="trash" /> Clear</Button>

                <Button onClick={this.onDownloadLogsClicked}><Icon name="download" /> Download</Button>

                {this.logEntriesTableVisible ?
                    <Form style={{ marginTop: 20 }}>
                        <LogEntriesTable style={{ minHeight: 500 }}
                            messages={logsModel.messages} />
                    </Form> : null}
            </Segment>
        </Page>
    }
}
