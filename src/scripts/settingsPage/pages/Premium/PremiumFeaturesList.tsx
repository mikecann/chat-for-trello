import * as React from "react";
import { Segment, List } from "semantic-ui-react";

export const PremiumFeaturesList = () => (
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

const ListItem = (props: { label: string }) => (
    <List.Item>
        <List.Icon style={{ color: "green" }} name="check" />
        <List.Content>{props.label}</List.Content>
    </List.Item>
);
