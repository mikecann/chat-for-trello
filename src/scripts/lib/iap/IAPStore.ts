import { observable, action, runInAction, computed } from "mobx";
import { IPersistable } from "../persistance/IPersistable";
import { ILogger } from "../logging/types";
import { GoogleCloudServices } from "../chrome/GoogleCloudServices";

type JsonProps = {
    iaps: GoogleIAPProduct[];
    purchases: GoogleIAPPurchase[];
};

export class IAPStore implements IPersistable<JsonProps> {
    @observable iaps: GoogleIAPProduct[] = [];

    @observable purchases: GoogleIAPPurchase[] = [];

    @observable isLoading = false;

    constructor(private logger: ILogger, private cloudServices: GoogleCloudServices) {}

    async load() {
        runInAction(() => (this.isLoading = true));
        await this.loadIAPs();
        await this.loadPurchases();
        runInAction(() => (this.isLoading = false));
    }

    @action
    private async loadIAPs() {
        this.logger.debug("IAPStore loading IAPs..");
        const iapDetails = await this.cloudServices.getSkuDetails();
        this.logger.debug("IAPStore loaded IAPS.", iapDetails);
        runInAction(() => (this.iaps = iapDetails.inAppProducts));
    }

    @action
    private async loadPurchases() {
        this.logger.debug("IAPStore loading purchases..");
        var purchases = await this.cloudServices.getPurchases();
        this.logger.debug("IAPStore loaded purchases", purchases);
        runInAction(() => (this.purchases = purchases));
    }

    @action
    async purchase(iapId: string) {
        if (!this.iaps)
            throw new Error(`IAPStore cannot purchase '${iapId}', iap list has not yet loaded.`);

        this.logger.debug(`IAPStore purchasing iap '${iapId}' ..`);
        var resp = await this.cloudServices.buy(iapId);
        this.logger.debug("IAPStore purchase complete.", resp);

        // Now refresh the purchases
        const purchases = await this.loadPurchases();
    }

    @action
    clear() {
        this.purchases = [];
        this.iaps = [];
    }

    @computed
    get asJson(): JsonProps {
        return {
            iaps: this.iaps,
            purchases: this.purchases
        };
    }

    fromJson(json: JsonProps) {
        this.iaps = json.iaps;
        this.purchases = json.purchases;
    }
}
