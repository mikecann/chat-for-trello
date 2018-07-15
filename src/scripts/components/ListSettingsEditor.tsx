import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { ListSettings, CardCompletedActionValues } from '../models/ListSettingsModel';
import { Header, Form, Checkbox } from 'semantic-ui-react';
import { runInAction } from 'mobx';

interface Props {
    settings: ListSettings,
    logger?: ILogger
}

@inject("logger")
@observer
export class ListSettingsEditor extends React.Component<Props, any>
{
    private toggleIsEnabled = () =>
        runInAction(() => this.props.settings.isEnabled = !this.props.settings.isEnabled);

    private setCardCompletedAction = (value: CardCompletedActionValues) =>
        runInAction(() => this.props.settings.cardCompletedAction = value);

    render() {
        const settings = this.props.settings;
        return <Form>
            <Form.Field>
                <Checkbox checked={settings.isEnabled} toggle label="Enabled"
                    onChange={this.toggleIsEnabled} />
            </Form.Field>
            <Form.Field style={{ marginTop: 20 }}>
                <label>Card Complete Action</label>
                <select
                    style={{ width: 150 }}
                    value={settings.cardCompletedAction}
                    onChange={e => this.setCardCompletedAction(e.target.value as any)}>
                    <option value="nothing">Nothing</option>
                    <option value="archive">Archive</option>
                    <option value="send-to-top">Send to Top</option>
                    <option value="send-to-bottom">Send to Bottom</option>
                </select>
            </Form.Field>
        </Form>;
    }
}
