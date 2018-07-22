import * as React from "react";
import { ILogger } from "mikeysee-helpers";
import { toArray } from "../../helpers/utils";
import { observer, inject } from "mobx-react";
import { StoresFactory } from "../helpers/StoresFactory";
import { Portal } from "./Portal";
import { observable } from "mobx";
import { BoardButton } from "./BoardButton";
import { PageStore } from "../stores/PageStore";
import { BoardSettingsStore } from "../stores/BoardSettingsStore";
import { BoardStore } from "../stores/BoardStore";
import { ChatWindow } from "./Chat/ChatWindow";

interface Props {
    board: BoardStore;
    element: HTMLElement;
    logger?: ILogger;
    page?: PageStore;
    factory?: StoresFactory;
}

@inject("logger", "page", "factory")
@observer
export class Board extends React.Component<Props, any> {
    private semanticStyles?: HTMLLinkElement;

    addSemanticUIStyles() {
        if (this.semanticStyles) return;

        this.semanticStyles = document.createElement("link");
        this.semanticStyles.setAttribute("rel", "stylesheet");
        this.semanticStyles.type = "text/css";
        this.semanticStyles.href = chrome.extension.getURL(
            "/libs/semantic-ui/semantic.content-script.css"
        );
        document.head.insertBefore(this.semanticStyles, document.head.firstChild);
    }

    removeSemanticUIStyles() {
        if (!this.semanticStyles) return;

        this.semanticStyles.remove();
        this.semanticStyles = undefined;
    }

    componentWillUnmount() {
        this.props.board.dispose();
        this.removeSemanticUIStyles();
    }

    render() {
        // console.log("BOARD UPDATED ", this.props.board.name)
        const board = this.props.board;
        const isEnabled = board.settings.settings.isEnabled;
        isEnabled ? this.addSemanticUIStyles() : this.removeSemanticUIStyles();
        return (
            <React.Fragment>
                <Portal
                    queryEl={this.props.element}
                    querySelector=".board-header-btns"
                    mountId="chat-for-trello-board-btn"
                >
                    <BoardButton model={board.settings} />
                </Portal>
                {/* <Portal 
                queryEl={window.document.body}
                querySelector=".board-wrapper"
                mountId="chat-window-bounds">
              
            </Portal> */}
                {isEnabled ? (
                    <Portal
                        mountAsFirst
                        queryEl={window.document.body}
                        querySelector=".board-wrapper"
                        mountId="chat-for-trello-window"
                    >
                        <div
                            className="chat-window-bounds"
                            style={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                width: "calc(100% - 20px)",
                                height: "calc(100% - 20px)"
                            }}
                        >
                            <ChatWindow store={this.props.board.chat} />
                        </div>
                    </Portal>
                ) : null}
            </React.Fragment>
        );
    }
}
