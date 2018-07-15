import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Segment, Header, Form, Button, Modal, Divider, Icon } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range'
import { AppSettingsModel } from '../../models/AppSettingsModel';
import { Page } from '../components/Page';
import { SettingsSaveButton } from '../components/SettingsSaveButton';
import { observable, runInAction } from 'mobx';

interface Props {
    logger?: ILogger,
    location: Location,
    model: AppSettingsModel
}

@inject("logger", "model")
@observer
export class General extends React.Component<Props, {}>
{
    @observable isResetWarningModalOpen = false;

    onOpacitySliderChange = (value: number) => {
        runInAction(() => this.props.model.settings.opacityOfCompletedTaskPercent = value);
    }

    closeResetWarningModal = () =>
        runInAction(() => this.isResetWarningModalOpen = false);

    openResetWarningModal = () =>
        runInAction(() => this.isResetWarningModalOpen = true);

    onConfirmResetSettings = () => {
        this.props.model.reset();
        this.closeResetWarningModal();
    }

    render() {
        const { model } = this.props;
        const settings = model.settings;
        return <Page location={this.props.location}>
            <Segment>
                <Header as="h1">
                    General Settings
                    <Header.Subheader>Common settings for the extension</Header.Subheader>
                </Header>
                <Divider section />
                <Form>

                    <Form.Field>
                        <label>Opacity of Completed Task</label>
                        <Slider color="grey" value={settings.opacityOfCompletedTaskPercent} inverted={false} settings={{
                            start: settings.opacityOfCompletedTaskPercent,
                            min: 0,
                            max: 100,
                            step: 1,
                            onChange: this.onOpacitySliderChange
                        }} />
                    </Form.Field>

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
    }
}

const ResetWarningModal = (props: { isOpen: boolean, onYes: () => void, onNo: () => void, onClose: () => void }) =>
    <Modal size="tiny" open={props.isOpen} onClose={props.onClose}>
        <Modal.Header>Reset All Settings</Modal.Header>
        <Modal.Content>
            <p>Are you sure you want to reset all your settings back to thier defaults?</p>
        </Modal.Content>
        <Modal.Actions>
            <Button negative onClick={props.onNo}>No</Button>
            <Button positive icon='checkmark' labelPosition='right' content='Yes' onClick={props.onYes} />
        </Modal.Actions>
    </Modal>
