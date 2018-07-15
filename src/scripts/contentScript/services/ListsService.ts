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
}