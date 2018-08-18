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
    //session.attemptToResumeSession();
    //auth.startPeriodicallyReauthenticating();
    extension.handleOpenPage();
    extension.handleReboot();
    extension.setupBackgroundPage({ logs });
    notifications.init();
    new BackgroundChatNotificationsController(bus, notifications).init();
}

init();

// import { ContentScriptController } from "../controllers/ContentScriptController";
// import { LogMessagesFromExtensionModel } from "../models/LogMessagesFromExtensionModel";
// import { setupStandardLogging, addLiveReloadIfDevMode } from "../helpers/utils";
// import { AppSettingsModel, AppSettings } from "../models/__AppSettingsModel";
// import { ChromePersistanceService } from "../services/ChromePersistanceService";
// import { ChromeService } from "../services/ChromeService";
// import { GoogleCloudServices } from "../services/GoogleCloudServices";
// import { BackgroundAuthModel } from "../models/AuthModel";
// import { MigrationsController } from "./controllers/MigrationsController";

// export interface BackgroundPage {
//     logMessagesModel: LogMessagesFromExtensionModel;
//     appSettings: AppSettingsModel;
//     auth: BackgroundAuthModel;
//     restart: () => void;
//     reset: () => void;
// }

// async function init() {
//     // Create dependencies
//     const logModel = new LogMessagesFromExtensionModel();
//     const logger = await setupStandardLogging("Background", msg => logModel.add(msg));
//     const contentScripts = new ContentScriptController(logger);
//     const persistance = new ChromePersistanceService(chrome.storage.sync, logger);
//     const appSettings = new AppSettingsModel(persistance, logger);
//     const chromeService = new ChromeService();
//     const cloudServices = new GoogleCloudServices();
//     const auth = new BackgroundAuthModel(persistance, chromeService, logger, cloudServices);
//     const migrations = new MigrationsController(logger, appSettings, chromeService);

//     // Set the interface up so others can access the background page
//     var background: BackgroundPage = window as any;
//     background.logMessagesModel = logModel;
//     background.appSettings = appSettings;
//     background.auth = auth;
//     background.restart = () => {
//         contentScripts.destroy();
//         window.location.reload();
//     };
//     background.reset = async () => {
//         contentScripts.destroy();
//         await persistance.clear();
//         window.location.reload();
//     };

//     // Init
//     await appSettings.init();
//     logModel.listenForNewMessages();
//     await contentScripts.init();
//     //await auth.init();
//     //await auth.attemptNonInteractiveAuthentication();
//     migrations.migrate();
//     addLiveReloadIfDevMode();
//     auth.startPeriodicallyReauthenticating();

//     // Unload any content scripts before we close
//     window.onbeforeunload = e => contentScripts.destroy();

//     logger.debug("background", "Init complete.");
// }

// init();
