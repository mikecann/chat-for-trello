export interface IPersistable<T> {
    asJson: T;
    fromJson(json: T): void;
}
