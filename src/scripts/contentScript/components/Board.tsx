import * as React from 'react';
import { ILogger } from 'mikeysee-helpers';
import { toArray } from '../../helpers/utils';
import { observer, inject } from 'mobx-react';
import { StoresFactory } from '../helpers/StoresFactory';
import { Portal } from './Portal';
import { observable } from 'mobx';
import { BoardButton } from './BoardButton';
import { PageStore } from '../stores/PageStore';
import { BoardSettingsStore } from '../stores/BoardSettingsStore';
import { BoardStore } from '../stores/BoardStore';
import { ChatWindow } from './ChatWindow';

interface Props {
    board: BoardStore,
    element: HTMLElement,
    logger?: ILogger,
    page?: PageStore,
    factory?: StoresFactory
}

@inject("logger", "page", "factory")
@observer
export class Board extends React.Component<Props, any>
{
    @observable settings: BoardSettingsStore;

    private semanticStyles?: HTMLLinkElement;

    constructor(props: Props, context?: any) {
        super(props, context);
        this.settings = props.factory!.createBoardSettings(this.props.board.id);
        this.settings.init();
    }

    addSemanticUIStyles() {
        if (this.semanticStyles)
            return;

        this.semanticStyles = document.createElement('link');
        this.semanticStyles.setAttribute('rel', 'stylesheet');
        this.semanticStyles.type = 'text/css';
        this.semanticStyles.href = chrome.extension.getURL("/libs/semantic-ui/semantic.content-script.css");
        document.head.insertBefore(this.semanticStyles, document.head.firstChild);
    }

    removeSemanticUIStyles() {
        if (!this.semanticStyles)
            return;

        this.semanticStyles.remove();
        this.semanticStyles = undefined;
    }

    componentWillUnmount() {
        this.settings.dispose();
        this.removeSemanticUIStyles();
    }

    render() {
        // console.log("BOARD UPDATED ", this.props.board.name)
        this.settings.isEnabled ? this.addSemanticUIStyles() : this.removeSemanticUIStyles();
        return <React.Fragment>
            <Portal
                queryEl={this.props.element}
                querySelector=".board-header-btns"
                mountId="chat-for-trello-board-btn">
                <BoardButton model={this.settings} />
            </Portal>
            <ChatWindow store={this.props.board.chat} />
        </React.Fragment>
    }
}