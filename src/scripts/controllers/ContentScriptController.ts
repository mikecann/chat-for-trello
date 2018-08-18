import { ILogger } from "../lib/logging/types";

export interface Message<T> {
    type: string;
    data?: T;
}

export class ContentScriptController {
    private openPorts: chrome.runtime.Port[];

    constructor(private logger: ILogger) {
        this.openPorts = [];
    }

    init(): Promise<void> {
        this.logger.debug("ContentScriptController started listening for connections from pages.");
        chrome.runtime.onConnect.addListener(port => this.onConnected(port));
        return this.injectIntoExistingTabs();
    }

    injectIntoExistingTabs(): Promise<void> {
        this.logger.debug("ContentScriptController injecting content script into tabs..");
        return new Promise<any>((resolve, reject) => {
            chrome.tabs.query({}, tabs => {
                tabs = tabs.filter(t => t.url && t.url.includes("trello.com/"));
                this.logger.debug(`Injecting content script into ${tabs.length} tabs`, tabs);
                for (var tab of tabs) {
                    try {
                        if (tab.id != undefined)
                            chrome.tabs.executeScript(
                                tab.id,
                                { file: "contentscript-bundle.js" },
                                () => {}
                            );
                    } catch (e) {}
                }
                resolve();
            });
        });
    }

    onConnected(port: chrome.runtime.Port) {
        this.logger.debug(
            `Content script connected named '${port.name}', adding it to the list of open ports.`,
            port
        );

        port.onMessage.addListener((message: Message<any>) => {
            this.logger.debug(`Got a message from a content script`, message);
            if (message.type == "open-settings") {
                var url = chrome.extension.getURL("settings.html#/premium");
                chrome.tabs.create({ url });
            }
        });

        port.onDisconnect.addListener(port => {
            this.logger.debug(`Port disconnected, removing it from the list of open ports..`, port);
            var indx = this.openPorts.indexOf(port);
            this.openPorts = [...this.openPorts.slice(0, indx), ...this.openPorts.slice(indx + 1)];
            this.logger.debug(`There are now ${this.openPorts.length} open ports.`);
        });

        this.openPorts.push(port);

        this.logger.debug(`There are now ${this.openPorts.length} open ports.`);
    }

    sendMessage<T>(port: chrome.runtime.Port, message: Message<T>) {
        port.postMessage(message);
    }

    destroy() {
        this.logger.debug(`Disconnecting ${this.openPorts.length} open ports.`);

        for (var port of this.openPorts) port.disconnect();

        this.openPorts = [];
    }
}
