import * as React from "react";
import { ChatMessage } from "./ChatMessage";
import { observer, inject } from "mobx-react";
import { ChatStore } from "../../stores/ChatStore";
import { AppSettingsStore } from "../../../lib";
import { AppSettings } from "../../../common/config";

interface ChatPopupBodyProps {
    store: ChatStore;
    settings?: AppSettingsStore<AppSettings>;
}

@inject("settings")
@observer
export class ChatWindowBody extends React.Component<ChatPopupBodyProps, {}> {
    private messagesEnd: HTMLDivElement | null;

    scrollToBottom = () => {
        if (!this.messagesEnd) return;

        if (!this.props.settings!.settings.autoScrollChatWindow) return;

        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        var actions = this.props.store.filteredHistory;
        return (
            <div
                style={{
                    padding: 5,
                    background: "#edeff0",
                    flex: 1,
                    overflowY: "scroll"
                }}
            >
                <ul>{actions.map(a => <ChatMessage key={a.id} action={a} />)}</ul>
                <div style={{ float: "left", clear: "both" }} ref={el => (this.messagesEnd = el)} />
            </div>
        );
    }
}
