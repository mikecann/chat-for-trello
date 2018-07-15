import * as React from 'react';
import { observer } from 'mobx-react';
import { ChatStore } from '../../stores/ChatStore';
import { Segment, Header, Comment, Form, Button } from 'semantic-ui-react';
import { ChatMessage } from './ChatMessage';
import { ChatWindowBody } from './ChatWindowBody';
import { ChatWindowFooter } from './ChatWindowFooter';
import { ChatWindowHeader } from './ChatWindowHeader';
import Rnd from "react-rnd";

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
                zIndex: 24,
            }}
        >

            <Rnd
                style={{
                    border: "1px solid #aaaaaa",
                    borderRadius: 6,
                    display: "flex",
                    flexDirection: "column",
                    background: "none",
                    boxShadow: "1px -1px 20px 1px rgba(0, 0, 0, 0.2)",
                    overflow: "hidden"
                }}
                minWidth={200}
                minHeight={200}
                disableDragging={true}
                default={{
                    x: 0,
                    y: -300,
                    width: 300,
                    height: 300
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

            </Rnd>
        </div>
    }
}