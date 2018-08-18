import * as React from "react";
import { DOMWatcher } from "../helpers/DOMWatcher";
import { Board } from "./Board";
import { observer, inject } from "mobx-react";
import { PageStore } from "../stores/PageStore";
import { ILogger } from "../../lib/logging/types";
import { StoresFactory } from "../helpers/StoresFactory";
import { AppSettingsStore } from "../../lib/settings/AppSettingsStore";
import { AppSettings } from "../../common/config";

interface Props {
    factory?: StoresFactory;
    logger?: ILogger;
    page: PageStore;
    element: HTMLElement;
    settings?: AppSettingsStore<AppSettings>;
}

type BoardDetails = {
    id: string;
    element: HTMLElement;
};

@inject("logger", "factory", "settings")
@observer
export class Page extends React.Component<Props, {}> {
    private watcher: DOMWatcher;

    componentDidMount() {
        this.watchForBoardChanges();

        const board = this.findBoard();
        if (board) {
            this.props.logger!.debug(
                `Page has detected that a board currently is loaded with id '${board.id}'`,
                board
            );
            this.setBoard(board);
        } else this.props.logger!.debug(`Page has detected that a board is not currently loaded`);
    }

    private watchForBoardChanges() {
        this.props.logger!.debug(`Page starting to watch for board changes..`);
        this.watcher = new DOMWatcher(this.props.logger!);
        this.watcher.elementAdded = this.onBoardElementAdded;

        const contentEl = this.props.element.querySelector("#content");
        if (!contentEl)
            throw new Error(
                "Could not find the content element while starting to watch for board changes"
            );

        this.watcher.watch(contentEl, {
            classes: ["board-wrapper"],
            childList: true,
            subtree: false
        });
    }

    private onBoardElementAdded = (el: HTMLElement) => {
        var board = this.findBoard();
        if (!board)
            throw new Error(
                "Page detected a board change but could not find the board when looked for."
            );

        this.props.logger!.debug(
            `Page detected a board change. New board id: '${board.id}'`,
            board
        );
        this.setBoard(board);
    };

    private async setBoard(board: BoardDetails) {
        // var model = await this.props.factory!.createBoard(board.id, this.props.model);
        // await model.init();
        this.props.page.loadBoard(board.id);
    }

    private findBoard(): BoardDetails | null {
        const id = this.findBoardId();
        const element = this.findBoardElement();
        if (!id || !element) return null;

        return { id, element };
    }

    private findBoardElement(): HTMLElement | null {
        return this.props.element.querySelector(".board-wrapper");
    }

    private findBoardId(): string | null {
        // If we arent on a model page then we should ignore this
        var href = window.location.href;
        var matches = href.match(".*trello.com/b/(.*)/");
        if (matches == null || matches.length < 2) return null;

        return matches[1];
    }

    componentWillUnmount() {
        this.watcher.stop();
        this.props.logger!.debug(`Page no longer watching for board changes.`);
    }

    render() {
        const { page } = this.props;

        if (!page.board) return null;

        var boardElement = this.findBoardElement();
        if (!boardElement) return null;

        return <Board element={boardElement} key={page.board.id} board={page.board!} />;
    }
}
