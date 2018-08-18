import { BoardsService } from "./BoardsService";
import { ListsService } from "./ListsService";
import { CardsService } from "./CardsService";
import * as moment from "moment";
import { ILogger } from "../../lib/logging/types";

const listNames = ["Chat For Trello! Hidden List", "Trello Chat! List 3"];

const cardNames = ["Chat For Trello! Board Chat", "Trello Chat! Board Chat"];

export class ChatService {
    constructor(
        private logger: ILogger,
        private boardService: BoardsService,
        private listsService: ListsService,
        private cardService: CardsService
    ) {}

    async getOrCreateChatCard(boardShortCode: string): Promise<TrelloCard> {
        const list = await this.getOrCreateChatList(boardShortCode);
        const card = await this.findOrCreateChatCard(list);
        return card;
    }

    async getOrCreateChatList(boardId: string): Promise<TrelloList> {
        var options = {
            cards: "none",
            filter: "all",
            fields: "name,closed"
        };

        this.logger.debug("ChatService", "Looking for the Trello Chat list in board:", boardId);
        const lists = await this.boardService.getLists<TrelloList>(boardId, options);

        this.logger.debug("ChatService", "Board lists loaded:", lists);

        this.logger.debug("ChatService", "Board lists loaded", lists);
        var chatLists = lists.filter(l => {
            return listNames.filter(n => l.name.includes(n)).length > 0;
        });
        this.logger.debug("ChatService", "Filtered chat lists", chatLists);

        if (chatLists.length != 0) return chatLists[0];

        return this.createChatList(boardId);
    }

    async findOrCreateChatCard(list: TrelloList): Promise<TrelloCard> {
        var options = {
            actions: "none",
            attachment_fields: "none",
            member_fields: "none",
            filter: "all",
            fields: "name,dateLastActivity"
        };
        this.logger.debug("ChatService", "Getting all cards on list:", list);
        const cards = await this.listsService.getCards<TrelloCard>(list.id, options);

        this.logger.debug("ChatService", "List cards loaded", cards);

        var chatCards = cards
            .filter(l => {
                return cardNames.filter(n => l.name.includes(n)).length > 0;
            })
            .sort(
                (a, b) => (moment(a.dateLastActivity).isBefore(moment(b.dateLastActivity)) ? 1 : -1)
            );

        this.logger.debug("ChatService", "Filtered list chat cards", chatCards);

        if (chatCards.length != 0) return chatCards[0];

        return this.createChatCard(list);
    }

    async createChatCard(list: TrelloList): Promise<TrelloCard> {
        var options = {
            name: cardNames[0]
        };

        this.logger.debug("ChatService", "Creating chat card on list:", list);
        const card = await this.listsService.addCard(options as any, list);
        this.logger.debug("ChatService", "Chat card created:", card);
        return card;
    }

    async createChatList(boardShortCode: string): Promise<TrelloList> {
        this.logger.debug("ChatService", "Creating chat list on board:", boardShortCode);
        const list = await this.boardService.createList(boardShortCode, listNames[0]);
        list.closed = true;
        this.logger.debug("ChatService", "Created list, archiving it", list);
        return this.listsService.update(list);
    }

    getChatHistory(cardId: string, limit: number = 50): Promise<TrelloCommentAction[]> {
        return this.cardService.getComments(cardId, {
            fields: "data,date,idMemberCreator",
            limit: limit
        });
    }

    sendMessage(cardId: string, msg: string): Promise<boolean> {
        return this.cardService.addComment(cardId, msg);
    }
}
