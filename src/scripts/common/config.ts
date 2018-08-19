import { isDevMode } from "./utils";
import { LogLevel } from "../lib";

export enum ChatWindowOrder {
    BehindCards = "behind_cards",
    InfrontOfCards = "infront_cards"
}

export const premiumMembershipIAPId = "premiummembership";
export const TRIAL_PERIOD_DAYS = 30;

export type AppSettings = {
    autoScrollChatWindow: boolean;
    logLevel: LogLevel;
    lastMigratedVersion: string;
    maxChatEntries: number;
    desktopNotificationsEnabled?: boolean;
    chatWindowOrder: ChatWindowOrder;
};

export const defaultAppSettings: AppSettings = {
    autoScrollChatWindow: true,
    logLevel: isDevMode ? "debug" : "info",
    lastMigratedVersion: "",
    maxChatEntries: 100,
    desktopNotificationsEnabled: false,
    chatWindowOrder: ChatWindowOrder.InfrontOfCards
};
