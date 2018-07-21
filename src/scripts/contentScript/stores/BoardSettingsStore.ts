import { action, observable, autorun, IReactionDisposer, toJS, runInAction } from 'mobx';
import { IPersistanceService } from '../../services/IPersistanceService';
import { ILogger } from 'mikeysee-helpers';
import { WindowDimensions } from './WindowDimensions';

interface BoardSettingsModelPersistanceData {
    isEnabled: boolean,
    chatWindowDimensions: WindowDimensions,
    isChatWindowMinimised: boolean,
}

const defaultPersistanceValues: BoardSettingsModelPersistanceData = {
    isEnabled: false,
    isChatWindowMinimised: false,
    chatWindowDimensions: {
        width: 300,
        height: 300,
        x: 0,
        y: -300
    }
}

export class BoardSettingsStore {

    @observable isEnabled: boolean = false;
    @observable chatWindowDimensions: WindowDimensions;
    @observable isChatWindowMinimised: boolean = false;

    private autorunDisposer: IReactionDisposer;

    constructor(private boardId: string, private persistance: IPersistanceService, private logger: ILogger) {
    }

    @action async init() {
        this.beginPersistingChanges();
        var data = await this.persistance.load(this.persistanceKey, defaultPersistanceValues);
        this.logger.debug("Board settings depersisted", data);
        runInAction(() => {
            this.isEnabled = data.isEnabled == true;
            this.chatWindowDimensions = data.chatWindowDimensions || defaultPersistanceValues.chatWindowDimensions;
            this.isChatWindowMinimised = data.isChatWindowMinimised == true;
        });        
    }

    @action toggleEnabled() {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            this.isChatWindowMinimised = defaultPersistanceValues.isChatWindowMinimised;
            this.chatWindowDimensions = defaultPersistanceValues.chatWindowDimensions;
        }
    }

    @action toggleChatWindowMinimised() {
        this.isChatWindowMinimised = !this.isChatWindowMinimised;
    }

    private get persistanceKey() {
        return `BoardSettings-${this.boardId}`;
    }

    private beginPersistingChanges() {
        this.autorunDisposer = autorun(() => {
            const data: BoardSettingsModelPersistanceData = {
                isEnabled: toJS(this.isEnabled),
                chatWindowDimensions: toJS(this.chatWindowDimensions),
                isChatWindowMinimised: toJS(this.isChatWindowMinimised)
            }
            this.persistance.save(this.persistanceKey, data);
        })
    }

    @action setChatWindowDimensions(dimensions: WindowDimensions) {
        this.chatWindowDimensions = dimensions;
    }

    dispose() {
        if (this.autorunDisposer)
            this.autorunDisposer();
    }
   
}