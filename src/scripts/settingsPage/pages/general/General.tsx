import * as React from "react";
import { observer, inject } from "mobx-react";
import { Segment, Header, Form, Button, Modal, Divider, Icon } from "semantic-ui-react";
import { Page } from "../../components/Page";
import { SettingsSaveButton } from "../../components/SettingsSaveButton";
import { observable, runInAction, action } from "mobx";
import { AutoScrollSetting } from "./AutoScrollSetting";
import { MaxChatEntriesSetting } from "./MaxChatEntriesSetting";
import { ChatWindowOrderSetting } from "./ChatWindowOrderSetting";
import { ILogger } from "../../../lib/logging/types";
import { AppSettingsStore } from "../../../lib/settings/AppSettingsStore";
import { AppSettings } from "../../../common/config";

interface Props {
    logger?: ILogger;
    location: Location;
    settings: AppSettingsStore<AppSettings>;
}

@inject("logger", "settings")
@observer
export class General extends React.Component<Props, {}> {
    @observable isResetWarningModalOpen = false;

    @action closeResetWarningModal = () => (this.isResetWarningModalOpen = false);

    @action openResetWarningModal = () => (this.isResetWarningModalOpen = true);

    onConfirmResetSettings = () => {
        this.props.settings.reset();
        this.closeResetWarningModal();
    };

    render() {
        return (
            <Page location={this.props.location}>
                <Segment>
                    <Header as="h1">
                        General Settings
                        <Header.Subheader>Common settings for the extension</Header.Subheader>
                    </Header>
                    <Divider section />
                    <Form>
                        <AutoScrollSetting />
                        <MaxChatEntriesSetting />
                        <ChatWindowOrderSetting />
                    </Form>
                    <Divider section />
                    <SettingsSaveButton />
                </Segment>
                <Segment>
                    <Form>
                        <Form.Field>
                            <label>Reset All Saved Settings</label>
                            <Button color="red" onClick={this.openResetWarningModal}>
                                <Icon name="trash" /> Reset
                            </Button>
                        </Form.Field>
                    </Form>
                </Segment>
                <ResetWarningModal
                    isOpen={this.isResetWarningModalOpen}
                    onClose={this.closeResetWarningModal}
                    onNo={this.closeResetWarningModal}
                    onYes={this.onConfirmResetSettings}
                />
            </Page>
        );
    }
}

const ResetWarningModal = (props: {
    isOpen: boolean;
    onYes: () => void;
    onNo: () => void;
    onClose: () => void;
}) => (
    <Modal size="tiny" open={props.isOpen} onClose={props.onClose}>
        <Modal.Header>Reset All Settings</Modal.Header>
        <Modal.Content>
            <p>Are you sure you want to reset all your settings back to thier defaults?</p>
        </Modal.Content>
        <Modal.Actions>
            <Button negative onClick={props.onNo}>
                No
            </Button>
            <Button
                positive
                icon="checkmark"
                labelPosition="right"
                content="Yes"
                onClick={props.onYes}
            />
        </Modal.Actions>
    </Modal>
);
