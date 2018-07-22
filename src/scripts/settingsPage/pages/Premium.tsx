import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "mikeysee-helpers";
import {
    Segment,
    Button,
    Header,
    Icon,
    Grid,
    Card,
    Image,
    Label,
    List,
    Modal
} from "semantic-ui-react";
import { BackgroundPage } from "../../background/background";
import { PageAuthModel } from "../../models/AuthModel";
import { Page } from "../components/Page";
import { observable, runInAction } from "mobx";
import { StartFreeTrialModal } from "../components/StartFreeTrialModal";
import { StartPremiumModal } from "../components/StartPremiumModal";





import { CancelMembershipModal } from "../components/CancelMembershipModal";

interface Props {
    logger?: ILogger;
    location: Location;
    auth?: PageAuthModel;
}

@inject("logger", "auth")
@observer
export class Premium extends React.Component<Props, {}> {
    render() {
        const auth = this.props.auth!;
        return (
            <Page location={this.props.location}>
                {auth.isOnFreeTrial || !auth.userHasPremiumAccess ? (
                    <NotPremiumMemberOrOnFreeTrial auth={auth} />
                ) : (
                    <PremiumMember auth={auth} />
                )}
            </Page>
        );
    }
}

@observer
class PremiumMember extends React.Component<{ auth: PageAuthModel }, {}> {
    @observable cancelMembershipIsOpen = false;

    hideCancelMembershipModal = () => runInAction(() => (this.cancelMembershipIsOpen = false));
    onCancelClicked = () => runInAction(() => (this.cancelMembershipIsOpen = true));

    render() {
        var thanks = Math.round(Math.random() * 2);
        return (
            <React.Fragment>
                <Segment style={{ textAlign: "center" }}>
                    <video src={`/images/thanks${thanks}.mp4`} autoPlay loop />
                    <Header as="h1">Chat for Trello Premium Membership</Header>
                    <p>
                        Thankyou so much for becoming a Chat for Trello Premium Member. Your
                        continued support goes a long way towards helping me continue to improve
                        this extension. Please feel free to leave me an message or suggestion on{" "}
                        <a href="https://trello.com/b/Mdpd40Tt">our trello board</a>, or email me
                        directly at any time if you have questions:{" "}
                        <a href="mailto:mike@cannstudios.com">mike@cannstudios.com</a>.{" "}
                    </p>
                    <p>
                        As a Chat for Trello Premium member you now have full access to the
                        following:
                    </p>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 20,
                            justifyContent: "center"
                        }}
                    >
                        <PremiumFeaturesList />
                    </div>
                </Segment>
                <Segment style={{ textAlign: "center" }}>
                    <Header as="h3">
                        Want To Cancel?
                        <Header.Subheader>
                            I would hate to see you go, but I think its important that you can
                            cancel at any time.
                        </Header.Subheader>
                    </Header>
                    <Button basic color="red" onClick={this.onCancelClicked}>
                        Cancel my Membership
                    </Button>
                </Segment>
                <CancelMembershipModal
                    isOpen={this.cancelMembershipIsOpen}
                    onClose={this.hideCancelMembershipModal}
                />
            </React.Fragment>
        );
    }
}

@observer
class NotPremiumMemberOrOnFreeTrial extends React.Component<{ auth: PageAuthModel }, {}> {
    @observable freeTrialModalIsOpen = false;
    @observable premiumModalIsOpen = false;
    @observable cancelMembershipIsOpen = false;

    login = () => this.props.auth.authenticate();

    onFreeTrialClicked = () => runInAction(() => (this.freeTrialModalIsOpen = true));
    onPremiumClicked = () => runInAction(() => (this.premiumModalIsOpen = true));
    onCancelClicked = () => runInAction(() => (this.cancelMembershipIsOpen = true));

    hideFreeTrialModal = () => runInAction(() => (this.freeTrialModalIsOpen = false));
    hidePremiumModal = () => runInAction(() => (this.premiumModalIsOpen = false));
    hideCancelMembershipModal = () => runInAction(() => (this.cancelMembershipIsOpen = false));

