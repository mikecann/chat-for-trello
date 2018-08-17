import { IAPStore } from "./IAPStore";
import { nullLogger, mockCloudService } from "../test/commonMocks";

let store: IAPStore;

beforeEach(() => {
    store = new IAPStore(nullLogger, mockCloudService);
    jest.clearAllMocks();
});

it("loads iaps and prurchases", async () => {
    const iaps = [{}];
    const purchases = [{}];
    mockCloudService.getPurchases.mockResolvedValue(purchases);
    mockCloudService.getSkuDetails.mockResolvedValue({ inAppProducts: purchases });
    await store.load();
    expect(store.iaps!.length).toBe(1);
    expect(store.purchases!.length).toBe(1);
});

it("purchases a product then reloads the purchases", async () => {
    const purchases = [{}];
    mockCloudService.getSkuDetails.mockResolvedValue({ inAppProducts: purchases });
    await store.purchase("aaa");
    expect(mockCloudService.buy.mock.calls[0][0]).toBe("aaa");
    expect(store.purchases!.length).toBe(1);
});

it("resets the iaps and purchases when cleared", () => {
    store.iaps = [{}] as any;
    store.purchases = [{}] as any;
    store.clear();
    expect(store.iaps.length).toBe(0);
    expect(store.purchases.length).toBe(0);
});
