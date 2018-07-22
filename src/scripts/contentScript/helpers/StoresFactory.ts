import { CardsService } from "../services/CardsService";
import { IPersistanceService } from "../../services/IPersistanceService";
import { ILogger } from "mikeysee-helpers";
import { BoardsService } from "../services/BoardsService";
import { AppSettingsModel } from "../../models/AppSettingsModel";
import { BoardStore } from "../stores/BoardStore";
import { PageStore } from "../stores/PageStore";
import { BoardSettingsStore } from "../stores/BoardSettingsStore";
import { ChatStore } from "../stores/ChatStore";
import { ChatService } from "../services/ChatService";

export class StoresFactory {
    constructor(
        private cardService: CardsService,
        private persistanceService: IPersistanceService,
        private appSettings: AppSettingsModel,
        private logger: ILogger,
        private boardsService: BoardsService,
        private chatService: ChatService
    ) {}

    createPage() {
        this.logger.debug("ModelsFactory creating PageModel");
        return new PageStore(this.logger, this.boardsService, this);
    }

    createBoard(board: TrelloBoard) {
        this.logger.debug("ModelsFactory creating Board");
        return new BoardStore(this.logger, board, this);
    }

    createChat(board: BoardStore) {
        this.logger.debug("ModelsFactory creating Chat");
        return new ChatStore(this.logger, board, this, this.chatService, this.appSettings);
    }

    createBoardSettings(boardId: string): BoardSettingsStore {
        this.logger.debug("ModelsFactory creating BoardSettingsModel");
        return new BoardSettingsStore(boardId, this.persistanceService, this.logger);
    }
}
