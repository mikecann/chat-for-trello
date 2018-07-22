import { ILogger, Signal } from "mikeysee-helpers";
import { Message } from "../../controllers/ContentScriptController";

export class ContentScriptToBackgroundController {
    public onDisconnect: Signal;
    private connection: chrome.runtime.Port;

    constructor(private logger: ILogger) {
        this.onDisconnect = new Signal();
    }

    connect() {
        this.connection = chrome.runtime.connect();

        this.connection.onDisconnect.addListener(() => {
            this.logger.debug("Chat for Trello was disconnected from extension.");
            this.onDisconnect.dispatch();
        });
    }

    disconnect() {
        this.connection.disconnect();
    }

    send(msg: Message<any>) {
        if (!this.connection) return;

        this.connection.postMessage(msg);
    }
}
