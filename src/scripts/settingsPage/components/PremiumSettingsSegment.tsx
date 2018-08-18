import * as React from "react";
import { observer, inject } from "mobx-react";
import { Segment, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { MembershipStore } from "../../lib/membership/MembershipStore";

interface Props {
    membership?: MembershipStore;
}

@inject("membership")
@observer
export class PremiumSettingsSegment extends React.Component<Props, {}> {
    render() {
        const isPremium = this.props.membership!.userHasPremiumAccess;
        return (
            <Segment>
                <Label ribbon="right" style={{ zIndex: 10 }}>
                    <Icon name="star" color="yellow" />
                    <Link to="/premium" style={{ color: "#000" }}>
                        Premium
                    </Link>
                </Label>
                <div
                    style={{
                        marginTop: -25,
                        opacity: isPremium ? 1 : 0.3,
                        pointerEvents: isPremium ? undefined : "none"
                    }}
                >
                    {this.props.children}
                </div>
            </Segment>
        );
    }
}
