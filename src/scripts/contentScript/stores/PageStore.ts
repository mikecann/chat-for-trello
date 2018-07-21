import { observable, action, runInAction } from "mobx"
import { ILogger } from "mikeysee-helpers";
import { BoardsService } from "../services/BoardsService";
import { CardsService } from "../services/CardsService";
import { StoresFactory } from "../helpers/StoresFactory";
import { BoardStore } from "./BoardStore";

export class PageStore {
    
    @observable board: BoardStore | null;

    constructor(
        private logger: ILogger,
        private boardsService: BoardsService,
        private factory: StoresFactory
    ){}

    async loadBoard(id: string) {
        const trelloBoard = await this.boardsService.getBoard<TrelloBoard>(id, 
            { 
            });

        const boardStore = this.factory.createBoard(trelloBoard);
        await boardStore.init();

        this.logger.debug("PageModel loaded board.", trelloBoard);
        
        runInAction(() => this.board = boardStore);
    }
}