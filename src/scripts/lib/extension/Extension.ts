import { ILogger } from "../logging/types";
import { ExtensionBusMessage, ExtensionMessageBus } from "../messaging/ExtensionMessageBus";

const openPageMessageType = "open-page";
const rebootMessageType = "reboot";

interface OpenPage extends ExtensionBusMessage {
    type: typeof openPageMessageType;
    url: string;
}

export class Extension {
    constructor(private logger: ILogger, private bus: ExtensionMessageBus) {}

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

    sendReboot() {
        this.logger.debug("Sending reboot message");
        this.bus.sendMessage({ type: rebootMessageType });
    }
}
