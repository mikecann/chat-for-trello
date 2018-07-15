import { action, observable, autorun, IReactionDisposer, toJS, runInAction } from 'mobx';
import { IPersistanceService } from '../../services/IPersistanceService';
import { ILogger } from 'mikeysee-helpers';

interface BoardSettingsModelPersistanceData {
    isEnabled: boolean
}

const defaultPersistanceValues: BoardSettingsModelPersistanceData = {
    isEnabled: false
}

export class BoardSettingsModel {

    @observable isEnabled = false;
    private autorunDisposer: IReactionDisposer;

    constructor(private boardId: string, private persistance: IPersistanceService, private logger: ILogger) {
    }

    @action async init() {
        this.beginPersistingChanges();
        var data = await this.persistance.load(this.persistanceKey, defaultPersistanceValues);
        this.logger.debug("Board settings depersisted", data);
        runInAction(() => {
            this.isEnabled = data.isEnabled;
        });        
    }

    @action toggleEnabled() {
        this.isEnabled = !this.isEnabled;
    }

    private get persistanceKey() {
        return `BoardSettings-${this.boardId}`;
    }

    private beginPersistingChanges() {
        this.autorunDisposer = autorun(() => {
            const data: BoardSettingsModelPersistanceData = {
                isEnabled: toJS(this.isEnabled)                
            }
            this.persistance.save(this.persistanceKey, data);
        })
    }

    dispose() {
        if (this.autorunDisposer)
            this.autorunDisposer();
    }
   
}