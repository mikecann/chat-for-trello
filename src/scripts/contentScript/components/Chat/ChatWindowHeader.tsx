import * as React from "react";
import { observer } from "mobx-react";
import { ChatStore } from "../../stores/ChatStore";
import { Icon, Button, Label } from "semantic-ui-react";

interface ChatPopupBodyProps {
    store: ChatStore;
}

@observer
export class ChatWindowHeader extends React.Component<ChatPopupBodyProps, {}> {
    render() {
        const store = this.props.store;

        return (
            <div
                className="chat-window-drag-handle"
                onDoubleClick={store.onToggleMinimise}
                style={{
                    paddingTop: 8,
                    paddingBottom: 0,
                    paddingLeft: 5,
                    paddingRight: 5,
                    height: 25,
                    background: "#e2e4e6",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    borderBottomLeftRadius: store.isMinimised ? 6 : undefined,
                    borderBottomRightRadius: store.isMinimised ? 6 : undefined,
                    overflow: "hidden",
                    borderBottom: "1px solid #dddddd",
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "grey",
                    cursor: "move"
                }}
            >
                <img
                    style={{
                        opacity: 0.6,
                        position: "absolute",
                        left: 10,
                        top: 10
                    }}
                    src={chrome.extension.getURL("./images/logo-16x16.png")}
                />

                {/* <Label
                style={{
                    position: "absolute",
                    minWidth: 12,
                    minHeight: 10,
                    left: 4,
                    top: 5
                }}
                circular
                color="red">
                2
                </Label> */}

                <span
                    style={{
                        marginLeft: 30,
                        textDecoration: "none",
                        cursor: "move"
                    }}
                >
                    Chat for Trello
                </span>

                <span
                    style={{
                        float: "right",
                        paddingRight: 5
                    }}
                >
                    <a
                        className={"icon-sm icon-" + (store.isMinimised ? "up" : "down")}
                        style={{
                            marginRight: 5
                        }}
                        href="#"
                        onClick={store.onToggleMinimise}
                    />

                    <a className="icon-sm icon-close" href="#" onClick={store.onClose} />
                </span>
            </div>
        );
    }
}
