import * as React from "react";
import { observer, inject } from "mobx-react";
import { Segment, Header } from "semantic-ui-react";
import { Page } from "../../components/Page";
import { ILogger } from "../../../lib/logging/types";

interface Props {
    logger?: ILogger;
    location: Location;
}

@inject("logger")
@observer
export class Errors extends React.Component<Props, {}> {
    render() {
        return (
            <Page location={this.props.location}>
                <Segment>
                    <Header as="h1">Errors</Header>
                    <p>
                        If you think you have found an issue with Chat for Trello please do{" "}
                        <a href="https://trello.com/b/Mdpd40Tt/">report it on our Trello page</a>.
                        You can include as much info in your report and perhaps provide a debug
                        level log of what happened too that would be really helpful. Thanks :)
                    </p>
                </Segment>
            </Page>
        );
    }
}
