import * as React from "react";
import { observer } from "mobx-react";
import * as moment from "moment";
import { ChatMessageAvatar } from "./ChatMessageAvatar";
import { observable, action } from "mobx";

interface Props {
    action: TrelloCommentAction;
}

const trelloCardNameFromUrl = (url: string) => {
    const trelloUrlRegex = /https?:\/\/trello.com\/c\/[^\s]+\/([^\s]+)/g;
    const match = trelloUrlRegex.exec(url);
    if (!match) return "???";
    return match[1] == undefined ? "???" : match[1] + "";
};

const renderMessage = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const trelloUrlRegex = /(https?:\/\/trello.com\/c\/[^\s]+)/g;
    const parts = message.split(urlRegex);

    return parts.map((s, i) => {
        if (s.match(trelloUrlRegex))
            return (
                <a key={i} href={s} className="known-service-link">
                    <img
                        className="known-service-icon"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADQUlEQVR4Xu1bTWgTQRT+NrRQ/C1aUDRtRIsgVFsjHhKlAQ/1IKVaFLURi414kYIXD+rBeNCbIIgXMUqFFMWiluLBgEqLJgcxai0UpBVj0qLSSqw/FBMa2cSFUJK+XaedDLuTY/Z78+Z982bmvZl5Cgr/WlFTfxL2zY1wbP2FKocNFcsqUFZeXgQv1t/pVArTU9OYiM0g9noxEu8G8OntNQD3Z3dUmfVHA2pdAbjb1mNtXaVYVjH2ZmwoiXD3B4xEfADeaK3lE7AHbu9DeI6XMaoSW7z/Rhrh4F4Aj9SOagQ0wO19aXrjtaHJkbBd9YQcAbWuVzhwySn20M1z7+6djWIksk0loBVHrwZMN+cpvtQ14XanT0FN/RN4r+yi8Kb8Hjz1VIH7SAoen7kXvmKj1x9IKzh8OYl1zuW6R3h8GPj8HvidpEUWVQKrNwJrNtHYQoiF1vUx+l1BZ88UlqxcSvYwPoimmSF07G/GDrcL9lVVc4pkMhmMfZ3Ei3AEN3v6ELLVAdVbSDVZAC9dPyd/KDgd+kNGePFBnN/wDX6/X58BBVCq7IXRFTQJPHWlUykFZ55lKKuaYt14HLxOwcjvu70nEHK0zYnjqSsXCFEEjA/jTosdB/c1kwZSgLsP+nCoN1F8TeCp619naQKivYh3nSPnPGW8+j3xZQLV7RcBZ0thOE9dugl43oXMwC099pEYdWG0eTqAne2FsTx1lYKA7JxrPMaFAFKXJCDHAL0GzKNbkqPCU5f0AOkBcgrINUAugnIXkNugjAPIbJBncMJTlwyEZCAkAyEZCMlAyMSBEHn6JOQuYPYzQfJARMhTYc7BiXj3ApwJUK/FuN1CCbcLaIflvO4GhSVAI2Khb4eFJ4C8amEHiJUOs9tjuAVJgFDnAYbHj11AeoD0AOqBBO9AiN2rDbUgpwDPKaA3RTU0hIxg2gNKkKIy2mRInCagBCmqIQsYwTQBAHinqIw2GRLXRQDvFNWQBYxgfQSoSjimqIw2GRLX91Q2v0kOKaohC1jA2aeyeh9LsygSVTb7WNroc3lRjfmffmWfy1u+YMLyJTOWL5pS547Fy+ZUCixeOJlbQS1dOqttIpYuns7fSS1TPv8Xup/kU7yNnFkAAAAASUVORK5CYII="
                    />
                    {trelloCardNameFromUrl(s)}
                </a>
            );

        return <span key={i}>{s}</span>;
    });
};

@observer
export class ChatMessage extends React.Component<Props, {}> {
    @observable isMouseOver: boolean = false;

    @action onMouseOver = () => (this.isMouseOver = true);
    @action onMouseOut = () => (this.isMouseOver = false);

    render() {
        const action = this.props.action;

        return (
            <li
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                style={{
                    position: "relative",
                    minHeight: 30,
                    display: "block",
                    padding: 5
                }}
            >
                <div
                    style={{
                        left: 5,
                        top: 7,
                        position: "absolute",
                        width: 30,
                        height: 30
                    }}
                >
                    <ChatMessageAvatar member={action.memberCreator} />
                </div>
                <div
                    style={{
                        marginLeft: 40,
                        wordWrap: "break-word"
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {action.memberCreator.fullName}
                        </span>

                        <span
                            style={{
                                fontSize: 10,
                                color: "grey",
                                paddingLeft: 6
                            }}
                        >
                            {moment(action.date).fromNow()}
                        </span>
                    </div>
                    <div
                        className="action-comment"
                        style={{
                            padding: "9px 11px",
                            cursor: "auto"
                        }}
                    >
                        <p>{renderMessage(action.data.text)}</p>
                    </div>
                </div>
            </li>
        );
    }
}