    render() {
        const auth = this.props.auth;
        return (
            <React.Fragment>
                <Segment style={{ textAlign: "center" }}>
                    <Header as="h1">Chat for Trello Premium Membership</Header>
                    <div>
                        Become a premium member today and get access to all these awesome additional
                        features:
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 20,
                            justifyContent: "center"
                        }}
                    >
                        <PremiumFeaturesList />
                    </div>
                </Segment>
                <Segment style={{ textAlign: "center" }}>
                    <Header as="h1">Choose Membership</Header>
                    <Grid centered padded columns={2}>
                        <Grid.Row columns={2}>
                            <Grid.Column width={6}>
                                <FreeTrialCard
                                    isOnFreeTrial={auth.isOnFreeTrial}
                                    daysRemain={auth.daysRemainingOnFreeTrial}
                                    onCancelClick={this.onCancelClicked}
                                    onClick={this.onFreeTrialClicked}
                                />
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <PremiumSubscriptionCard onClick={this.onPremiumClicked} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                {auth.isAuthenticated ? null : (
                    <LoginSegment isLoading={auth.isLoading} onLogin={this.login} />
                )}
                <StartFreeTrialModal
                    isOpen={this.freeTrialModalIsOpen}
                    onClose={this.hideFreeTrialModal}
                />
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

const PremiumFeaturesList = () => (
    <Segment textAlign="center" style={{ width: 400 }} color="green">
        <List>
            <ListItem label="Per list toggling of checkboxes" />
            <ListItem label="Send completed cards to the bottom or top of the list" />
            <ListItem label="Premium level support" />
            <ListItem label="All future features" />
            <ListItem label="Feel good factor that you helped keep the project alive" />
        </List>
    </Segment>
);

const LoginSegment = (props: { isLoading: boolean; onLogin: () => void }) => (
    <Segment style={{ textAlign: "center" }}>
        <Header as="h3">
            Already a Member?
            <Header.Subheader>
                Are you already a premium member and need to login, no worries
            </Header.Subheader>
        </Header>
        <Button loading={props.isLoading} primary onClick={props.onLogin}>
            Login
        </Button>
    </Segment>
);

const ListItem = (props: { label: string }) => (
    <List.Item>
        <List.Icon style={{ color: "green" }} name="check" />
        <List.Content>{props.label}</List.Content>
    </List.Item>
);

const FreeTrialCard = (props: {
    daysRemain: number;
    isOnFreeTrial: boolean;
    onClick: () => void;
    onCancelClick: () => void;
}) => (
    <div style={{ position: "relative" }}>
        {props.isOnFreeTrial ? (
            <FreeTrialCardLabel isExpired={false} daysRemain={props.daysRemain} />
        ) : null}
        <Card
            onClick={props.isOnFreeTrial ? undefined : props.onClick}
            style={{
                textAlign: "center",
                opacity: 1,
                marginTop: 0
            }}
        >
            <Image src="/images/free-trial.jpg" />
            <Card.Content>
                <Card.Header>Free Trial</Card.Header>
                <Card.Meta>
                    <span className="date">Free</span>
                </Card.Meta>
                <Card.Description>
                    Get all the benefits of the Premium Subscription free for 30 days!
                </Card.Description>
            </Card.Content>
            {props.isOnFreeTrial ? (
                <Card.Content extra>
                    <Button basic color="red" onClick={props.onCancelClick}>
                        Cancel
                    </Button>
                </Card.Content>
            ) : null}
        </Card>
    </div>
);

const FreeTrialCardLabel = (props: { isExpired: boolean; daysRemain: number }) => {
    if (props.isExpired)
        return (
            <Label
                color="red"
                attach="top"
                style={{
                    position: "absolute",
                    textAlign: "center",
                    zIndex: 10,
                    width: "100%"
                }}
            >
                Expired
            </Label>
        );

    return (
        <Label
            color="orange"
            attach="top"
            style={{
                position: "absolute",
                textAlign: "center",
                zIndex: 10,
                width: "100%"
            }}
        >
            {props.daysRemain} days remaining
        </Label>
    );
};

const PremiumSubscriptionCard = (props: { onClick: () => void }) => (
    <Card style={{ textAlign: "center" }} onClick={props.onClick}>
        <Image src="/images/premium-subscription.jpg" />
        <Card.Content>
            <Card.Header>Premium Subscription</Card.Header>
            <Card.Meta>
                <span className="date">$2 USD Per Month</span>
            </Card.Meta>
            <Card.Description>
                All of the awesome additional features, can cancel at any time!
            </Card.Description>
        </Card.Content>
    </Card>
);
