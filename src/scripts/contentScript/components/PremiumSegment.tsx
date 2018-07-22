import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "mikeysee-helpers";
import { Segment, Label, Icon } from "semantic-ui-react";
import { PageAuthModel } from "../../models/AuthModel";
import { ContentScriptToBackgroundController } from "../controllers/ContentScriptToBackgroundController";

interface Props {
    logger?: ILogger;
    auth?: PageAuthModel;
    backgroundController?: ContentScriptToBackgroundController;
}

@inject("logger", "auth", "backgroundController")
@observer
export class PremiumSegment extends React.Component<Props, {}> {
    openPremium = () => {
        this.props.logger!.debug("PremiumSegment opening settings.");
        this.props.backgroundController!.send({ type: "open-settings" });
    };

    render() {
        const isPremium = this.props.auth!.userHasPremiumAccess;
        return (
            <React.Fragment>
                <Label style={{ zIndex: 10 }} corner="right">
                    <Icon name="star" color="yellow" />
                </Label>
                <div onClick={isPremium ? undefined : this.openPremium}>
                    <div
                        style={{
                            opacity: isPremium ? 1 : 0.3,
                            pointerEvents: isPremium ? undefined : "none"
                        }}
                    >
                        {this.props.children}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
