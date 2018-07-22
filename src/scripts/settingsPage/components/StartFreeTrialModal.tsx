import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "mikeysee-helpers";
import { Modal, Button, Icon } from "semantic-ui-react";
import { PageAuthModel } from "../../models/AuthModel";

interface Props {
    logger?: ILogger;
    isOpen: boolean;
    auth?: PageAuthModel;
    onClose: () => void;
}

@inject("logger", "auth")
@observer
export class StartFreeTrialModal extends React.Component<Props, {}> {
    onLogin = async () => {
        this.props.logger!.debug("StartFreeTrial logging in");
        await this.props.auth!.authenticate();
        this.props.logger!.debug("StartFreeTrial starting as free trial");
        this.props.onClose();
    };

    render() {
        return (
            <Modal
                open={this.props.isOpen}
                size="mini"
                dimmer="blurring"
                onClose={this.props.onClose}
                style={{ textAlign: "center" }}
            >
                <Modal.Header>Please Login To Start Free Trial</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <Button
                            size="large"
                            onClick={this.onLogin}
                            primary
                            loading={this.props.auth!.isLoading}
                        >
                            <Icon name="google" />
                            Login with Google
                        </Button>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}
