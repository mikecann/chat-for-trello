import * as React from "react";
import { observer, inject } from "mobx-react";
import { Image, Segment, Header, Label, Icon, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthStore } from "../../lib/auth/AuthStore";
import { MembershipStore } from "../../lib/membership/MembershipStore";
import { SessionStore } from "../../lib/session/SessionStore";

interface Props {
    auth?: AuthStore;
    membership?: MembershipStore;
    session?: SessionStore;
}

@inject("auth", "membership", "session")
@observer
export class SidebarPremiumButton extends React.Component<Props, {}> {
    render() {
        const auth = this.props.auth!;
        const membership = this.props.membership!;
        const session = this.props.session!;
        return (
            <Link to="premium">
                {this.props.auth!.isAuthenticated ? (
                    <Member
                        name={auth.userInfo!.name}
                        pic={auth.userInfo!.picture}
                        daysRemain={membership.daysRemainingOnFreeTrial}
                        isFreeTrial={membership.isOnFreeTrial}
                        userHasPremiumAccess={membership.userHasPremiumAccess}
                        onSignout={session.endSession}
                    />
                ) : (
                    <NotMember />
                )}
            </Link>
        );
    }
}

const NotMember = () => (
    <Segment>
        <Label style={{ textAlign: "center" }} color="orange" attached="top">
            Try Premium For Free!
        </Label>

        <div style={{ display: "flex" }}>
            <Label corner="left">
                <Icon color="yellow" name="star" />
            </Label>
            <div style={{ marginRight: 10 }}>
                <Image rounded src={"/images/blank-person.jpg"} width={64} />
            </div>
            <div>
                <Header as={"h3"}>
                    Premium Membership
                    <Header.Subheader>Premium Free Trial</Header.Subheader>
                </Header>
            </div>
        </div>
    </Segment>
);

interface MemberProps {
    name: string;
    pic: string;
    daysRemain: number;
    isFreeTrial: boolean;
    userHasPremiumAccess: boolean;
    onSignout: () => void;
}

const Member = (props: MemberProps) => (
    <Segment>
        <Label style={{ textAlign: "center" }} color="orange" attached="top">
            Tasks for Trello Premium
        </Label>
        <div style={{ display: "flex" }}>
            <Label corner="left" color={props.isFreeTrial ? undefined : "yellow"}>
                <Icon name={props.isFreeTrial ? "clock" : "star"} />
            </Label>
            <div style={{ marginRight: 10 }}>
                <Image rounded src={props.pic} width={64} />
            </div>
            <div>
                <Header as={"h3"}>
                    {props.name}
                    {props.isFreeTrial ? (
                        <Header.Subheader>{`Free Trial (${
                            props.daysRemain
                        } days remaining)`}</Header.Subheader>
                    ) : (
                        <Header.Subheader>
                            {props.userHasPremiumAccess ? "Premium " : ""}
                            Member
                        </Header.Subheader>
                    )}
                    <Button size="mini" compact basic onClick={props.onSignout}>
                        Signout
                    </Button>
                </Header>
            </div>
        </div>
    </Segment>
);
