import { GetBatchService } from "./GetBatchService";
import { ILogger } from "../../lib/logging/types";
import { HttpHelpers } from "../../lib/http/HttpHelpers";
import { constructURL } from "../../common/utils";

export class CardsService {
    constructor(
        private logger: ILogger,
        private helpers: HttpHelpers,
        private batchService: GetBatchService
    ) {}

    getComments(id: string, options: any): Promise<TrelloCommentAction[]> {
        this.logger.debug("CardService Loading card comments for card", id);

        var url = constructURL("https://trello.com/1/cards/" + id + "/actions", options);

        return this.batchService.batch<TrelloCommentAction[]>(url);
    }

    addComment(id: string, msg: string): Promise<boolean> {
        var data = { text: msg };
        this.logger.debug("CardService Adding comment to card", id, '"' + msg + '"', data);

        var url = "https://trello.com/1/cards/" + id + "/actions/comments";

        return this.helpers.post(url, data);
    }

    rename(cardIdOrShortLink: string, newName: String): Promise<TrelloCard> {
        var data = { value: newName };
        var url = "https://trello.com/1/cards/" + cardIdOrShortLink + "/name";
        return this.helpers.put(url, data);
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
