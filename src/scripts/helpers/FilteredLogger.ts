import { ILogger } from 'mikeysee-helpers';
import { LogLevel } from './Logging';

export type LogFilter = (level: LogLevel, args: any[]) => boolean;

export class FilteredLogger implements ILogger {

    constructor(public target: ILogger, public filter: LogFilter = (l,a) => true) {
    }

    debug(...args: any[]) {
        if (this.filter("debug", args))
            this.target.debug(...args);
    }

    info(...args: any[]) {
        if (this.filter("info", args))
            this.target.info(...args);
    }

    warn(...args: any[]) {
        if (this.filter("warn", args))
            this.target.warn(...args);
    }

    error(...args: any[]) {
        if (this.filter("error", args))
            this.target.error(...args);
    }
}