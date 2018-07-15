import * as React from 'react';
import { observer } from 'mobx-react';
import { ChatStore } from '../../stores/ChatStore';
import { Segment, Header, Comment, Form, Button } from 'semantic-ui-react';
import { ChatMessage } from './ChatMessage';
import { ChatWindowBody } from './ChatWindowBody';
import { ChatWindowFooter } from './ChatWindowFooter';
import { ChatWindowHeader } from './ChatWindowHeader';

interface Props {
    store: ChatStore
}

@observer
export class ChatWindow extends React.Component<Props, {}>
{
    render() {
        const store = this.props.store;
        return <div
            style={{
                position: "absolute",
                bottom: 30,
                left: 10,
                zIndex: 1000,
            }}
        >

            <div
                style={{
                    border: "1px solid #aaaaaa",
                    width: 300,
                    height: 300,
                    borderRadius: 6,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "1px -1px 20px 1px rgba(0, 0, 0, 0.2)"
                }}
            >

                <ChatWindowHeader
                    onClose={() => {}}
                    onToggleMinimise={() => {}}
                    isMinimised={false}
                    />
                    
                <ChatWindowBody 
                    actions={store.history} />

                <ChatWindowFooter  
                    onSubmitMessage={store.submitMessage}
                    />

            </div>;
        </div>
    }
}