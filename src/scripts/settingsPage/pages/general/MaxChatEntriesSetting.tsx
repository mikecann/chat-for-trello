import * as React from "react";
import { observer, inject } from "mobx-react";
import { Checkbox, CheckboxProps, Form, Dropdown } from "semantic-ui-react";
import { action } from "mobx";
import { AppSettingsStore } from "../../../lib/settings/AppSettingsStore";
import { AppSettings } from "../../../common/config";

interface Props {
    settings?: AppSettingsStore<AppSettings>;
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
];

@inject("settings")
@observer
export class MaxChatEntriesSetting extends React.Component<Props, {}> {
    @action
    onChange = (e: any, { value }: { value: number }) =>
        this.props.settings!.update({
            maxChatEntries: value
        });

    render() {
        const settings = this.props.settings!.settings;
        return (
            <Form.Field>
                <label>Maxiumum Chat Entries</label>
                <Dropdown
                    selection
                    value={settings.maxChatEntries}
                    onChange={this.onChange}
                    options={options}
                    style={{ width: 200 }}
                />
            </Form.Field>
        );
    }
}
