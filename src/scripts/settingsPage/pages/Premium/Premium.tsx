import * as React from "react";
import { observer, inject } from "mobx-react";
import { Segment, Button, Header, Icon, Grid, Card, Image, Label, List } from "semantic-ui-react";
import { Page } from "../../components/Page";
import { observable, runInAction } from "mobx";
import { StartPremiumModal } from "./StartPremiumModal";
import { CancelMembershipModal } from "./CancelMembershipModal";
import { IsPremium } from "./IsPremium";
import { PremiumFeaturesList } from "./PremiumFeaturesList";
import { NotPremiumMemberOrOnFreeTrial } from "./NotPremiumMemberOrOnFreeTrial";
import { ILogger } from "../../../lib/logging/types";
import { MembershipStore } from "../../../lib/membership/MembershipStore";

interface Props {
    logger?: ILogger;
    location: Location;
    membership?: MembershipStore;
}

@inject("logger", "membership")
@observer
export class Premium extends React.Component<Props, {}> {
    render() {
        const membership = this.props.membership!;
        return (
            <Page location={this.props.location}>
                {!membership.userHasPremiumAccess ? (
                    <NotPremiumMemberOrOnFreeTrial />
                ) : (
                    <IsPremium />
                )}
            </Page>
        );
    }
}
