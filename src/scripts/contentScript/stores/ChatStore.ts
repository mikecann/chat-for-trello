import { BoardStore } from "./BoardStore";
import { ILogger } from "mikeysee-helpers";
import { StoresFactory } from "../helpers/StoresFactory";
import { ChatService } from "../services/ChatService";
import { observable, runInAction } from "mobx";

export class ChatStore
{
    @observable card: TrelloCard;

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
    }
}