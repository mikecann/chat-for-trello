import { IPersistanceService, WatchDisposer } from "../services/IPersistanceService";
import { autorun, IReactionDisposer, observable } from "mobx";

export class Persister<T> {
    @observable lastPersistanceData?: T;

    private watchDisposer: WatchDisposer;
    private autorunDisposer: IReactionDisposer;

    constructor(private service: IPersistanceService, private key: string) {}

    async depersist(defaultValue: T, callback?: (value: T) => void) {
        var data = await this.service.load(this.key, defaultValue);
        this.lastPersistanceData = data;
        if (callback) callback(data);
        return data;
    }

    watchForChanges(callback: (value: T) => void) {
        if (this.watchDisposer) throw new Error("Cannot watch more than once!");

        this.watchDisposer = this.service.watch<T>(this.key, value => {
            this.lastPersistanceData = value;
            callback(value);
        });
    }

    async persist(value: T) {
        await this.service.save(this.key, value);
    }

    beginPersistingChanges(callback: () => T) {
        if (this.autorunDisposer) throw new Error("Cannot beginPersistingChanges more than once!");

        this.autorunDisposer = autorun(() => {
            const data = callback();
            this.service.save(this.key, data);
        });
    }

    dispose() {
        if (this.watchDisposer) this.watchDisposer();

        if (this.autorunDisposer) this.autorunDisposer();
    }
}
