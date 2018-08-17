import { ILogger } from "../logging/types";

export interface ExtensionBusMessage {
    type: string;
}

export type MessageHandler<T extends ExtensionBusMessage, U> = (msg: T) => U;

export class ExtensionMessageBus {
    private port?: chrome.runtime.Port;
    public onDisconnect?: () => void;

    private handlers: {
        [type: string]: MessageHandler<any, any>;
    } = {};

    constructor(private logger: ILogger) {}

    connect() {
        this.port = chrome.runtime.connect();
        this.port.onDisconnect.addListener(() => {
            if (this.onDisconnect) this.onDisconnect();
        });
    }

    listenForMessages() {
        chrome.runtime.onConnect.addListener(port => {
            port.onMessage.addListener(msg => this.onMsg(msg));
        });

        chrome.runtime.onMessage.addListener((msg, sender, responseCb) =>
            this.onMsg(msg, responseCb)
        );
    }

    private onMsg(msg: any, responseCb?: (response: any) => void) {
        if (!msg.type) return;

        const type: string = msg.type;
        if (this.handlers[type]) {
            const response = this.handlers[type](msg);
            if (response && responseCb) responseCb(response);
        }
    }

    disconnect() {
        if (this.port) this.port.disconnect();
    }

    sendMessage<T extends ExtensionBusMessage, U>(msg: T, responseCb?: (resp: U) => void) {
        chrome.runtime.sendMessage(msg, responseCb);
    }

    handleMessage<T extends ExtensionBusMessage, U>(type: string, handler: MessageHandler<T, U>) {
        this.handlers[type] = handler;
    }
}
