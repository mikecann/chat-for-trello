import { ILogger, LogLevel } from "./types";

export type LogFilter = (level: LogLevel, args: any[]) => boolean;

export class FilteredLogger implements ILogger {
    constructor(public target: ILogger, public filter: LogFilter = (l, a) => true) {}

    debug(channel: string, ...rest: any[]) {
        if (this.filter("debug", rest)) this.target.debug(channel, ...rest);
    }

    info(channel: string, ...rest: any[]) {
        if (this.filter("info", rest)) this.target.info(channel, ...rest);
    }

    warn(channel: string, ...rest: any[]) {
        if (this.filter("warn", rest)) this.target.warn(channel, ...rest);
    }

    error(channel: string, ...rest: any[]) {
        if (this.filter("error", rest)) this.target.error(channel, ...rest);
    }
}
