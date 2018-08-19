import * as React from "react";
import { observer, inject } from "mobx-react";
import { Segment, Button, Header, Icon, Label } from "semantic-ui-react";
import { observable, runInAction } from "mobx";
import { CancelMembershipModal } from "./CancelMembershipModal";
import { PremiumFeaturesList } from "./PremiumFeaturesList";
import { AuthStore } from "../../../lib/auth/AuthStore";
import { MembershipStore } from "../../../lib/membership/MembershipStore";
import { trelloBoard } from "../../../common/config";

interface Props {
    auth?: AuthStore;
    membership?: MembershipStore;
}

@inject("auth", "membership")
@observer
export class IsPremium extends React.Component<Props, {}> {
    @observable cancelMembershipIsOpen = false;

    hideCancelMembershipModal = () => runInAction(() => (this.cancelMembershipIsOpen = false));
    onCancelClicked = () => runInAction(() => (this.cancelMembershipIsOpen = true));

    render() {
        const thanks = Math.round(Math.random() * 2);
        const auth = this.props.auth!;
        const membership = this.props.membership!;
        return (
            <React.Fragment>
                <Segment style={{ textAlign: "center" }}>
                    <video src={`/images/thanks${thanks}.mp4`} autoPlay loop />
                    <Header as="h1">Chat for Trello Premium Membership</Header>

                    <p>
                        Thankyou so much for becoming a Chat for Trello Premium Member. Your
                        continued support goes a long way towards helping me continue to improve
                        this extension.
                    </p>
                    <p>
                        Please feel free to leave me an message or suggestion on{" "}
                        <a href={trelloBoard}>our trello board</a>
                        , or email me directy at any time if you have questions:{" "}
                        <a href="mailto:mike@cannstudios.com">mike@cannstudios.com</a>.{" "}
                    </p>
                    <p>
                        As a Chat for Trello Premium member you now have full access to the
                        following:
                    </p>
                    <div style={{ display: "flex", marginTop: 20, justifyContent: "center" }}>
                        <PremiumFeaturesList />
                    </div>
                </Segment>
                {membership.isOnFreeTrial && <CurrentyOnFreeTrialSegment membership={membership} />}
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

const CurrentyOnFreeTrialSegment = ({ membership }: { membership: MembershipStore }) => (
    <Segment style={{ textAlign: "center" }}>
        <Header as="h3">
            Free Trial Mode
            <Header.Subheader>
                <Icon name="clock" style={{ marginRight: 0 }} />
                {membership.daysRemainingOnFreeTrial} Days Remaining
            </Header.Subheader>
        </Header>
        <p>
            You are currently rocking the free trial, but dont worry after the period is ended you
            will automatically be transferred to the paying premium membership.
        </p>
    </Segment>
);
