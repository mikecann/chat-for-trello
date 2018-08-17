import { observable, runInAction } from "mobx";
import { UpdatesLoader, Update } from "./UpdatesLoader";

export class UpdatesStore {
    @observable updates: Update[] = [];

    async loadUpdates(updatesLoader: UpdatesLoader) {
        const updates = await updatesLoader.load();
        runInAction(() => (this.updates = updates));
    }
}
