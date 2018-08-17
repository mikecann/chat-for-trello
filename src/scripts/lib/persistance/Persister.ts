import { autorun, IReactionDisposer, observable } from "mobx";
import { WatchDisposer, IPersistanceService } from "./IPersistanceService";

export class Persister<T> {
    private watchDisposer: WatchDisposer;
    private autorunDisposer: IReactionDisposer;

    constructor(private service: IPersistanceService, private key: string) {}

    async depersist(defaultValue: T, dataReciever?: (value: T) => void) {
        var data = await this.service.load(this.key, defaultValue);
        if (dataReciever) dataReciever(data);
        return data;
    }

    watchForChanges(dataReciever: (value: T) => void) {
        if (this.watchDisposer) throw new Error("Cannot watch more than once!");

        this.watchDisposer = this.service.watch<T>(this.key, value => {
            dataReciever(value);
        });
    }

    async persist(value: T) {
        await this.service.save(this.key, value);
    }

    beginPersistingChanges(dataProvider: () => T) {
        if (this.autorunDisposer) throw new Error("Cannot beginPersistingChanges more than once!");

        this.autorunDisposer = autorun(() => {
            const data = dataProvider();
            this.service.save(this.key, data);
        });
    }

    dispose() {
        if (this.watchDisposer) this.watchDisposer();

        if (this.autorunDisposer) this.autorunDisposer();
    }
}
