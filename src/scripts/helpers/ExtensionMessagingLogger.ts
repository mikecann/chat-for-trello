import { ILogger } from 'mikeysee-helpers';
import { LogLevel } from './Logging';
import * as moment from 'moment';

export const messageType = "log-message";

export interface LogMessage {
    type: "log-message",
    pageName: string,
    level: LogLevel,
    time: string,
    data: any
}

export class ExtensionMessagingLogger implements ILogger {

    constructor(
        private pageName: string,
        private sender: (data: LogMessage) => void
    ) {  }

    debug(...args: any[]) {
        this.log("debug", args);
    }

    info(...args: any[]) {
        this.log("info", args);
    }

    warn(...args: any[]) {
        this.log("warn", args);
    }

    error(...args: any[]) {
        this.log("error", args);
    }

    private log(level: LogLevel, data: any) {

        const time = moment().format("dddd, MMMM Do YYYY, h:mm:ss.SSS a") + "";
        const type = messageType;
        const pageName = this.pageName;

        try {
            JSON.stringify(data);
            this.sender({ type, pageName, level, time, data });
        }
        catch(e) {
            this.sender({ type, level, pageName, time, data: [data[0], "__COULD_NOT_CONVERT_TO_JSON__"] });
        }
        
    }

}