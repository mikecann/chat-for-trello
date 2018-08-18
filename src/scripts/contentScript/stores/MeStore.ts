import { ILogger } from "../../lib/logging/types";
import { MembersService } from "../services/MembersService";
import { observable, runInAction } from "mobx";

export class MeStore {
    @observable me: TrelloMember;

    constructor(private logger: ILogger, private membersService: MembersService) {}

    async init() {
        const me = await this.membersService.getMe();
        this.logger.debug("MeStore", "Loaded me", me);
        runInAction(() => (this.me = me));
    }
}
