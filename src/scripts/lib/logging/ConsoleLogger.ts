import { ILogger, LogLevel } from "./types";

interface Hash {
    [details: string]: string;
}

const levelColors: Hash = {
    debug: "color: blue",
    info: "color: teal",
    warn: "color: orange",
    error: "color: red"
};

export class ConsoleLogger implements ILogger {
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
        const color: any = levelColors[level];
        console.log("%c" + level.toUpperCase(), color, `[${channel}]`, ...rest);
    }
}
