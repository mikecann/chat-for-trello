import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Image, Segment, Header, Label, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { PageAuthModel } from '../../models/AuthModel';

interface Props {
    logger?: ILogger,
    auth?: PageAuthModel
}

@inject("logger", "auth")
@observer
export class SidebarPremiumButton extends React.Component<Props, {}>
{
    render() {
        const auth = this.props.auth!;
        return <Link to="premium">
            {this.props.auth!.isAuthenticated ?
                <Member
                    name={auth.userInfo!.name}
                    pic={auth.userInfo!.picture}
                    daysRemain={auth.daysRemainingOnFreeTrial}
                    isFreeTrial={auth.isOnFreeTrial}
                /> :
                <NotMember />
            }
        </Link>
    }
}

const NotMember = () =>
    <Segment>
        <Label style={{ textAlign: "center" }} color="orange" attached='top'>Try Premium For Free!</Label>

        <div style={{ display: "flex" }}>
            <Label corner="left"><Icon color="yellow" name="star" /></Label>
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

interface MemberProps {
    name: string, 
    pic: string,
    daysRemain: number,
    isFreeTrial: boolean
}

const Member = (props: MemberProps) =>
    <Segment>
        <Label style={{ textAlign: "center" }} color="orange" attached='top'>Chat for Trello Premium</Label>
        <div style={{ display: "flex" }}>
            <Label corner="left" color={props.isFreeTrial ? undefined : "yellow"}><Icon name={props.isFreeTrial ? "clock" : "star"} /></Label>
            <div style={{ marginRight: 10 }}>
                <Image rounded src={props.pic} width={64} />
            </div>
            <div>
                <Header as={"h3"}>
                    {props.name}
                    { props.isFreeTrial ? 
                        <Header.Subheader>{`Free Trial (${props.daysRemain} days remaining)`}</Header.Subheader> :
                        <Header.Subheader>Premium Member</Header.Subheader>
                    }
                </Header>
            </div>
        </div>
    </Segment>
