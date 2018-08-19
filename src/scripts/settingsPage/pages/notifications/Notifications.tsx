import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "../../../lib/logging/types";
import { Header, Divider, Segment, Checkbox, CheckboxProps } from "semantic-ui-react";
import { SettingsSaveButton } from "../../components/SettingsSaveButton";
import { Page } from "../../components/Page";
import { AppSettingsStore } from "../../../lib/settings/AppSettingsStore";
import { AppSettings } from "../../../common/config";
import { PremiumSettingsSegment } from "../../components/PremiumSettingsSegment";

interface Props {
    logger?: ILogger;
    location: Location;
    settings: AppSettingsStore<AppSettings>;
}

@inject("logger", "settings")
@observer
export class Notifications extends React.Component<Props, {}> {
    onNotificationsEnabledChanged = (e: any, d: CheckboxProps) =>
        this.props.settings.update({
            desktopNotificationsEnabled: d.checked
        });

    render() {
        const settings = this.props.settings.settings;
        return (
            <Page location={this.props.location}>
                <PremiumSettingsSegment>
                    <Header as="h1">
                        Notifications Settings
                        <Header.Subheader>Send new message notifications</Header.Subheader>
                    </Header>
                    <Divider section />
                    <Checkbox
                        toggle
                        checked={settings.desktopNotificationsEnabled}
                        label="Desktop Notifications Enabled - Notify me when someone posts a chat message in an unfocused tab."
                        onChange={this.onNotificationsEnabledChanged}
                    />
                    <Divider section />
                    <SettingsSaveButton />
                </PremiumSettingsSegment>
            </Page>
        );
    }
}
