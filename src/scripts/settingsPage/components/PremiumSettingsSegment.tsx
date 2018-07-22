import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "mikeysee-helpers";
import { Segment, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { PageAuthModel } from "../../models/AuthModel";

interface Props {
    logger?: ILogger;
    auth?: PageAuthModel;
}

@inject("logger", "auth")
@observer
export class PremiumSettingsSegment extends React.Component<Props, {}> {
    render() {
        const isPremium = this.props.auth!.userHasPremiumAccess;
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
