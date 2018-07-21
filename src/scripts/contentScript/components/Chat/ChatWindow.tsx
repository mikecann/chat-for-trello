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
                    boxShadow: "1px -1px 20px 1px rgba(0, 0, 0, 0.2)"
                }}
                minWidth={store.minWidth}
                minHeight={store.minHeight}
                size={{ 
                    width: store.dimensions.width,
                    height: store.dimensions.height,
                }}
                position={{
                    x: store.dimensions.x,
                    y: store.dimensions.y
                }}
                enableResizing={{
                    bottom: !store.isMinimised,
                    bottomLeft: !store.isMinimised,
                    bottomRight: !store.isMinimised,
                    left: !store.isMinimised,
                    right: !store.isMinimised,
                    top:!store.isMinimised,
                    topLeft: !store.isMinimised,
                    topRight: !store.isMinimised,
                  }}
                disableDragging={false}
                dragHandleClassName="chat-window-header"
                onResize={store.onResize}           
                onDrag={store.onDrag}
                bounds=".board-wrapper"
            >

                <ChatWindowHeader store={store} />

                {
                    store.isMinimised ? null : 
                        <React.Fragment>
                            <ChatWindowBody actions={store.history} />
                            <ChatWindowFooter onSubmitMessage={store.submitMessage} />
                        </React.Fragment>
                }

            </Rnd>
        </div>
    }
}