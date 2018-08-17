import { observable, action, toJS } from "mobx";
import * as fs from "file-saver";
import { LogEntry } from "./types";
import { ExtensionMessageBus } from "../messaging/ExtensionMessageBus";

const updatedMessage = typeof "LogsStore-enties-updated";
const syncRequestMessage = typeof "LogsStore-enties-sync-request";

export class LogsStore {
    @observable entries: LogEntry[] = [];

    constructor(private fileSaver: typeof fs, private entryLimit = 200) {}

    @action
    clear() {
        this.entries = [];
    }

    @action
    append(entry: LogEntry) {
        this.entries.push(entry);
        if (this.entries.length > this.entryLimit) this.entries.shift();
    }

    beginSyncingWithBackground(backgroundLogs: LogsStore) {
        this.entries = backgroundLogs.entries;
    }

    download() {
        const messages = toJS(this.entries);
        const str = JSON.stringify(messages, null, 2);
        var blob = new Blob([str], { type: "text/plain;charset=utf-8" });
        this.fileSaver.saveAs(blob, "logs.json");
    }
}
