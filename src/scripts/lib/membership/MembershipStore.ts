import { computed, action, runInAction } from "mobx";
import { IAPStore } from "../iap/IAPStore";

export const millisecondsInADay = 1000 * 60 * 60 * 24;

export const defaultOptions = {
    premiumMembershipSelector: (purchase: GoogleIAPPurchase) => false,
    trialPeriodDays: 30,
    nowProvider: () => Date.now()
};

export type Options = typeof defaultOptions;

export class MembershipStore {
    options: Options;

    constructor(private iaps: IAPStore, options?: Partial<Options>) {
        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    @computed
    get premiumMembershipPurchase(): GoogleIAPPurchase | undefined {
        return this.iaps.purchases.find(this.options.premiumMembershipSelector);
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
    get daysSinceLicenseIssued(): number {
        return this.premiumMembershipPurchase == undefined
            ? 0
            : Math.floor(
                  (this.options.nowProvider() -
                      parseInt(this.premiumMembershipPurchase.createdTime)) /
                      millisecondsInADay
              );
    }

    @computed
    get daysRemainingOnFreeTrial(): number {
        return this.premiumMembershipPurchase == undefined
            ? 0
            : this.options.trialPeriodDays - this.daysSinceLicenseIssued;
    }
}
