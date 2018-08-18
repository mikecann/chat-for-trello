import * as React from "react";
import { observer, inject } from "mobx-react";
import { Modal, Button, Icon } from "semantic-ui-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

@observer
export class CancelMembershipModal extends React.Component<Props, {}> {
    onConfirm = async () => {
        chrome.tabs.create({ url: "https://payments.google.com/payments/u/0/home" });
        this.props.onClose();
    };

    render() {
        return (
            <Modal
                centered={false}
                open={this.props.isOpen}
                size="mini"
                dimmer="blurring"
                onClose={this.props.onClose}
                style={{ textAlign: "center" }}
            >
                <Modal.Header>Cancel Membership</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>
                            You can cancel your membership subscription at any time via the Google
                            Payments Centre.
                        </p>
                        <p>
                            It may take up to 48 hours before the cancellation is reflected in the
                            extension
                        </p>
                        <Button primary onClick={this.onConfirm}>
                            <Icon name="google" />
                            Open Google Payments Centre
                        </Button>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}
