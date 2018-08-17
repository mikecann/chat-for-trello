import { ILogger } from "mikeysee-helpers";
import { AppSettings, AppSettingsModel } from "../../models/AppSettingsModel";
import { runInAction, toJS } from "mobx";
import { ChromeService } from "../../services/ChromeService";
import { IPersistanceService } from "../../lib/persistance/IPersistanceService";

export class MigrationsController {
    constructor(
        private logger: ILogger,
        private appSettings: AppSettingsModel,
        private chromeService: ChromeService,
        private persistance: IPersistanceService
    ) {}

    async preMigrate() {
        const appSettings = await this.persistance.load<AppSettings>("AppSettings-v2.2.0");
        if (!appSettings) return;
        this.logger.debug(
            "MigrationsController",
            "Migrating user from pre 2.6.0 version of the app",
            appSettings
        );
        this.appSettings.fromJson(appSettings);
        await this.persistance.remove("AppSettings-v2.2.0");
    }

    migrate() {
        const settings = this.appSettings.settings;
        this.migrateVersion(settings.lastMigratedVersion, this.chromeService.appVersion);
        runInAction(() => (settings.lastMigratedVersion = this.chromeService.appVersion));
        this.appSettings.persist();
    }

    private migrateVersion(fromVersion: string, toVersion: string) {
        this.logger.debug("Migrating user", { fromVersion, toVersion });
        if (!fromVersion) this.onNewInstall();
    }

    private async onNewInstall() {
        this.logger.debug("User hasnt seen the installed popup yet. Showing it now.");
        chrome.tabs.create({ url: "installed.html" });
    }
}
