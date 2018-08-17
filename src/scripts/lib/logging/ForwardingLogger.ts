import * as moment from "moment";
import { ILogger, LogLevel, LogEntry } from "./types";

export type LogReciever = (log: LogEntry) => void;

export class ForwardingLogger implements ILogger {
    constructor(private page: string, public reciever: LogReciever) {}

    debug(channel: string, ...rest: any[]) {
        this.log("debug", channel, ...rest);
    }

    info(channel: string, ...rest: any[]) {
        this.log("info", channel, ...rest);
    }

    warn(channel: string, ...rest: any[]) {
        this.log("warn", channel, ...rest);
    }

    error(channel: string, ...rest: any[]) {
        this.log("error", channel, ...rest);
    }

    log(level: LogLevel, channel: string, ...rest: any[]) {
        const time = moment().format("dddd, MMMM Do YYYY, h:mm:ss.SSS a") + "";
        const page = this.page;
        try {
            this.reciever({ channel, level, time, page, json: JSON.stringify(rest) });
        } catch (e) {
            this.reciever({
                channel,
                level,
                time,
                page,
                json: "__COULD_NOT_CONVERT_TO_JSON__"
            });
        }
    }
}
