import { runInAction, toJS } from "mobx";
import { IPersistanceService } from "../../lib/persistance/IPersistanceService";
import { AppSettingsStore } from "../../lib/settings/AppSettingsStore";
import { AppSettings } from "../../common/config";
import { ChromeService } from "../../lib/chrome/ChromeService";
import { ILogger } from "../../lib/logging/types";

export class MigrationsController {
    constructor(
        private logger: ILogger,
        private appSettings: AppSettingsStore<AppSettings>,
        private chromeService: ChromeService,
        private persistance: IPersistanceService
    ) {}

    async preMigrate() {
        const appSettings = await this.persistance.load<AppSettings>("AppSettings-v2.0.0");
        if (!appSettings || Object.keys(appSettings).length == 0) return;
        this.logger.debug(
            "MigrationsController",
            "Migrating user from pre 2.2.0 version of the app",
            appSettings
        );
        this.appSettings.fromJson(appSettings);
        await this.persistance.remove("AppSettings-v0.0.0");
    }

    migrate() {
        const settings = this.appSettings.settings;
        this.migrateVersion(settings.lastMigratedVersion, this.chromeService.appVersion);
        runInAction(() => (settings.lastMigratedVersion = this.chromeService.appVersion));
        this.appSettings.commit();
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
