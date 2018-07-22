import * as React from "react";
import { observer } from "mobx-react";
import { Comment } from "semantic-ui-react";
import * as moment from "moment";

interface Props {
    member: TrelloMember;
}

@observer
export class ChatMessageAvatar extends React.Component<Props, {}> {
    render() {
        const member = this.props.member;

        var title = `${member.fullName} (${member.username})`;

        if (member.avatarHash == null)
            return (
                <span className="member-initials" title={title}>
                    {member.initials}
                </span>
            );

        var avatarUrl30 =
            "https://trello-avatars.s3.amazonaws.com/" + member.avatarHash + "/30.png";
        var avatarUrl50 =
            "https://trello-avatars.s3.amazonaws.com/" + member.avatarHash + "/50.png";
        var srcSet = avatarUrl30 + " 1x, " + avatarUrl50 + " 2x";
        return (
            <img
                className="member-avatar"
                height="30"
                width="30"
                src={avatarUrl30}
                srcSet={srcSet}
                alt={title}
                title={title}
            />
        );
    }
}
