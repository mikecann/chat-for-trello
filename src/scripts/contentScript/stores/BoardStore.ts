import { StoresFactory } from "../helpers/StoresFactory";
import { observable } from "mobx";
import { ChatStore } from "./ChatStore";
import { BoardSettingsStore } from "./BoardSettingsStore";
import { ILogger } from "../../lib/logging/types";
import { MeStore } from "./MeStore";

export class BoardStore {
    @observable id: string;
    @observable chat: ChatStore;
    @observable settings: BoardSettingsStore;
    @observable me: MeStore;

    constructor(
        private logger: ILogger,
        private board: TrelloBoard,
        private factory: StoresFactory
    ) {
        this.id = board.id;
        this.chat = factory.createChat(this);
        this.settings = factory.createBoardSettings(this.id);
        this.me = factory.createMe();
    }

    async init() {
        await this.settings.init();
        await this.chat.init();
        await this.me.init();
    }

    dispose() {
        this.settings.dispose();
    }
}
