import { ILogger } from "./types";

export class NullLogger implements ILogger {
    debug(channel: string, ...args: any[]) {}
    info(channel: string, ...args: any[]) {}
    warn(channel: string, ...args: any[]) {}
    error(channel: string, ...args: any[]) {}
}
