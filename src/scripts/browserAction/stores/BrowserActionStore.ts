import { observable, runInAction } from "mobx";
import { ChromeService } from "../../lib/chrome/ChromeService";

export class BrowserActionStore {
    @observable appVersion: string = "";

    constructor(chromeService: ChromeService) {
        this.appVersion = chromeService.appVersion;
    }
}
