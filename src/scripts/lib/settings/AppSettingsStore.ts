import { observable, toJS, computed, action } from "mobx";
import { IPersistable } from "../persistance/IPersistable";
import { ILogger } from "../logging/types";

export class AppSettingsStore<T extends object> implements IPersistable<T> {
    @observable settings: T;

    @observable private commitableSettings: T;

    constructor(private logger: ILogger, private defaultSettings: T) {
        this.settings = Object.assign({}, this.defaultSettings);
        this.commitableSettings = Object.assign({}, this.defaultSettings);
    }

    @computed
    get asJson(): T {
        return this.commitableSettings;
    }

    @action
    commit() {
        const settings = toJS(this.settings);
        this.logger.debug("AppSettingsStore", "Commiting settings", settings);
        this.commitableSettings = Object.assign({}, settings);
    }

    @action
    update(settings: Partial<T>) {
        this.logger.debug("AppSettingsStore", "Updating settings", settings);
        this.settings = Object.assign(toJS(this.settings), settings);
    }

    @action
    reset() {
        this.logger.debug("AppSettingsStore", "Resetting settings", this.defaultSettings);
        this.settings = Object.assign({}, this.defaultSettings);
        this.commitableSettings = Object.assign({}, this.defaultSettings);
    }

    @action
    fromJson(json: T) {
        this.settings = Object.assign({}, json);
        this.commitableSettings = Object.assign({}, json);
    }

    @computed
    get isDirty() {
        var settings = JSON.stringify(toJS(this.settings));
        var commitable = JSON.stringify(toJS(this.commitableSettings));
        return settings != commitable;
    }
}
