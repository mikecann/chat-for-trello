import { ExtensionBusMessage, ExtensionMessageBus } from "../lib/messaging/ExtensionMessageBus";
import { LogEntry, ILogger } from "../lib/logging/types";
import { AggregateLogger } from "../lib/logging/AggregateLogger";
import { ChromeService } from "../lib/chrome/ChromeService";
import { ForwardingLogger } from "../lib/logging/ForwardingLogger";
import { LogsStore } from "../lib/logging/LogsStore";
const messageType = "log-message";

export interface LogMessage extends ExtensionBusMessage {
    type: typeof messageType;
    entry: LogEntry;
}

export function logPageStartup(logger: ILogger, page: string, chromeService: ChromeService) {
    logger.info("logging.ts", `Tasks for Trello v${chromeService.appVersion} starting up ${page}`, {
        env: process.env
    });
}

export function sendLogsToExtension(
    aggregateLogger: AggregateLogger,
    pageName: string,
    bus: ExtensionMessageBus
) {
    aggregateLogger.loggers.push(
        new ForwardingLogger(pageName, entry =>
            bus.sendMessage<LogMessage, void>({
                type: messageType,
                entry
            })
        )
    );
}

export function storeExtensionMessagedLogs(store: LogsStore, bus: ExtensionMessageBus) {
    bus.handleMessage<LogMessage, void>(messageType, msg => store.append(msg.entry));
}

export function storeLogs(aggregateLogger: AggregateLogger, pageName: string, store: LogsStore) {
    aggregateLogger.loggers.push(new ForwardingLogger(pageName, entry => store.append(entry)));
}

export function logUnhandledErrors(logger: ILogger) {
    window.addEventListener("error", e => {
        console.error("Unhandled Error occurred", e);

        logger.error("logging.ts", "Unhandled error", {
            column: e.colno,
            message: e.message,
            line: e.lineno,
            stack: e.error ? e.error.stack : undefined,
            filename: e.filename
        });

        return false;
    });
}
