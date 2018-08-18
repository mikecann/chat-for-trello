import { ILogger } from "../../lib/logging/types";
import { HttpHelpers } from "../../lib/http/HttpHelpers";

export class MembersService {
    constructor(private logger: ILogger, private helpers: HttpHelpers) {}

    getMe(): Promise<TrelloMember> {
        this.logger.debug("MembersService getting me");
        var url = `https://trello.com/1/members/me`;
        return this.helpers.get(url);
    }
}
