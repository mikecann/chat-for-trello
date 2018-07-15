import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Modal, Segment } from 'semantic-ui-react';
import { PageAuthModel } from '../../models/AuthModel';
import { Link } from 'react-router-dom';

interface Props {
    logger?: ILogger,
    auth?: PageAuthModel
}

@inject("logger", "auth")
@observer
export class ErrorModal extends React.Component<Props, {}>
{
    onClose = () => this.props.auth!.error = undefined;

    render() {
        const isOpen = this.props.auth!.error != undefined;
        const error = this.props.auth!.error;
        return <Modal open={isOpen} size="small" dimmer="blurring" onClose={this.onClose} style={{ textAlign: "center" }}>
            <Modal.Header>Whoops! An Error Occured</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <Segment color="red" style={{ maxWidth: "100%" }}>
                        <pre>{error}</pre>
                    </Segment>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <p>If this problem persists, plese <Link to="/errors" onClick={this.onClose}>report it</Link>.</p>
            </Modal.Actions>
        </Modal>
    }
}
