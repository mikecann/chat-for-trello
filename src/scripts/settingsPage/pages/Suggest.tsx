import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Segment, Header } from 'semantic-ui-react';
import { Page } from '../components/Page';

interface Props {
    logger?: ILogger,
    location: Location
}

@inject("logger")
@observer
export class Suggest extends React.Component<Props, {}>
{
    render() {
        return <Page location={this.props.location}>
            <Segment>
                <Header as="h1">Suggest</Header>
                <p>If you have a suggestion for a feature for the extension please do <a href="https://trello.com/b/Mdpd40Tt/">add it to our Trello page</a>. There are a number of suggestions on there already so make sure you check to see if your suggestion is already there before posting a new one. Thanks :)</p>
            </Segment>
        </Page>
    }
}
