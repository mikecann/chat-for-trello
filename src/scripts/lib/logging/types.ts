export interface ILogger {
    debug(channel: string, ...rest: any[]): void;
    info(channel: string, ...rest: any[]): void;
    warn(channel: string, ...rest: any[]): void;
    error(channel: string, ...rest: any[]): void;
}

export interface LogEntry {
    page: string;
    channel: string;
    level: LogLevel;
    time: string;
    json: string;
}

export type LogLevel = "debug" | "info" | "warn" | "error";
