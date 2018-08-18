import * as React from "react";
import { observer, inject } from "mobx-react";
import { Segment, Button, Header, Icon, Grid, Card, Image, Label, List } from "semantic-ui-react";
import { observable, runInAction } from "mobx";
import { StartPremiumModal } from "./StartPremiumModal";
import { CancelMembershipModal } from "./CancelMembershipModal";
import { PremiumFeaturesList } from "./PremiumFeaturesList";
import { AuthStore } from "../../../lib/auth/AuthStore";
import { SessionStore } from "../../../lib/session/SessionStore";
import { MembershipStore } from "../../../lib/membership/MembershipStore";
import { LoginSegment } from "../../../lib/components/premium/LoginSegment";

interface Props {
    auth?: AuthStore;
    session?: SessionStore;
    membership?: MembershipStore;
}

@inject("auth", "membership", "session")
@observer
export class NotPremiumMemberOrOnFreeTrial extends React.Component<Props, {}> {
    // @observable
    // freeTrialModalIsOpen = false;
    @observable premiumModalIsOpen = false;

    @observable cancelMembershipIsOpen = false;

    login = () => {
        // try{

        // }
        // catch(e) {
        //     console.log("")
        // }

        // For now im aware the below could throw an error that im not handling!
        this.props.session!.startSession();
    };

    onFreeTrialClicked = () => runInAction(() => (this.premiumModalIsOpen = true));
    onPremiumClicked = () => runInAction(() => (this.premiumModalIsOpen = true));
    onCancelClicked = () => runInAction(() => (this.cancelMembershipIsOpen = true));

    hideFreeTrialModal = () => runInAction(() => (this.premiumModalIsOpen = false));
    hidePremiumModal = () => runInAction(() => (this.premiumModalIsOpen = false));
    hideCancelMembershipModal = () => runInAction(() => (this.cancelMembershipIsOpen = false));

    render() {
        const auth = this.props.auth!;
        return (
            <React.Fragment>
                <Segment style={{ textAlign: "center" }}>
                    <Header as="h1">Chat for Trello Premium Membership</Header>
                    <div>
                        Become a premium member today and get access to all these awesome additional
                        features:
                    </div>
                    <div style={{ display: "flex", marginTop: 20, justifyContent: "center" }}>
                        <PremiumFeaturesList />
                    </div>
                </Segment>
                <Segment style={{ textAlign: "center" }}>
                    <Header as="h1">Choose Membership</Header>
                    <Grid centered padded columns={2}>
                        <Grid.Row columns={2}>
                            {/* <Grid.Column width={6}>
                                <FreeTrialCard
                                    isOnFreeTrial={auth.isOnFreeTrial}
                                    daysRemain={auth.daysRemainingOnFreeTrial}
                                    onCancelClick={this.onCancelClicked}
                                    onClick={this.onFreeTrialClicked}
                                />
                            </Grid.Column> */}
                            <Grid.Column width={6}>
                                <PremiumSubscriptionCard onClick={this.onPremiumClicked} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                {auth.isAuthenticated ? null : (
                    <LoginSegment isLoading={auth.isAuthenticating} onLogin={this.login} />
                )}
                {/* <__StartFreeTrialModal
                    isOpen={this.freeTrialModalIsOpen}
                    onClose={this.hideFreeTrialModal}
                /> */}
                <StartPremiumModal
                    isOpen={this.premiumModalIsOpen}
                    onClose={this.hidePremiumModal}
                />
                <CancelMembershipModal
                    isOpen={this.cancelMembershipIsOpen}
                    onClose={this.hideCancelMembershipModal}
                />
            </React.Fragment>
        );
    }
}

const PremiumSubscriptionCard = (props: { onClick: () => void }) => (
    <Card style={{ textAlign: "center" }} onClick={props.onClick}>
        <Image src="/images/premium-subscription.jpg" />
        <Card.Content>
            <Card.Header>Premium Subscription</Card.Header>
            <Card.Meta>
                <span className="date">$2 USD Per Month</span>
            </Card.Meta>
            <Card.Description>
                All of the awesome additional features FREE for 30 days! Can cancel at any time.
            </Card.Description>
        </Card.Content>
    </Card>
);
