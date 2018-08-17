import { Persister } from "../persistance/Persister";
import { ChromePersistanceService } from "../persistance/ChromePersistanceService";
import { ChromeService } from "../chrome/ChromeService";
import { GoogleCloudServices } from "../chrome/GoogleCloudServices";
import { IAPStore } from "../iap/IAPStore";
import { AuthStore } from "../auth/AuthStore";
import { NullLogger } from "../logging/NullLogger";

export const mockPersister: jest.Mocked<Persister<any>> = {
    ...({} as any)
};

export const mockPersistance = createMock(ChromePersistanceService);

export const mockChromeService = createMock(ChromeService);

export const mockCloudService = createMock(GoogleCloudServices);

export const mockIapStore: jest.Mocked<IAPStore> = {
    load: jest.fn(),
    clear: jest.fn(),
    ...({} as any)
};

//export const mockAuthStore = produceMock(AuthStore);
export const mockAuthStore = createMock(AuthStore);

export const nullLogger = new NullLogger();

interface Constructor<T> {
    new (...args: any[]): T;
    prototype: T;
}

function createMock<T>(clazz: Constructor<T>): jest.Mocked<T> {
    const instance = new clazz();
    const o: any = {};
    for (var key in Object.getOwnPropertyDescriptors(instance)) o[key] = jest.fn();
    for (var key in Object.getOwnPropertyDescriptors(clazz.prototype)) o[key] = jest.fn();
    return o;
}
