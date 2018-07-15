import { ContentScriptController } from '../controllers/ContentScriptController';
import { LogMessagesFromExtensionModel } from '../models/LogMessagesFromExtensionModel';
import { setupStandardLogging, addLiveReloadIfDevMode } from '../helpers/utils';
import { AppSettingsModel, AppSettings } from '../models/AppSettingsModel';
import { ChromePersistanceService } from '../services/ChromePersistanceService';
import { ChromeService } from '../services/ChromeService';
import { GoogleCloudServices } from '../services/GoogleCloudServices';
import { BackgroundAuthModel } from '../models/AuthModel';
import { ResetController } from '../controllers/ResetController';
import { MigrationsController } from './controllers/MigrationsController';

export interface BackgroundPage {
    logMessagesModel: LogMessagesFromExtensionModel,
    appSettings: AppSettingsModel,
    auth: BackgroundAuthModel,
    restart: () => void
}

async function init() {

    // Create dependencies
    const logModel = new LogMessagesFromExtensionModel();
    const logger = await setupStandardLogging("Background", msg => logModel.add(msg));
    const contentScripts = new ContentScriptController(logger);
    const persistance = new ChromePersistanceService(chrome.storage.sync, logger);
    const resetController = new ResetController();
    const appSettings = new AppSettingsModel(persistance, logger, resetController);
    const chromeService = new ChromeService();
    const cloudServices = new GoogleCloudServices();
    const auth = new BackgroundAuthModel(persistance, chromeService, logger, cloudServices);
    const migrations = new MigrationsController(logger, appSettings, chromeService);

    // Set the interface up so others can access the background page
    var background: BackgroundPage = window as any;
    background.logMessagesModel = logModel;
    background.appSettings = appSettings;
    background.auth = auth;
    background.restart = () => window.location.reload();

    // Init
    await appSettings.init();    
    logModel.listenForNewMessages();
    await contentScripts.init();
    await auth.init();
    await auth.attemptNonInteractiveAuthentication();
    migrations.migrate();
    addLiveReloadIfDevMode();
    resetController.listenForReset();  
    auth.startPeriodicallyReauthenticating();

    // Unload any content scripts before we close
    window.onbeforeunload = e =>  contentScripts.destroy();   
}


init();