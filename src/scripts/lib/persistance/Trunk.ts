import { computed, toJS, reaction, IReactionDisposer, action } from "mobx";
import { IPersistable } from "./IPersistable";
import { ChromePersistanceService } from "./ChromePersistanceService";

type Persistables = {
    [key: string]: IPersistable<any>;
};

export class Trunk {
    private disposer: IReactionDisposer;
    private canPersist = true;

    constructor(
        private persistables: Persistables,
        private persistance: ChromePersistanceService,
        private persistanceKey = "Trunk"
    ) {}

    async init() {
        await this.depersist();
        this.persistTunkChanges();
        this.watchForPersistanceChanges();
    }

    private watchForPersistanceChanges() {
        this.persistance.watch(this.persistanceKey, json => {
            this.canPersist = false;
            this.fromJson(json);
            this.canPersist = true;
        });
    }

    private persistTunkChanges() {
        this.disposer = reaction(
            () => this.asJson,
            json => {
                if (this.canPersist) this.persistance.save(this.persistanceKey, json);
            }
        );
    }

    private async depersist() {
        this.fromJson(await this.persistance.load(this.persistanceKey, toJS(this.asJson)));
    }

    @computed
    private get asJson() {
        let o = {};
        for (var key in this.persistables) o[key] = this.persistables[key].asJson;
        return o;
    }

    @action
    private fromJson(trunk: any) {
        for (var key in trunk) {
            const persistble = this.persistables[key];
            if (!persistble) continue;
            persistble.fromJson(trunk[key]);
        }
    }

    dispose() {
        if (this.disposer) this.disposer();
    }
}
