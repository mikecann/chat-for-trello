import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { AppSettingsModel } from '../../../models/AppSettingsModel';
import { action } from 'mobx';
import { Form, Dropdown } from 'semantic-ui-react';
import { ChatWindowOrder } from '../../../models/ChatWindowOrder';

interface Props {
    model?: AppSettingsModel
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
]


@inject("model")
@observer
export class ChatWindowOrderSetting extends React.Component<Props, {}>
{
    @action onChange = (e: any, { value }: { value: any }) =>
        this.props.model!.settings.chatWindowOrder = value;

    render() {
        const settings = this.props.model!.settings;
        return <Form.Field>
            <label>Chat Window Order</label>
            <Dropdown
                selection
                value={settings.chatWindowOrder}
                onChange={this.onChange}
                options={options}
                style={{ width: 200 }}
            />
        </Form.Field>
    }
}

