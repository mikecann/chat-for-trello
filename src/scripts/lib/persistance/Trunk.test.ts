import { Trunk } from "./Trunk";
import { observable, computed, configure, runInAction } from "mobx";
import { IPersistable } from "./IPersistable";
import { mockPersistance } from "../test/commonMocks";

configure({ enforceActions: true });

type FooJson = {
    a: string;
};

class Foo implements IPersistable<FooJson> {
    @observable a = "aaa";

    @computed
    get asJson(): FooJson {
        return {
            a: this.a
        };
    }

    fromJson(json: FooJson) {
        this.a = json.a;
    }
}

let foo: Foo;
let trunk: Trunk;

beforeEach(() => {
    jest.clearAllMocks();

    foo = new Foo();

    trunk = new Trunk(
        {
            foo
        },
        mockPersistance,
        "test-key"
    );
});

describe("init", () => {
    it("should depersist", async () => {
        mockPersistance.load.mockResolvedValue({ foo: { a: "bbb" } });
        await trunk.init();
        expect(foo.a).toBe("bbb");
    });

    it("should use the initial trunk state as the default state", async () => {
        await trunk.init();
        expect(mockPersistance.load.mock.calls.length).toBe(1);
        expect(mockPersistance.load.mock.calls[0][0]).toBe("test-key");
        expect(mockPersistance.load.mock.calls[0][1]).toEqual({ foo: { a: "aaa" } });
    });

    it("should watch for trunk changes", async () => {
        await trunk.init();
        expect(mockPersistance.save.mock.calls.length).toBe(0);
        runInAction(() => (foo.a = "ccc"));
        expect(mockPersistance.save.mock.calls.length).toBe(1);
        expect(mockPersistance.save.mock.calls[0][0]).toBe("test-key");
        expect(mockPersistance.save.mock.calls[0][1]).toEqual({ foo: { a: "ccc" } });
    });

    it("should apply persistance changes back on the trunk", async () => {
        await trunk.init();
        expect(mockPersistance.watch.mock.calls.length).toBe(1);
        expect(mockPersistance.watch.mock.calls[0][0]).toBe("test-key");
        mockPersistance.watch.mock.calls[0][1]({ foo: { a: "ddd" } });
        expect(foo.a).toBe("ddd");
    });

    it("should not persist depersisted changes", async () => {
        await trunk.init();
        expect(mockPersistance.save.mock.calls.length).toBe(0);
        mockPersistance.watch.mock.calls[0][1]({ foo: { a: "ddd" } });
        expect(mockPersistance.save.mock.calls.length).toBe(0);
    });
});
