import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Modal, Button, Icon } from 'semantic-ui-react';
import { PageAuthModel } from '../../models/AuthModel';

interface Props {
    logger?: ILogger,
    isOpen: boolean,
    auth?: PageAuthModel,
    onClose: () => void
}

@inject("logger", "auth")
@observer
export class StartPremiumModal extends React.Component<Props, {}>
{
    onLogin = async () => {
        this.props.logger!.debug("StartFreeTrial logging in");
        await this.props.auth!.authenticate();
        this.props.logger!.debug("StartFreeTrial starting as free trial");        
    }

    onPurchase = () => {
        this.props.auth!.purchasePremiumMembership();
    }

    render() {
        const auth = this.props.auth!;
        return <Modal open={this.props.isOpen} size="mini" dimmer="blurring" onClose={this.props.onClose} style={{ textAlign: "center" }}>
            { auth.isAuthenticated ? 
                <LoggedIn onPurchase={this.onPurchase} isLoading={auth.isLoading} isFreeTrial={auth.isOnFreeTrial} /> : 
                <NotLoggedIn onLogin={this.onLogin} isLoading={auth.isLoading} /> }
        </Modal>
    }
}

const NotLoggedIn = (props: { onLogin: () => void, isLoading: boolean }) =>
    <React.Fragment>
        <Modal.Header>Please Login</Modal.Header>
        <Modal.Content image>
            <Modal.Description>
                <Button size="large" onClick={props.onLogin} primary loading={props.isLoading}>
                    <Icon name="google" />
                    Login with Google
                </Button>
            </Modal.Description>
        </Modal.Content>
    </React.Fragment>

const LoggedIn = (props: { onPurchase: () => void, isLoading: boolean, isFreeTrial: boolean }) =>
    props.isFreeTrial ? 
        <IsOnFreeTrial /> :
        <IsNotOnFreeTrial isLoading={props.isLoading} onPurchase={props.onPurchase} />

const IsOnFreeTrial = () =>
    <React.Fragment>
        <Modal.Header><Icon name="star" color="yellow" /> On Free Trial <Icon name="star" color="yellow" /></Modal.Header>
        <Modal.Content>
            <Modal.Description>
                It looks like you are already rocking the free trial, good for you! Dont worry. When you trial period ends your paid subscription will automatically start.
            </Modal.Description>
        </Modal.Content>
    </React.Fragment>

const IsNotOnFreeTrial = (props: { onPurchase: () => void, isLoading: boolean }) =>
    <React.Fragment>
        <Modal.Header>Start Premium Membership</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Button size="large" onClick={props.onPurchase} primary loading={props.isLoading}>
                    Purchase Premium Subscription
                </Button>
            </Modal.Description>
        </Modal.Content>
    </React.Fragment>