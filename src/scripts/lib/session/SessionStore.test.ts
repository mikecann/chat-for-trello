import { SessionStore } from "./SessionStore";
import { nullLogger, mockAuthStore, mockIapStore } from "../test/commonMocks";

let store: SessionStore;

beforeEach(() => {
    store = new SessionStore(nullLogger, mockAuthStore, mockIapStore);
    jest.clearAllMocks();
});

it("starting a session authenticates and loads", async () => {
    await store.startSession();
    expect(mockAuthStore.authenticate.mock.calls.length).toBe(1);
    expect(mockIapStore.load.mock.calls.length).toBe(1);
});

it("signs out the user and clears iaps when ending session", async () => {
    await store.endSession();
    expect(mockAuthStore.signout.mock.calls.length).toBe(1);
    expect(mockIapStore.clear.mock.calls.length).toBe(1);
});
