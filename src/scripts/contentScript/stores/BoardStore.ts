import { ILogger } from "mikeysee-helpers";
import { StoresFactory } from "../helpers/StoresFactory";
import { observable } from "mobx";
import { ChatStore } from "./ChatStore";

export class BoardStore {

    @observable id: string;
    @observable chat: ChatStore;

    constructor(
        private logger: ILogger,
        private board: TrelloBoard,
        private factory: StoresFactory
    ){
        this.id = board.id;
        this.chat = factory.createChat(this);
    }

    async load() {
        await this.chat.load();
    }

}