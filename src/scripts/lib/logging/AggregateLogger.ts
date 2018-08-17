import { ILogger } from "./types";

export class AggregateLogger implements ILogger {
    loggers: ILogger[];

    constructor() {
        this.loggers = [];
    }

    debug(channel: string, ...args: any[]) {
        for (var logger of this.loggers) logger.debug(channel, ...args);
    }
    info(channel: string, ...args: any[]) {
        for (var logger of this.loggers) logger.info(channel, ...args);
    }
    warn(channel: string, ...args: any[]) {
        for (var logger of this.loggers) logger.warn(channel, ...args);
    }
    error(channel: string, ...args: any[]) {
        for (var logger of this.loggers) logger.error(channel, ...args);
    }
}
