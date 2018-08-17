import { MembershipStore, millisecondsInADay, Options } from "./MembershipStore";
import { mockIapStore } from "../test/commonMocks";

let store: MembershipStore;

beforeEach(() => {
    store = new MembershipStore(mockIapStore);
    jest.clearAllMocks();
});

describe("premiumMembershipPurchase", () => {
    it("uses the selector to select the premium purchase", () => {
        store = new MembershipStore(mockIapStore, {
            premiumMembershipSelector: p => p.itemId == "bbb"
        });
        mockIapStore.purchases = [{ itemId: "aaa" }, { itemId: "bbb" }, { itemId: "ccc" }] as any;
        expect(store.premiumMembershipPurchase!.itemId).toBe("bbb");
    });

    it("returns undefined when there are no purchases", () => {
        store = new MembershipStore(mockIapStore, {
            premiumMembershipSelector: p => p.itemId == "bbb"
        });
        mockIapStore.purchases = [] as any;
        expect(store.premiumMembershipPurchase).toBeUndefined();
    });
});

describe("daysSinceLicenseIssued", () => {
    it("returns 0 when no purchase set", () => {
        expect(store.daysSinceLicenseIssued).toBe(0);
    });

    it("performs the correct calculation", () => {
        store = new MembershipStore(mockIapStore, {
            premiumMembershipSelector: p => true,
            nowProvider: () => millisecondsInADay * 60
        });
        mockIapStore.purchases = [
            {
                createdTime: millisecondsInADay * 5 + ""
            }
        ] as any;

        store = new MembershipStore(mockIapStore, {
            premiumMembershipSelector: p => true,
            nowProvider: () => millisecondsInADay * 100
        });
        mockIapStore.purchases = [
            {
                createdTime: millisecondsInADay * 500 + ""
            }
        ] as any;

        expect(store.daysSinceLicenseIssued).toBe(-400);
    });
});

describe("daysRemainingOnFreeTrial", () => {
    it("calculates days remaining correctly", () => {
        setupSoDaysSinceLicenseIssuedIs(23, {
            trialPeriodDays: 30
        });
        expect(store.daysRemainingOnFreeTrial).toBe(7);

        setupSoDaysSinceLicenseIssuedIs(23, {
            trialPeriodDays: 50
        });
        expect(store.daysRemainingOnFreeTrial).toBe(27);
    });
});

describe("userHasPremiumAccess", () => {
    it("is false when there is no active purchase", () => {
        expect(store.userHasPremiumAccess).toBe(false);
    });

    it("is true when the purchase's state is ACTIVE", () => {
        store = new MembershipStore(mockIapStore, {
            premiumMembershipSelector: p => true
        });
        mockIapStore.purchases = [
            {
                state: "ACTIVE"
            }
        ] as any;

        expect(store.userHasPremiumAccess).toBe(true);
        mockIapStore.purchases[0].state = "DAVE";
        expect(store.userHasPremiumAccess).toBe(false);
    });
});

function setupSoDaysSinceLicenseIssuedIs(days: number, options: Partial<Options> = {}) {
    store = new MembershipStore(mockIapStore, {
        premiumMembershipSelector: p => true,
        nowProvider: () => millisecondsInADay * days,
        ...options
    });
    mockIapStore.purchases = [
        {
            createdTime: "0"
        }
    ] as any;
}
