import { ILogger } from "mikeysee-helpers";
import { AppSettings, AppSettingsModel } from "../../models/AppSettingsModel";
import { runInAction, toJS } from "mobx";




import { ChromeService } from "../../services/ChromeService";

export class MigrationsController {
    constructor(
        private logger: ILogger,
        private appSettings: AppSettingsModel,
        private chromeService: ChromeService
    ) {}

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
