import {
    CreateChatNotification,
    createChatNotification
} from "../../controllers/ChatNotificationtsController";
import { ExtensionMessageBus, ChromeService, ILogger } from "../../lib";
import { NotificationsStore } from "../../lib/notifications/NotificationsStore";

export class BackgroundChatNotificationsController {
    constructor(
        private logger: ILogger,
        private bus: ExtensionMessageBus,
        private notifications: NotificationsStore,
        private chrome: ChromeService
    ) {}

    init() {
        this.bus.handleMessage<CreateChatNotification, any>(createChatNotification, async msg => {
            if (!msg.sender || !msg.sender.tab) return;

            const window = await this.chrome.getWindow(msg.sender.tab.windowId);

            this.logger.debug("BackgroundChatNotificationsController", "Handle message", {
                tab: msg.sender.tab,
                window
            });

            if (msg.sender.tab.selected && window.focused) return;

            this.notifications.create(msg.options, msg.id, () => {
                if (msg.sender && msg.sender.tab && msg.sender.tab.id != null)
                    chrome.tabs.update(msg.sender.tab.id, { active: true });
            });
        });
    }
}
