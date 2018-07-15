
export type WatchDisposer = () => void;

export interface IPersistanceService {
    load<T>(key: string, defaultValue?: T): Promise<T>
    save<T>(key: string, value: T): Promise<void>
    watch<T>(key: string, callback: (newValue: T) => void): WatchDisposer;
    clear(): Promise<void>;
}