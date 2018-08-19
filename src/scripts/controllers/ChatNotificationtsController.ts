import { AppSettingsStore } from "../lib/settings/AppSettingsStore";
import { AppSettings } from "../common/config";
import { PageStore } from "../contentScript/stores/PageStore";
import { ExtensionMessageBus, ILogger } from "../lib";
import * as shortid from "shortid";
import { ExtensionBusMessage } from "../lib/messaging/ExtensionMessageBus";

export const createChatNotification = "create-chat-notification";

export interface CreateChatNotification extends ExtensionBusMessage {
    type: typeof createChatNotification;
    id: string;
    options: chrome.notifications.NotificationOptions;
}

export class ChatNotificationtsController {
    private notifications = {};

    constructor(
        private logger: ILogger,
        private appSettings: AppSettingsStore<AppSettings>,
        private bus: ExtensionMessageBus,
        private page: PageStore
    ) {}

    handleNewComment = (comment: TrelloCommentAction) => {
        if (!this.appSettings.settings.desktopNotificationsEnabled) return;
        if (!this.page.board || !this.page.board.me) return;
        const me = this.page.board.me.me;
        if (me.id == comment.memberCreator.id) return;
        const msg: CreateChatNotification = {
            type: createChatNotification,
            id: shortid.generate(),
            options: {
                title: comment.memberCreator.fullName,
                message: comment.data.text,
                type: "basic",
                iconUrl: "images/logo-128x128.png"
            }
        };
        this.logger.debug(
            "ChatNotificationtsController",
            "New comment, sending request to open comment"
        );
        this.notifications[msg.id] = msg;
        this.bus.sendMessage(msg);
    };
}
