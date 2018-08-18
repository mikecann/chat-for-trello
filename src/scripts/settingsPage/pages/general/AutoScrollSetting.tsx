import * as React from "react";
import { observer, inject } from "mobx-react";
import { Checkbox, CheckboxProps, Form } from "semantic-ui-react";
import { action } from "mobx";
import { AppSettingsStore } from "../../../lib/settings/AppSettingsStore";
import { AppSettings } from "../../../common/config";

interface Props {
    settings?: AppSettingsStore<AppSettings>;
}

@inject("settings")
@observer
export class AutoScrollSetting extends React.Component<Props, {}> {
    @action
    onAutoScrollChange = (e: any, checkbox: CheckboxProps) =>
        this.props.settings!.update({
            autoScrollChatWindow: checkbox.checked
        });

    render() {
        const settings = this.props.settings!.settings;
        return (
            <Form.Field>
                <Checkbox
                    checked={settings.autoScrollChatWindow}
                    onChange={this.onAutoScrollChange}
                    label="Auto Scroll To Bottom of Chat Window"
                />
            </Form.Field>
        );
    }
}
