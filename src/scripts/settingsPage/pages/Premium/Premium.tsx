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

// const FreeTrialCard = (props: {
//     daysRemain: number;
//     isOnFreeTrial: boolean;
//     onClick: () => void;
//     onCancelClick: () => void;
// }) => (
//     <div style={{ position: "relative" }}>
//         {props.isOnFreeTrial ? (
//             <FreeTrialCardLabel isExpired={false} daysRemain={props.daysRemain} />
//         ) : null}
//         <Card
//             onClick={props.isOnFreeTrial ? undefined : props.onClick}
//             style={{
//                 textAlign: "center",
//                 opacity: 1,
//                 marginTop: 0
//             }}
//         >
//             <Image src="/images/free-trial.jpg" />
//             <Card.Content>
//                 <Card.Header>Free Trial</Card.Header>
//                 <Card.Meta>
//                     <span className="date">Free</span>
//                 </Card.Meta>
//                 <Card.Description>
//                     Get all the benefits of the Premium Subscription free for 30 days!
//                 </Card.Description>
//             </Card.Content>
//             {props.isOnFreeTrial ? (
//                 <Card.Content extra>
//                     <Button basic color="red" onClick={props.onCancelClick}>
//                         Cancel
//                     </Button>
//                 </Card.Content>
//             ) : null}
//         </Card>
//     </div>
// );

// const FreeTrialCardLabel = (props: { isExpired: boolean; daysRemain: number }) => {
//     if (props.isExpired)
//         return (
//             <Label
//                 color="red"
//                 attach="top"
//                 style={{ position: "absolute", textAlign: "center", zIndex: 10, width: "100%" }}
//             >
//                 Expired
//             </Label>
//         );

//     return (
//         <Label
//             color="orange"
//             attach="top"
//             style={{ position: "absolute", textAlign: "center", zIndex: 10, width: "100%" }}
//         >
//             {props.daysRemain} days remaining
//         </Label>
//     );
// };
