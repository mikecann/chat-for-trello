import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Checkbox, CheckboxProps, Form, Dropdown } from 'semantic-ui-react';
import { AppSettingsModel } from '../../../models/AppSettingsModel';
import { action } from 'mobx';

interface Props {
    model?: AppSettingsModel
}


const options = [
    {
        text: "10",
        value: 10
    },
    {
        text: "50",
        value: 50
    },
    {
        text: "100",
        value: 100
    }
]


@inject("model")
@observer
export class MaxChatEntriesSetting extends React.Component<Props, {}>
{
    @action onChange = (e: any, { value }: { value: number }) =>
        this.props.model!.settings.maxChatEntries = value;

    render() {
        const settings = this.props.model!.settings;
        return <Form.Field>
            <label>Maxiumum Chat Entries</label>
            <Dropdown
                selection
                value={settings.maxChatEntries}
                onChange={this.onChange}
                options={options}
                style={{ width: 200 }}
            />
        </Form.Field>
    }
}

