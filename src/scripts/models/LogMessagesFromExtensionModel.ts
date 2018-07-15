import { observable, runInAction, action, toJS } from 'mobx';
import { messageType as extensionMesssageType, LogMessage } from '../helpers/ExtensionMessagingLogger';
import { BackgroundPage } from '../background/background';
import * as FileSaver from "file-saver";

const messageType = "LogMessagesFromExtensionModel-changed";

export class LogMessagesFromExtensionModel
{
    @observable messages: LogMessage[] = []

    listenForNewMessages() {
        chrome.runtime.onMessage.addListener((request, sender) => {
            
            if (request.type != extensionMesssageType)
                return;

            var msg = request as LogMessage;

            this.add(msg);
            chrome.runtime.sendMessage({ type: messageType, msg });
        });
    }

    @action listenForModelChangesInTheBackground(background: BackgroundPage) {

        for(var msg of background.logMessagesModel.messages)
            this.messages.push(msg);

        chrome.runtime.onMessage.addListener((request, sender) => {
            
            if (request.type != messageType)
                return;

            this.add(request.msg);
        });
    }

    @action add(message: LogMessage) {
        this.messages.push(message);
    }

    download() {
        const messages = toJS(this.messages);
        const str = JSON.stringify(messages, null, 2);
        var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "logs.json");
    }

    clear() {
        this.messages.length = 0;
    }

}