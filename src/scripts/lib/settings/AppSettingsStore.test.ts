import { AppSettingsStore } from "./AppSettingsStore";
import { nullLogger } from "../test/commonMocks";

type Settings = {
    a: string;
    b: number;
};

const defaultSettings: Settings = {
    a: "aaa",
    b: 123
};

let store: AppSettingsStore<Settings>;

beforeEach(() => {
    store = new AppSettingsStore<Settings>(nullLogger, defaultSettings);
});

describe("constructor", () => {
    it("sets the default settings", () => {
        expect(store.settings).toEqual(defaultSettings);
    });
});

describe("isDirty", () => {
    it("should not be dirty when constructed", () => {
        expect(store.isDirty).toEqual(false);
    });

    it("should be dirty is a prop is changed", () => {
        store.update({ a: "bbb" });
        expect(store.isDirty).toEqual(true);
        store.update({ a: "aaa" });
        expect(store.isDirty).toEqual(false);
    });

    it("is no longer dirty when committed", () => {
        store.update({ a: "bbb" });
        expect(store.isDirty).toEqual(true);
        const settings = {
            a: "bob",
            b: 999
        };
        store.fromJson(settings);
        expect(store.isDirty).toEqual(false);
    });

    it("is not dirty after fromJson is applied", () => {
        store.update({ a: "bbb" });
        expect(store.isDirty).toEqual(true);
        store.commit();
        expect(store.isDirty).toEqual(false);
    });
});

describe("asJson", () => {
    it("should only return committed settings", () => {
        expect(store.asJson).toEqual(defaultSettings);
        store.update({ a: "bbb" });
        expect(store.asJson).toEqual(defaultSettings);
        store.commit();
        expect(store.asJson).toEqual({ a: "bbb", b: defaultSettings.b });
    });
});

describe("fromJson", () => {
    it("should update the settings and should not be dirty", () => {
        const settings = {
            a: "bob",
            b: 999
        };
        store.fromJson(settings);
        expect(store.settings).toEqual(settings);
    });
});

describe("reset", () => {
    it("should reset any changes back to default", () => {
        expect(store.asJson).toEqual({ a: "aaa", b: 123 });
        store.update({ a: "bbb" });
        store.commit();
        expect(store.asJson).toEqual({ a: "bbb", b: 123 });
        store.reset();
        expect(store.asJson).toEqual({ a: "aaa", b: 123 });
    });
});
