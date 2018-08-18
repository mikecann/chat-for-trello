import { action } from "mobx";
import { PageStore } from "../contentScript/stores/PageStore";
import { BoardStore } from "../contentScript/stores/BoardStore";
import { ILogger } from "../lib/logging/types";
import { waitForMilliseconds, setProps } from "../common/utils";
import { ChatNotificationtsController } from "./ChatNotificationtsController";

type NotifyMessage = {
    idModelChannel: string;
    ixLastUpdateChannel: number;
    notify: {
        event: string;
        typeName: "Board" | "List" | "Card" | "Action";
        deltas: Delta[];
        tags: string[];
        idBoard: string;
        idAction?: string;
    };
};

type Delta = {
    id: string;
};

type ActionDelta = Delta & { type: string | "commentCard" };

type NewCommentHandler = (comment: TrelloCommentAction) => void;

export class WebSocketInterceptHandler {
    constructor(
        private logger: ILogger,
        private page: PageStore,
        private newCommentHandler: NewCommentHandler
    ) {}

    listen() {
        window.addEventListener(
            "chat-for-trello-wrapped-WebSocket-message",
            this.onWebSocketMessage
        );
    }

    private onWebSocketMessage = async (e: CustomEvent) => {
        if (!e.detail) return;

        // Always pause a small amount to allow the Trello UI to update first
        await waitForMilliseconds(100);

        var content = JSON.parse(e.detail);
        this.logger.debug("WebSocket message intercepted", content);

        if (content["notify"]) this.handleNotifyMessage(content as NotifyMessage);
    };

    @action
    private handleNotifyMessage(msg: NotifyMessage) {
        const board = this.page.board;

        if (!board) return;

        if (msg.notify.typeName == "Action")
            msg.notify.deltas.forEach(d => this.applyActionDelta(d as ActionDelta, board));

        if (msg.notify.idBoard != board.id) return;

        if (msg.notify.typeName == "Board")
            msg.notify.deltas.forEach(d => this.applyBoardDelta(d, board));
    }

    private applyBoardDelta(delta: Delta, board: BoardStore) {
        this.logger.debug("WebSocketInterceptHandler applying board delta", delta);
        setProps(board, delta);
    }

    private applyActionDelta(delta: ActionDelta, board: BoardStore) {
        this.logger.debug("WebSocketInterceptHandler detected delta change", delta);

        if (delta.type != "commentCard") return;

        const comment = delta as TrelloCommentAction;
        const isChatComment = comment.data.card.id == board.chat.card.id;

        if (!isChatComment) return;

        board.chat.history.push(comment);
        this.newCommentHandler(comment);
    }
}
