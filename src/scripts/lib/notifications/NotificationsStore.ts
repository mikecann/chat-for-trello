import { ExtensionMessageBus, ExtensionBusMessage } from "../messaging/ExtensionMessageBus";
import { observable } from "mobx";

export type ClickHander = (id: string, buttonIndx: number) => void;

type Notifications = {
    [key: string]: ClickHander | undefined;
};

export class NotificationsStore {
    @observable notifications: Notifications = {};

    init() {
        chrome.notifications.onClosed.addListener(this.onNotificationClosed);
        chrome.notifications.onButtonClicked.addListener(this.onNotificationClicked);
    }

    private onNotificationClosed = (id: string) => delete this.notifications[id];

    private onNotificationClicked = (id: string, indx: number) => {
        const handler = this.notifications[id];
        if (handler) handler(id, indx);
    };

    create(
        options: chrome.notifications.NotificationOptions,
        id: string = "",
        clickHandler?: ClickHander
    ) {
        chrome.notifications.create(id, options, createdId => {
            this.notifications[createdId] = clickHandler;
        });
    }
}
