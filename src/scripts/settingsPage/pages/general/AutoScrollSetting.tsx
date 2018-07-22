import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Checkbox, CheckboxProps, Form } from 'semantic-ui-react';
import { AppSettingsModel } from '../../../models/AppSettingsModel';
import { action } from 'mobx';

interface Props {
    model?: AppSettingsModel
}

@inject("model")
@observer
export class AutoScrollSetting extends React.Component<Props, {}>
{
    @action onAutoScrollChange = (e: any, checkbox: CheckboxProps) =>
        this.props.model!.settings.autoScrollChatWindow = checkbox.checked == true;

    render() {
        const settings = this.props.model!.settings;
        return <Form.Field>
            <Checkbox
                checked={settings.autoScrollChatWindow}
                onChange={this.onAutoScrollChange}
                label="Auto Scroll To Bottom of Chat Window" />
        </Form.Field>
    }
}

