import { ILogger } from "../logging/types";
import { ExtensionBusMessage, ExtensionMessageBus } from "../messaging/ExtensionMessageBus";
import { NotificationsStore } from "../notifications/NotificationsStore";

export const openPageMessageType = "open-page";
export const rebootMessageType = "reboot";
export const createNotification = "create-notification";

export interface OpenPage extends ExtensionBusMessage {
    type: typeof openPageMessageType;
    url: string;
}

export interface CreateNotification extends ExtensionBusMessage {
    type: typeof createNotification;
    id: string;
    options: chrome.notifications.NotificationOptions;
}

export class Extension {
    constructor(
        private logger: ILogger,
        private bus: ExtensionMessageBus,
        private notifications: NotificationsStore
    ) {}

    handleOpenPage() {
        this.bus.handleMessage<OpenPage, void>(openPageMessageType, msg =>
            chrome.tabs.create({ url: msg.url })
        );
    }

    handleReboot() {
        this.bus.handleMessage<any, any>(rebootMessageType, msg => window.location.reload());
    }

    setupBackgroundPage(page: any) {
        let w = window as any;
        for (let key in page) w[key] = page[key];
    }

    sendOpenPage(url: string) {
        const msg: OpenPage = {
            type: openPageMessageType,
            url
        };
        this.bus.sendMessage(msg);
    }

    sendCreateNotification(options: chrome.notifications.NotificationOptions, id = "") {
        this.logger.debug("Extension", "Sending create notification", options);
        const msg: CreateNotification = {
            type: createNotification,
            id,
            options
        };
        this.bus.sendMessage(msg);
    }

    sendReboot() {
        this.logger.debug("Sending reboot message");
        this.bus.sendMessage({ type: rebootMessageType });
    }
}
