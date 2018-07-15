import { observable, runInAction } from 'mobx';
import { ChromeService } from '../../services/ChromeService';
import { UpdatesLoader, Update } from '../../helpers/UpdatesLoader';

export class BrowserActionModel
{
    @observable appVersion: string = "";
    @observable updates: Update[] = [];

    constructor(chromeService: ChromeService) {
        this.appVersion = chromeService.appVersion;
    }

    async init(updatesLoader: UpdatesLoader) {
        const updates = await updatesLoader.load();
        runInAction(() => this.updates = updates);
    }
} 