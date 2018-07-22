import { action, observable, runInAction, toJS, autorun, IReactionDisposer, computed } from "mobx";
import { ChromeService } from "../services/ChromeService";
import { ILogger } from "mikeysee-helpers";
import { IPersistanceService } from "../services/IPersistanceService";
import { GoogleCloudServices, UserInfo, UserLiscence } from "../services/GoogleCloudServices";
import { BackgroundPage } from "../background/background";
import { Persister } from "../helpers/Persister";

interface AuthModelData {
    token?: string;
    userInfo?: UserInfo;
    purchases: GoogleIAPPurchase[];
}

export const TRIAL_PERIOD_DAYS = -1;

export class AuthModel {
    @observable isLoading = false;
    @observable token?: string;
    @observable userInfo?: UserInfo;
    @observable iaps?: GoogleIAPProduct[];
    @observable purchases: GoogleIAPPurchase[] = [];

    persister: Persister<AuthModelData>;

    constructor(persistance: IPersistanceService) {
        this.persister = new Persister<AuthModelData>(persistance, `AuthModel`);
    }

    @computed
    get premiumMembershipPurchase(): GoogleIAPPurchase | undefined {
        return this.purchases.find(p => p.sku == "premiummembership");
    }

    @computed
    get isOnFreeTrial(): boolean {
        return this.premiumMembershipPurchase != undefined && this.daysRemainingOnFreeTrial > 0;
    }

    @computed
    get userHasPremiumAccess(): boolean {
        return (
            this.premiumMembershipPurchase != undefined &&
            this.premiumMembershipPurchase.state == "ACTIVE"
        );
    }

    @computed
    get isAuthenticated(): boolean {
        return this.userInfo != undefined;
    }

    @computed
    get daysSinceLicenseIssued(): number {
        return this.premiumMembershipPurchase == undefined
            ? 0
            : Math.floor(
                  (Date.now() - parseInt(this.premiumMembershipPurchase.createdTime)) /
                      1000 /
                      60 /
                      60 /
                      24
              );
    }

    @computed
    get daysRemainingOnFreeTrial(): number {
        return this.premiumMembershipPurchase == undefined
            ? 0
            : TRIAL_PERIOD_DAYS - this.daysSinceLicenseIssued;
    }

    protected getPersistData = (): AuthModelData => {
        return {
            token: toJS(this.token),
            userInfo: toJS(this.userInfo),
            purchases: toJS(this.purchases)
        };
    };

    protected depersist = (data: AuthModelData) => {
        this.token = data.token;
        this.userInfo = data.userInfo;
        this.purchases = data.purchases;
    };
}

export class BackgroundAuthModel extends AuthModel {
    constructor(
        persistance: IPersistanceService,
        private chromeService: ChromeService,
        private logger: ILogger,
        private cloudServices: GoogleCloudServices
    ) {
        super(persistance);
    }

    init() {
        this.persister.beginPersistingChanges(this.getPersistData);
    }

    async attemptNonInteractiveAuthentication() {
        try {
            await this.authenticate(false);
        } catch (e) {
            this.logger.warn(
                "BackgroundAuthModel could not authenticate non-interractively, the user will have to auth manually",
                e
            );
            runInAction(() => (this.isLoading = false));
        }
    }

    @action
    async authenticate(interactive = true) {
        try {
            if (this.isLoading) throw new Error("Cannot start auth more than once");

            this.logger.debug(
                "AuthModel attempting to authenticate to get auth token from chrome.."
            );

            this.isLoading = true;

            var token = await this.chromeService.getAuthToken({ interactive });
            this.logger.debug("AuthModel token loaded. Getting user info..", {
                token
            });
            var userInfo = await this.cloudServices.getUserInfo(token);
            this.logger.debug("AuthModel userinfo loaded. Getting iaps..", userInfo);
            //var license = await this.cloudServices.getLicense(token);
            //this.logger.debug("AuthModel license loaded. All ready", license);
            const iapDetails = await this.cloudServices.getSkuDetails();
            this.logger.debug("AuthModel found the following IAPs available: ", iapDetails);
            var purchases = await this.cloudServices.getPurchases();
            this.logger.debug("AuthModel found the user has these purchases", purchases);

            runInAction(() => {
                this.isLoading = false;
                this.token = token;
                this.userInfo = userInfo;
                this.iaps = iapDetails.inAppProducts;
                this.purchases = purchases;
            });
        } catch (error) {
            runInAction(() => (this.isLoading = false));
            throw error;
        }
    }

    startPeriodicallyReauthenticating(intervalMs = 3600000) {
        setInterval(() => this.authenticate(false), intervalMs);
    }

    async updatePurchases() {}

    @action
    async purchasePremiumMembership() {
        if (!this.iaps)
            throw new Error("AuthModel cannot buy premium membership when no IAPs have been set");

        this.logger.debug("BackgroundAuthModel beginning purchase flow..");
        var resp = await this.cloudServices.buy(this.iaps[0].sku);
        this.logger.debug(
            "BackgroundAuthModel google purchase returned, refreshing purchases..",
            resp
        );
        const purchases = await this.cloudServices.getPurchases();
        this.logger.debug("AuthModel refreshed purchases", purchases);
        runInAction(() => (this.purchases = purchases));
    }

    @action
    debugAwardPremium() {
        this.logger.debug("BackgroundAuthModel debug awarding user premium membership..");
        // this.license = {
        //     kind: "debug-premium",
        //     itemId: "abc123",
        //     result: true,
        //     accessLevel: "FULL",
        //     maxAgeSecs: "2",
        //     createdTime: Date.now() + ""
        // }
    }

    @action
    logout() {
        this.logger.debug("BackgroundAuthModel logging user out..");
        this.isLoading = false;
        this.token = undefined;
        this.userInfo = undefined;
        this.purchases = [];
    }
}

export class PageAuthModel extends AuthModel {
    @observable error?: string;

    constructor(persistance: IPersistanceService, private background: BackgroundPage) {
        super(persistance);
    }

    async init() {
        await this.persister.depersist({ purchases: [] }, this.depersist);
        this.persister.watchForChanges(this.depersist);
    }

    async authenticate() {
        await this.runAsyncAndCatchErrors(() => this.background.auth.authenticate());
    }

    async purchasePremiumMembership() {
        await this.runAsyncAndCatchErrors(() => this.background.auth.purchasePremiumMembership());
    }

    debugAwardPremium() {
        this.background.auth.debugAwardPremium();
    }

    logout() {
        this.background.auth.logout();
    }

    private async runAsyncAndCatchErrors(func: () => Promise<any>) {
        try {
            runInAction(() => (this.isLoading = true));
            await func();
        } catch (error) {
            if (error.stack != undefined) runInAction(() => (this.error = error.stack + ""));
            else runInAction(() => (this.error = error + ""));
        } finally {
            runInAction(() => (this.isLoading = false));
        }
    }
}

export class ContentScriptAuthModel extends AuthModel {
    constructor(persistance: IPersistanceService) {
        super(persistance);
    }

    async init() {
        await this.persister.depersist({ purchases: [] }, this.depersist);
        this.persister.watchForChanges(this.depersist);
    }
}
