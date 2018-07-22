import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { ILogger } from 'mikeysee-helpers';
import { Segment, Header, Image, Button, Icon, Label } from 'semantic-ui-react';
import { observable, runInAction, computed } from 'mobx';

interface Props {
    logger?: ILogger
}



@inject("logger")
@observer
export class Info extends React.Component<Props, {}>
{
    @observable page = 0;

    nextPage = () => runInAction(() => this.page++);
    prevPage = () => runInAction(() => this.page--);
    close = () => window.close();

    @computed get hasNext() { return this.page != pages.length - 1; }
    @computed get hasPrev() { return this.page > 0 }

    render() {
        return <div style={{ minWidth: 200, textAlign: "center" }}>
            {pages[this.page]()}
            <div style={{ color: "white", marginBottom: 10 }}>
                <Button.Group>
                    <Button disabled={!this.hasPrev} onClick={this.prevPage} icon='left chevron' />
                    {this.hasNext ?
                        <Button>Page {this.page + 1} of {pages.length}</Button> :
                        <Button primary onClick={this.close}>Close</Button>
                    }
                    <Button onClick={this.nextPage} disabled={!this.hasNext} icon='right chevron' />
                </Button.Group>
            </div>


        </div>
    }
}


const pages = [

    () => <Segment>
        <Image centered src="./images/logo-128x128.png" />
        <Header textAlign="center" as="h1">Welcome to Chat for Trello!</Header>
        <p>If you have 30 seconds I will quickly take you through what you need to know.</p>
    </Segment>,

    () => <Segment>
        <Header textAlign="center" as="h1">Enabling Per Board</Header>
        <p>You can enable or disable the extension per board by clicking the little icon at the top of the board:</p>
        <Image centered src="./images/board-enable-ss.png" />
    </Segment>,

    // () => <Segment style={{ position: "relative" }}>
    //     <Label color='red' ribbon style={{ position: "absolute", left: -15 }}>
    //         New Feature
    //     </Label>
    //     <Header textAlign="center" as="h1">Per List Settings</Header>
    //     <p>If you become a <a href="/settings.html#/premium" target="_blank">premium member</a> then you can access per-list settings by clicking the logo at the top of the list:</p>
    //     <Image centered src="./images/per-list-enable-ss.png" />
    // </Segment>,

    () => <Segment>
        <Header textAlign="center" as="h1">Using</Header>
        <p>Once enabled, you can then use the chat window to start chatting!</p>
        <video src="./images/demonstration.mp4" width={900} autoPlay loop />
    </Segment>,

    () => <Segment>
        <Header textAlign="center" as="h1">Accessing the Setting</Header>
        <p>Click the Chat for Trello icon to the right of your address bar in chrome to access the settings button</p>
        <Image centered src="./images/browser-action-ss.png" width={400} />
    </Segment>,

    () => <Segment>
        <Header textAlign="center" as="h1">Settings</Header>
        <p>From the settings you can configure Trello Chat to how you want.</p>
        <Image centered src="./images/settings-ss.png" width={800} />
    </Segment>,

    () => <Segment>
        <Header textAlign="center" as="h1">Settings</Header>
        <p>Thats it! Happy Chatting!</p>
        <video src="./images/demonstration.mp4" width={900} autoPlay loop />
    </Segment>

];