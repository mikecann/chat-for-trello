import * as React from 'react';
import { observer } from 'mobx-react';
import { ChatStore } from '../../stores/ChatStore';
import { Icon, Button } from 'semantic-ui-react';

interface ChatPopupBodyProps {
    store: ChatStore
}

@observer
export class ChatWindowHeader extends React.Component<ChatPopupBodyProps, {}> {

    render() {

        const store = this.props.store;

        return <div
            className="chat-window-header"
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
                color: "grey"
            }}
        >
            <img
                style={{
                    opacity: 0.6,
                    position: "absolute",
                    left: 10,
                    top: 10
                }}
                src={chrome.extension.getURL("./images/logo-16x16.png")} />

                <a 
                    style={{
                        marginLeft: 30,
                        textDecoration: "none"
                    }}
                >
                Chat for Trello
                </a>

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
                    href="#" onClick={store.onToggleMinimise}>
                </a>

                <a className="icon-sm icon-close" href="#" onClick={store.onClose}></a>

            </span>

        </div>;
    }
}