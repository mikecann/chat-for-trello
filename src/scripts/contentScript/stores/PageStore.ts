import { observable, action, runInAction } from "mobx";
import { BoardsService } from "../services/BoardsService";
import { StoresFactory } from "../helpers/StoresFactory";
import { BoardStore } from "./BoardStore";
import { ILogger } from "../../lib/logging/types";

export class PageStore {
    @observable board: BoardStore | null;

    constructor(
        private logger: ILogger,
        private boardsService: BoardsService,
        private factory: StoresFactory
    ) {}

    async loadBoard(id: string) {
        const trelloBoard = await this.boardsService.getBoard<TrelloBoard>(id, {});

        const boardStore = this.factory.createBoard(trelloBoard);
        await boardStore.init();

        this.logger.debug("PageModel loaded board.", trelloBoard);

        runInAction(() => (this.board = boardStore));
    }
}
