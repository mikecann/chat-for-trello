import * as React from 'react';
import { ChatMessage } from './ChatMessage';
import { observer } from 'mobx-react';

interface ChatPopupBodyProps {
    actions: TrelloCommentAction[];
}

@observer
export class ChatWindowBody extends React.Component<ChatPopupBodyProps, {}> {

    private messagesEnd: HTMLDivElement | null;

    scrollToBottom = () => {
        if (!this.messagesEnd)
            return;

        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        var actions = this.props.actions;
        return <div
            style={{
                padding: 5,
                background: "#edeff0",
                flex: 1,
                overflowY: "scroll"
            }}
        >
            <ul>
                {
                    actions.map(a => <ChatMessage
                        key={a.id}
                        action={a} />)
                }
            </ul>
            <div style={{ float: "left", clear: "both", height: 0 }}
                ref={el => this.messagesEnd = el} />
        </div>;
    }
}