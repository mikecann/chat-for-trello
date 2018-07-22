import { action, observable, autorun, IReactionDisposer, toJS, runInAction } from "mobx";
import { IPersistanceService } from "../../services/IPersistanceService";
import { ILogger } from "mikeysee-helpers";
import { WindowDimensions } from "./WindowDimensions";

export type BoardSettings = typeof defaultSettings;

const defaultSettings = {
    isEnabled: false,
    isChatWindowMinimised: false,
    chatWindowDimensions: {
        width: 300,
        height: 300,
        x: 0,
        y: -300
    }
};

export class BoardSettingsStore {
    @observable settings: BoardSettings = { ...defaultSettings };

    private autorunDisposer: IReactionDisposer;

    constructor(
        private boardId: string,
        private persistance: IPersistanceService,
        private logger: ILogger
    ) {}

    @action
    async init() {
        this.beginPersistingChanges();
        var settings = await this.persistance.load(this.persistanceKey, defaultSettings);
        this.logger.debug("Board settings depersisted", settings);
        runInAction(() => (this.settings = { ...defaultSettings, ...settings }));
    }

    @action
    toggleEnabled() {
        this.settings.isEnabled = !this.settings.isEnabled;
        if (this.settings.isEnabled) {
            this.settings.isChatWindowMinimised = defaultSettings.isChatWindowMinimised;
            this.settings.chatWindowDimensions = defaultSettings.chatWindowDimensions;
        }
    }

    @action
    toggleChatWindowMinimised() {
        this.settings.isChatWindowMinimised = !this.settings.isChatWindowMinimised;
    }

    private get persistanceKey() {
        return `BoardSettings-${this.boardId}`;
    }

    private beginPersistingChanges() {
        this.autorunDisposer = autorun(() => {
            this.persistance.save(this.persistanceKey, toJS(this.settings));
        });
    }

    @action
    setChatWindowDimensions(dimensions: WindowDimensions) {
        this.settings.chatWindowDimensions = dimensions;
    }

    dispose() {
        if (this.autorunDisposer) this.autorunDisposer();
    }
}
