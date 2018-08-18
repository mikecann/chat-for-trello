import {
    CreateChatNotification,
    createChatNotification
} from "../../controllers/ChatNotificationtsController";
import { ExtensionMessageBus } from "../../lib";
import { NotificationsStore } from "../../lib/notifications/NotificationsStore";

export class BackgroundChatNotificationsController {
    constructor(private bus: ExtensionMessageBus, private notifications: NotificationsStore) {}

    init() {
        this.bus.handleMessage<CreateChatNotification, any>(createChatNotification, msg => {
            if (!msg.sender || !msg.sender.tab) return;

            console.log("HANDLE CHAT MESSAGE", msg.sender.tab);

            if (msg.sender.tab.selected) return;

            this.notifications.create(msg.options, msg.id, () => {
                if (msg.sender && msg.sender.tab && msg.sender.tab.id != null)
                    chrome.tabs.update(msg.sender.tab.id, { active: true });
            });
        });
    }
}
