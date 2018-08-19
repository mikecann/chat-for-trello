import {
    logs,
    auth,
    aggregateLogger,
    bus,
    logger,
    chromeService,
    trunk,
    session,
    notifications
} from "../common/common";
import { configure } from "mobx";
import { migration, extension } from "../common/common";
import {
    logPageStartup,
    storeExtensionMessagedLogs,
    storeLogs,
    logUnhandledErrors
} from "../common/logging";
import { BackgroundChatNotificationsController } from "./controllers/BackgroundChatNotificationsController";

const pageName = "Background";

async function init() {
    configure({ enforceActions: true });
    bus.listenForMessages();
    logUnhandledErrors(logger);
    storeExtensionMessagedLogs(logs, bus);
    storeLogs(aggregateLogger, pageName, logs);
    logPageStartup(aggregateLogger, pageName, chromeService);
    await migration.preMigrate();
    await trunk.init();
    await migration.migrate();
    session.attemptToResumeSession();
    //auth.startPeriodicallyReauthenticating();
    extension.handleOpenPage();
    extension.handleReboot();
    extension.setupBackgroundPage({ logs });
    notifications.init();
    new BackgroundChatNotificationsController(logger, bus, notifications, chromeService).init();
}

init();
