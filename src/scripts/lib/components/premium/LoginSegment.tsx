import * as React from "react";
import { Segment, Header, Button } from "semantic-ui-react";

interface Props {
    isLoading?: boolean;
    onLogin: () => void;
}

export const LoginSegment: React.SFC<Props> = props => (
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
