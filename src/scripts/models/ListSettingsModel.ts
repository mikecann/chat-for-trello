import { action, observable, autorun, IReactionDisposer, toJS, runInAction } from 'mobx';
import { ILogger } from 'mikeysee-helpers';
import { IPersistanceService } from '../services/IPersistanceService';
import { AppSettingsModel } from './AppSettingsModel';

export interface ListSettings {
    isEnabled: boolean,
    cardCompletedAction: CardCompletedActionValues
}

export const defaultListSettings: ListSettings = {
    isEnabled: true,
    cardCompletedAction: "nothing"
}

export type CardCompletedActionValues = "nothing" | "archive" | "send-to-top" | "send-to-bottom";

export class ListSettingsModel {

    @observable settings: ListSettings = {...defaultListSettings};

    private autorunDisposer: IReactionDisposer;

    constructor(
        private listId: string, 
        private persistance: IPersistanceService,
        private appSettings: AppSettingsModel,
        private logger: ILogger) {
    }

    @action async init() {
        this.beginPersistingChanges();
        var data = await this.persistance.load(this.persistanceKey, toJS(this.appSettings.settings.listDefaults));
        this.logger.debug("List settings depersisted", data);
        runInAction(() => this.settings = data);        
    }
   
    private get persistanceKey() {
        return `ListSettings-${this.listId}`;
    }

    private beginPersistingChanges() {
        this.autorunDisposer = autorun(() => {
            console.log("LIST SETTINGS CHANGED PERSISTING");
            this.persistance.save(this.persistanceKey, toJS(this.settings));
        })
    }

    dispose() {
        if (this.autorunDisposer)
            this.autorunDisposer();
    }
   
}