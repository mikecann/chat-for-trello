import { BoardStore } from "./BoardStore";
import { ILogger } from "mikeysee-helpers";
import { StoresFactory } from "../helpers/StoresFactory";
import { ChatService } from "../services/ChatService";
import { observable, runInAction } from "mobx";
import * as moment from "moment";

export class ChatStore
{
    @observable card: TrelloCard;
    @observable history: TrelloCommentAction[] = [];

    constructor(
        private logger: ILogger,
        private board: BoardStore,
        private factory: StoresFactory,
        private chatService: ChatService
    ){}

    async load() {
        const card = await this.chatService.getOrCreateChatCard(this.board.id);
        this.logger.debug("ChatStore", "Card loaded", card);
        runInAction(() => this.card = card);

        const comments = await this.chatService.getChatHistory(this.card.id);
        const sorted = comments.sort((a,b) => moment(a.date).valueOf() - moment(b.date).valueOf());
        this.logger.debug("ChatStore", "History loaded", sorted);
        runInAction(() => this.history = sorted);
    }

    submitMessage = async (message: string) => {
        this.logger.debug("ChatStore", "Sending message..", message);
        await this.chatService.sendMessage(this.card.id, message);
        this.logger.debug("ChatStore", "Message sent");
    }
}