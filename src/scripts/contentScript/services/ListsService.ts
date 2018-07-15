import { ILogger } from "mikeysee-helpers";
import { ServiceHelpers } from '../../helpers/ServiceHelpers';

export class ListsService {

    constructor(
        private logger: ILogger, 
        private helpers: ServiceHelpers
    ) {}

    async getCards<T>(listId: string, data?: any): Promise<T[]> {
        this.logger.debug("Loading cards for list", listId);
        var resp = await this.helpers.get<T[]>(`https://trello.com/1/lists/${listId}/cards`, data);
        return resp;
    }   

    async addCard(card:TrelloCard, list:TrelloList): Promise<TrelloCard> {
        this.logger.debug(this, "Adding card to list..", card, list);
        const resp = this.helpers.post<TrelloCard>("https://trello.com/1/lists/" + list.id + "/cards", card);
        return resp;
    }

    async update(list: TrelloList) : Promise<TrelloList>
    {
        this.logger.debug(this, "Updating list:", list);
        var url = "https://trello.com/1/lists/" + list.id;
        return this.helpers.put<TrelloList>(url, list);
    }
}