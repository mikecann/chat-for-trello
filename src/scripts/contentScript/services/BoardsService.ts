import { ILogger } from "mikeysee-helpers";
import { ServiceHelpers } from "../../helpers/ServiceHelpers";

export class BoardsService {
    constructor(private logger: ILogger, private helpers: ServiceHelpers) {}

    async getBoard<T>(boardId: string, data?: any): Promise<T> {
        this.logger.debug("Board", boardId);
        var resp = await this.helpers.get<T>(`https://trello.com/1/boards/${boardId}`, data);
        return resp;
    }

    async getLists<T>(boardId: string, data?: any): Promise<T[]> {
        this.logger.debug("Loading lists for board", boardId);
        var resp = await this.helpers.get<T[]>(
            `https://trello.com/1/boards/${boardId}/lists`,
            data
        );
        return resp;
    }

    async createList(boardId: string, name: string): Promise<TrelloList> {
        var url = "https://trello.com/1/boards/" + boardId + "/lists";
        this.logger.debug(this, "Adding list to board..", boardId, name);
        const resp = await this.helpers.post<TrelloList>(url, {
            name
        });

        return resp;
    }
}
