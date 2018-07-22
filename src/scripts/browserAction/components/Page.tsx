import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Segment, Header, Container, Menu, Image, Grid, Divider } from 'semantic-ui-react';
import { BrowserActionModel } from '../models/BrowserActionModel';
import { Updates } from './Updates';
import { Socials } from '../../components/Socials';
import { ILogger } from 'mikeysee-helpers';

interface Props {
    model: BrowserActionModel,
    logger?: ILogger
}

@inject("logger")
@observer
export class Page extends React.Component<Props, {}>
{
    onSettingsClicked = () => {
        chrome.tabs.create({ url: "settings.html" })
    }

    onReportErrorClicked = () => {
        chrome.tabs.create({ url: "https://trello.com/b/Mdpd40Tt" })
    }

    onSuggestClicked = () => {
        chrome.tabs.create({ url: "https://trello.com/b/Mdpd40Tt" })
}

    render() {
        return <div>
            <Segment vertical style={{ backgroundColor: "#007ac0", height: 80 }}>
                <Container>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={13}>
                                <Header inverted as="h1" style={{ marginBottom: 0, fontSize: "2.2em" }}>
                                    Chat for Trello v{this.props.model.appVersion}
                                </Header>
                                <Header.Subheader style={{ color: "#67c7ff" }}>by Mike Cann (<Socials />)</Header.Subheader>
                            </Grid.Column>
                            <Grid.Column width={3}>
                            <Image src="images/logo-128x128-inverted.png" floated="right" width={55} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Container>
            </Segment>
            <Segment
                style={{ minHeight: 400, borderBottom: "none" }}
                vertical>
                <Container>
                    <Updates updates={this.props.model.updates} />
                </Container>
            </Segment>
            <Divider fitted />
            <Segment vertical>
                <Container>
                    <Menu fluid widths={3}>
                        <Menu.Item icon="settings" name='Settings' onClick={this.onSettingsClicked} />
                        <Menu.Item icon="warning sign" name='Report Error' onClick={this.onReportErrorClicked} />
                        <Menu.Item icon="comments" name='Suggest Feature' onClick={this.onSuggestClicked} />
                    </Menu>
                </Container>
            </Segment>
        </div>
    }
}
