import { ServiceHelpers } from "../../helpers/ServiceHelpers";
import { ILogger } from "mikeysee-helpers";
import { BoardsService } from "./BoardsService";
import { ListsService } from "./ListsService";
import { CardsService } from "./CardsService";
import * as moment from "moment";

export class ChatService {

	static listName: string = "Trello Chat! List 3";
	static boardCardName: string = "Trello Chat! Board Chat";

    constructor(
		private logger: ILogger, 
		private helpers: ServiceHelpers, 
		private boardService: BoardsService,
		private listsService: ListsService, 
		private cardService: CardsService) 
		{}

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
		}

		this.logger.debug(this, "Looking for the Trello Chat list in board:", boardId);
		const lists = await this.boardService.getLists<TrelloList>(boardId, options);

		this.logger.debug(this, "Board lists loaded:", lists);

		this.logger.debug(this, "Board lists loaded", lists);
		var chatLists = lists.filter(l => l.name.substr(0, ChatService.listName.length) == ChatService.listName);
		this.logger.debug(this, "Filtered chat lists", chatLists);

		if (chatLists.length != 0)
			return chatLists[0];

		return this.createChatList(boardId);
	}

    async findOrCreateChatCard(list: TrelloList): Promise<TrelloCard> {
		var options = {
			actions: "none",
			attachment_fields: "none",
			member_fields: "none",
			filter: "all",
			fields: "name,dateLastActivity"
		}
		this.logger.debug(this, "Getting all cards on list:", list);
		const cards = await this.listsService.getCards<TrelloCard>(list.id, options)
		
		this.logger.debug(this, "List cards loaded", cards);

		var chatCards = cards.filter(c => c.name.substr(0, ChatService.boardCardName.length) == ChatService.boardCardName)
			.sort((a, b) => moment(a.dateLastActivity).isBefore(moment(b.dateLastActivity)) ? 1 : -1);

		this.logger.debug(this, "Filtered list chat cards", chatCards);

		if (chatCards.length!=0)
			return chatCards[0];

		return this.createChatCard(list);			
	}
	
	async createChatCard(list:TrelloList): Promise<TrelloCard> {				
		var options = {
			name: ChatService.boardCardName
		}
		
		this.logger.debug(this, "Creating chat card on list:", list);
		const card = await this.listsService.addCard(options as any, list);

		this.logger.debug(this, "Chat card created:", card);
		var newName = ChatService.boardCardName + " " + card.id;
		this.logger.debug(this, "Renaming card", card, newName);				
		return this.cardService.rename(card.id, newName);
	}

	async createChatList(boardShortCode: string): Promise<TrelloList> {
		this.logger.debug(this, "Creating chat list on board:", boardShortCode);
		const list = await this.boardService.createList(boardShortCode, ChatService.listName)
		
		list.closed = true;
		list.name = ChatService.listName + " " + list.id;
		this.logger.debug(this, "Created list, renaming and archiving it", list);				
		return this.listsService.update(list);
	}

	getChatHistory(cardId: string): Promise<TrelloCommentAction[]> {
		return this.cardService.getComments(cardId, {
			fields: "data,date,idMemberCreator",
			limit: 50
		});
	}

	sendMessage(cardId: string, msg: string): Promise<boolean> {
		return this.cardService.addComment(cardId, msg);
	}
}