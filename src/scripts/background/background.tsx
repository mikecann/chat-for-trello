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
import { ContentScriptController } from "../controllers/ContentScriptController";
import { initSentry } from "../common/sentry";

const pageName = "Background";

async function init() {
    configure({ enforceActions: true });
    initSentry();
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

    const contentScripts = new ContentScriptController(logger);
    await contentScripts.init();
    contentScripts.injectIntoExistingTabs();
}

init();
