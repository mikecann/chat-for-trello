import * as React from "react";
import { observer, inject } from "mobx-react";
import { ILogger } from "mikeysee-helpers";
import { Icon, SemanticICONS } from "semantic-ui-react";

interface Props {
    logger?: ILogger;
    small?: boolean;
}

@inject("logger")
@observer
export class Socials extends React.Component<Props, {}> {
    render() {
        const small = this.props.small;
        return (
            <React.Fragment>
                <SocialButton href="https://twitter.com/mikeysee" icon="twitter" />
                <SocialButton
                    href="mailto:mike.cann@gmail.com?Subject=Chat%20For%20Trello"
                    icon="mail"
                />
                <SocialButton href="http://mikecann.co.uk" icon="internet explorer" />
                <SocialButton href="http://facebook.com/mikeysee" icon="facebook" />
                {!small ? (
                    <SocialButton
                        href="https://secure.skype.com/portal/overview?skypename=cannyshammy"
                        icon="skype"
                    />
                ) : null}
                {!small ? (
                    <SocialButton
                        href="https://www.youtube.com/channel/UC9-RJld8R0v5ywwBT8csdZA"
                        icon="youtube"
                    />
                ) : null}
            </React.Fragment>
        );
    }
}

const SocialButton = (props: { href: string; icon: SemanticICONS }) => (
    <a style={{ color: "#67c7ff" }} href={props.href} target="_blank">
        <Icon name={props.icon} />
    </a>
);
