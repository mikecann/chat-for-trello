import { BoardsService } from "../services/BoardsService";
import { BoardStore } from "../stores/BoardStore";
import { PageStore } from "../stores/PageStore";
import { BoardSettingsStore } from "../stores/BoardSettingsStore";
import { ChatStore } from "../stores/ChatStore";
import { ChatService } from "../services/ChatService";
import { IPersistanceService } from "../../lib/persistance/IPersistanceService";
import { AppSettings } from "../../common/config";
import { ILogger } from "../../lib/logging/types";
import { AppSettingsStore } from "../../lib/settings/AppSettingsStore";
import { MeStore } from "../stores/MeStore";
import { MembersService } from "../services/MembersService";

export class StoresFactory {
    constructor(
        private persistanceService: IPersistanceService,
        private appSettings: AppSettingsStore<AppSettings>,
        private logger: ILogger,
        private boardsService: BoardsService,
        private chatService: ChatService,
        private membersService: MembersService
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

    createMe() {
        this.logger.debug("ModelsFactory creating MeStore");
        return new MeStore(this.logger, this.membersService);
    }

    createBoardSettings(boardId: string): BoardSettingsStore {
        this.logger.debug("ModelsFactory creating BoardSettingsModel");
        return new BoardSettingsStore(boardId, this.persistanceService, this.logger);
    }
}
