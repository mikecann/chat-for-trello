import { observable, action,toJS, computed } from 'mobx';
import { IPersistanceService } from '../services/IPersistanceService';
import { ILogger } from 'mikeysee-helpers';
import { Persister } from '../helpers/Persister';
import { ResetController } from '../controllers/ResetController';
import { isDevMode } from '../helpers/utils';
import { ChatWindowOrder } from './ChatWindowOrder';

export type AppSettings = typeof appSettingDefaults;

export const appSettingDefaults = {
    autoScrollChatWindow: true,
    logLevel: isDevMode ? "debug" : "info",
    lastMigratedVersion: "",
    maxChatEntries: 100,
    chatWindowOrder: ChatWindowOrder.InfrontOfCards
}

export const persistanceKey = `AppSettings-v2.2.0`;

export class AppSettingsModel
{
    @observable settings: AppSettings = {...appSettingDefaults};

    private persister: Persister<AppSettings>;

    constructor(
        private persistance: IPersistanceService, 
        private logger: ILogger,
        private resetController: ResetController
    ) {        
    }

    @action async init() {
        this.persister = new Persister<AppSettings>(this.persistance, persistanceKey);
        await this.persister.depersist(appSettingDefaults, (v) => this.depersist(v));
        this.persister.watchForChanges((v) => this.depersist(v));
    }

    @action private depersist(data: AppSettings) {
        this.settings = {...appSettingDefaults, ...data};
        this.logger.debug("AppSettings settings depersisted", data);
    }

    persist() {
        return this.persister.persist(toJS(this.settings));
    }

    async reset() {
        this.logger.debug("AppSettingsModel resetting all saved data..");
        this.persister.dispose();
        await this.persistance.clear();
        this.resetController.sendReset();
    }

    dispose() {
        this.persister.dispose();
    }

    @computed get isDirty() {
        var now = JSON.stringify(toJS(this.settings));
        var last = JSON.stringify(this.persister.lastPersistanceData);
        var areDifferent = now != last;
        return areDifferent;
    }
}