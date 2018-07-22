import * as React from "react";
import { observer } from "mobx-react";
import { ChatStore } from "../../stores/ChatStore";
import { ChatWindowBody } from "./ChatWindowBody";
import { ChatWindowFooter } from "./ChatWindowFooter";
import { ChatWindowHeader } from "./ChatWindowHeader";
import Rnd from "react-rnd";
import { ChatWindowDragHandle } from "./ChatWindowDragHandle";

interface Props {
    store: ChatStore;
}

@observer
export class ChatWindow extends React.Component<Props, {}> {
    render() {
        const store = this.props.store;

        return (
            <div
                style={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    zIndex: store.zIndex
                }}
            >
                <Rnd
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "none"
                    }}
                    minWidth={store.minWidth}
                    minHeight={store.minHeight}
                    size={{
                        width: store.dimensions.width,
                        height: store.dimensions.height
                    }}
                    position={{
                        x: store.dimensions.x,
                        y: store.dimensions.y
                    }}
                    enableResizing={{
                        bottom: false,
                        bottomLeft: !store.isMinimised,
                        bottomRight: !store.isMinimised,
                        left: !store.isMinimised,
                        right: !store.isMinimised,
                        top: !store.isMinimised,
                        topLeft: !store.isMinimised,
                        topRight: !store.isMinimised
                    }}
                    disableDragging={false}
                    dragHandleClassName="chat-window-drag-handle"
                    onResize={store.onResize}
                    onDrag={store.onDrag}
                    bounds=".chat-window-bounds"
                >
                    <div
                        style={{
                            border: "1px solid #aaaaaa",
                            boxShadow: "1px -1px 20px 1px rgba(0, 0, 0, 0.2)",
                            background: "none",
                            borderRadius: 6,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <ChatWindowHeader store={store} />

                        {store.isMinimised ? null : (
                            <React.Fragment>
                                <ChatWindowBody store={store} />
                                <ChatWindowFooter onSubmitMessage={store.submitMessage} />
                            </React.Fragment>
                        )}
                    </div>

                    {store.isMinimised ? null : <ChatWindowDragHandle />}
                </Rnd>
            </div>
        );
    }
}
