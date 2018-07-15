import { observable, action, runInAction } from "mobx"
import { ILogger } from "mikeysee-helpers";
import { BoardsService } from "../services/BoardsService";
import { getCardIsDoneStatus, getANewIdForComment } from "../../helpers/utils";
import { CardsService } from "../services/CardsService";
import { ModelsFactory } from "../helpers/ModelsFactory";

export class PageModel {
    
    @observable board: TrelloBoard | null;

    constructor(
        private logger: ILogger,
        private boardsService: BoardsService,
        private cardsService: CardsService,
        private factory: ModelsFactory
    ){}

    async loadBoard(id: string) {
        var board = await this.boardsService.getBoard<TrelloBoard>(id, 
            { 
                fields: "id,name",
                lists: "open",
                list_fields: "id,name,closed,pos",
                cards: "visible",
                card_fields: "id,name,closed,idList,pos",
                actions: "commentCard",
                action_fields: "id,data,type",
                action_memberCreator: false,
                actions_limit: 1000

            });
        this.logger.debug("PageModel loaded board", board);
        runInAction(() => this.board = board);
    }
}