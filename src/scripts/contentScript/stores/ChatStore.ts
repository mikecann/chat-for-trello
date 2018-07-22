import { BoardStore } from "./BoardStore";
import { ILogger } from "mikeysee-helpers";
import { StoresFactory } from "../helpers/StoresFactory";
import { ChatService } from "../services/ChatService";
import { observable, runInAction, action, toJS, computed } from "mobx";
import * as moment from "moment";
import { ResizableDirection } from "re-resizable";
import { ResizableDelta, Position } from "react-rnd";
import { WindowDimensions } from "./WindowDimensions";
import { DraggableData } from "react-draggable";
import { AppSettingsModel } from "../../models/AppSettingsModel";
import { ChatWindowOrder } from "../../models/ChatWindowOrder";

const minimisedHeight = 35;

export class ChatStore
{
    @observable card: TrelloCard;
    @observable history: TrelloCommentAction[] = [];

    constructor(
        private logger: ILogger,
        private board: BoardStore,
        private factory: StoresFactory,
        private chatService: ChatService,
        private appSettings: AppSettingsModel
    ){}

    async init() {
        await this.loadCard();
        await this.loadHistory();
    }

    private async loadCard() {
        const card = await this.chatService.getOrCreateChatCard(this.board.id);
        this.logger.debug("ChatStore", "Card loaded", card);
        runInAction(() => this.card = card);
    }

    private async loadHistory() {
        const comments = await this.chatService.getChatHistory(this.card.id, this.appSettings.settings.maxChatEntries);
        this.logger.debug("ChatStore", "History loaded", comments);
        runInAction(() => this.history = comments);
    }

    submitMessage = async (message: string) => {
        this.logger.debug("ChatStore", "Sending message..", message);
        await this.chatService.sendMessage(this.card.id, message);
        this.logger.debug("ChatStore", "Message sent");
    }

    @action onResize = (e: MouseEvent | TouchEvent, dir: ResizableDirection, 
        ref: HTMLDivElement, delta: ResizableDelta, position: Position) => {
            //this.logger.debug("ChatStore", "Window resize", { e, dir, delta, position });

            this.board.settings.setChatWindowDimensions({
                width: parseInt(ref.style.width + ""),
                height: parseInt(ref.style.height + ""),
                x: position.x,
                y: position.y,
            });
    
    }

    @computed get filteredHistory(): TrelloCommentAction[] {
        const reverse = this.history.sort((a,b) => moment(b.date).valueOf() - moment(a.date).valueOf());
        return reverse.slice(0, this.appSettings.settings.maxChatEntries).reverse();
    }

    @action onDrag = (e: Event, data: DraggableData) => {
        const dimensions = this.board.settings.settings.chatWindowDimensions;
        this.board.settings.setChatWindowDimensions({
            width: dimensions.width,
            height: dimensions.height,
            x: data.x,
            y: data.y,
        });
    }

    @action onToggleMinimise = () => {
        this.board.settings.toggleChatWindowMinimised();
        const dimensions = this.board.settings.settings.chatWindowDimensions;

        const yDelta = this.isMinimised ? 
            dimensions.height - minimisedHeight : 
            -dimensions.height + minimisedHeight;

        this.board.settings.setChatWindowDimensions({
            width: dimensions.width,
            height: dimensions.height,
            x: dimensions.x,
            y: dimensions.y + yDelta,
        });
    }

    @action onClose = () => {
        this.board.settings.toggleEnabled();
    }

    @computed get dimensions(): WindowDimensions {

        const dimensions = this.board.settings.settings.chatWindowDimensions;

        if (!this.isMinimised)
            return dimensions;

        return {
            x: dimensions.x,
            y: dimensions.y,
            width: this.minWidth,
            height: minimisedHeight
        };
    }

    @computed get isMinimised() {
        return this.board.settings.settings.isChatWindowMinimised;
    }

    @computed get minHeight() {
        return this.isMinimised ? 0 : 200;
    }

    @computed get minWidth() {
        return 210;
    }

    @computed get zIndex() {
        return this.appSettings.settings.chatWindowOrder == ChatWindowOrder.BehindCards ?
            5 : 25
    }
}