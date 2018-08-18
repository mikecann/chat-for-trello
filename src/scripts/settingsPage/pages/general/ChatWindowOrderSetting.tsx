import * as React from "react";
import { observer, inject } from "mobx-react";
import { action } from "mobx";
import { Form, Dropdown } from "semantic-ui-react";
import { ChatWindowOrder, AppSettings } from "../../../common/config";
import { AppSettingsStore } from "../../../lib/settings/AppSettingsStore";

interface Props {
    settings?: AppSettingsStore<AppSettings>;
}

const options = [
    {
        text: "Behind Cards",
        value: ChatWindowOrder.BehindCards
    },
    {
        text: "Infront of Cards",
        value: ChatWindowOrder.InfrontOfCards
    }
];

@inject("settings")
@observer
export class ChatWindowOrderSetting extends React.Component<Props, {}> {
    @action
    onChange = (e: any, { value }: { value: any }) =>
        this.props.settings!.update({
            chatWindowOrder: value
        });

    render() {
        const settings = this.props.settings!.settings;
        return (
            <Form.Field>
                <label>Chat Window Order</label>
                <Dropdown
                    selection
                    value={settings.chatWindowOrder}
                    onChange={this.onChange}
                    options={options}
                    style={{ width: 200 }}
                />
            </Form.Field>
        );
    }
}
