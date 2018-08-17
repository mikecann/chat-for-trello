import { AuthStore } from "./AuthStore";
import { nullLogger, mockChromeService, mockCloudService } from "../test/commonMocks";

let store: AuthStore;

beforeEach(() => {
    store = new AuthStore(nullLogger, mockChromeService, mockCloudService);
    jest.clearAllMocks();
});

it("is authenticated when userInfo is set", () => {
    expect(store.isAuthenticated).toBe(false);
    store.userInfo = {} as any;
    expect(store.isAuthenticated).toBe(true);
});

describe("authenticate", () => {
    it("sets the token and user info if auth is a success", async () => {
        const token = "aaa";
        const user = { name: "dave" };
        mockChromeService.getAuthToken.mockResolvedValue(token);
        mockCloudService.getUserInfo.mockReturnValue(user);
        await store.authenticate();
        expect(store.token).toEqual(token);
        expect(store.userInfo).toEqual(user);
    });

    it("passes the interractive flag to the chrome service", async () => {
        await store.authenticate(true);
        expect(mockChromeService.getAuthToken.mock.calls[0][0]).toEqual({ interactive: true });
        await store.authenticate(false);
        expect(mockChromeService.getAuthToken.mock.calls[1][0]).toEqual({ interactive: false });
    });
});

it("clears the props on signout", () => {
    store.userInfo = {} as any;
    store.token = "aaa";
    store.signout();
    expect(store.userInfo).toBeUndefined();
    expect(store.token).toBeUndefined();
});
