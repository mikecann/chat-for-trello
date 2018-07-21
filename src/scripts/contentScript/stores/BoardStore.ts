import { ILogger } from "mikeysee-helpers";
import { StoresFactory } from "../helpers/StoresFactory";
import { observable } from "mobx";
import { ChatStore } from "./ChatStore";
import { BoardSettingsStore } from "./BoardSettingsStore";

export class BoardStore {

    @observable id: string;
    @observable chat: ChatStore;
    @observable settings: BoardSettingsStore;

    constructor(
        private logger: ILogger,
        private board: TrelloBoard,
        private factory: StoresFactory
    ){
        this.id = board.id;
        this.chat = factory.createChat(this);
        this.settings = factory.createBoardSettings(this.id);
    }

    async init() {
        await this.settings.init();
        await this.chat.init();
    }

    dispose() {
        this.settings.dispose();
    }
}