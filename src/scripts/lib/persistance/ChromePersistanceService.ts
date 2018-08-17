import { IPersistanceService, WatchDisposer } from "./IPersistanceService";
import { ILogger } from "../logging/types";

export class ChromePersistanceService implements IPersistanceService {
    constructor(private area: chrome.storage.StorageArea, private logger: ILogger) {}

    load<T>(key: string, defaultValue: any = {}): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.area.get(key, items => {
                this.logger.debug(
                    `ChromePersistanceService`,
                    `loaded items with key '${key}'`,
                    items
                );

                const value = items[key];
                if (value == undefined) {
                    resolve(defaultValue);
                    return;
                }

                resolve(JSON.parse(value));
            });
        });
    }

    save<T>(key: string, value: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const json = JSON.stringify(value);
            this.logger.debug(
                `ChromePersistanceService`,
                `saving value with key '${key}'`,
                JSON.parse(json)
            );
            this.area.set(
                {
                    [key]: json
                },
                () => resolve()
            );
        });
    }

    watch<T>(key: string, callback: (newValue: T) => void): WatchDisposer {
        const listener = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string
        ) => {
            if (areaName != "sync") return;

            this.logger.debug("ChromePersistanceService", "watch detected change", {
                changes,
                areaName
            });

            if (changes[key] == undefined) return;

            callback(JSON.parse(changes[key].newValue));
        };
        chrome.storage.onChanged.addListener(listener);
        this.logger.debug(
            `ChromePersistanceService`,
            `starting to watch for changes to key '${key}'`
        );

        return () => {
            chrome.storage.onChanged.removeListener(listener);
            this.logger.debug(
                `ChromePersistanceService`,
                `no longer watching for changes changes to key '${key}'`
            );
        };
    }

    remove(key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.logger.debug(`ChromePersistanceService`, `removing value with key '${key}'`);
            this.area.remove(key, () => resolve());
        });
    }

    async clear(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this, this.area.clear(() => resolve());
        });
    }
}
