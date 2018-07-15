import * as React from 'react';
import { observable, action, runInAction } from 'mobx';
import { observer } from 'mobx-react';

interface ChatPopupBodyProps {
    onToggleMinimise: () => void;
    onClose: () => void;
    isMinimised: boolean;
}

@observer
export class ChatWindowHeader extends React.Component<ChatPopupBodyProps, {}> {

    render() {
        return <div
            style={{
                paddingTop: 8,
                paddingBottom: 0,
                paddingLeft: 5,
                paddingRight: 5,
                height: 25,
                background: "#e2e4e6",
                overflow: "hidden",
                borderBottom: "1px solid #dddddd",
                fontSize: 16,
                fontWeight: "bold",
                color: "grey"
            }}
        >
            <img style={{
                opacity: 0.6,
                position: "absolute",
                left: 10,
                top: 10,
            }}
                src={chrome.extension.getURL("./images/logo-16x16.png")} />

            <a style={{
                marginLeft: 25,
                textDecoration: "none"
            }}
            >Chat for Trello</a>

            {/* <span className="options">
                <a className={"icon-sm icon-" + (this.props.isMinimised ? "up" : "down")}                
                    href="#" onClick={this.props.onToggleMinimise}></a>
                
                <a className="icon-sm icon-close" href="#" onClick={this.props.onClose}></a>
            </span> */}

        </div>;
    }
}