import { ILogger } from "mikeysee-helpers";
import { ServiceHelpers } from '../../helpers/ServiceHelpers';
import { GetBatchService } from './GetBatchService';
import { constructURL } from '../../helpers/utils';

export class CardsService {

    constructor(
        private logger: ILogger, 
        private helpers: ServiceHelpers, 
        private batchService: GetBatchService
    ) {}

    getComments(id: string): Promise<TrelloComment[]> {

        this.logger.debug("CardService Loading card comments for card", id);

        var url = constructURL("https://trello.com/1/cards/" + id + "/actions", { 
            filter: "commentCard",
            fields: "data",
            memberCreator: false
        });

        return this.batchService.batch<TrelloComment[]>(url);
    }

    addComment(id: string, msg: string): Promise<boolean> {
        
        var data = { text: msg };
        this.logger.debug("CardService Adding comment to card", id, '"'+msg+'"', data);

        var url = "https://trello.com/1/cards/" + id + "/actions/comments";

        return this.helpers.post(url, data);
    }

    archive(shortLink: string) {
        this.logger.debug("CardService archiving card", shortLink);
        var url = `https://trello.com/1/cards/${shortLink}`;
        return this.helpers.put(url, { closed: true });
    }

    changePos(shortLink: string, pos: string) {
        this.logger.debug("CardService changing card pos", shortLink, pos);
        var url = `https://trello.com/1/cards/${shortLink}`;
        return this.helpers.put(url, { pos });
    }
}