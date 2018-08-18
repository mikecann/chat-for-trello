import { isDevMode } from "./utils";

export enum ChatWindowOrder {
    BehindCards = "behind_cards",
    InfrontOfCards = "infront_cards"
}

export const premiumMembershipIAPId = "premiummembership";
export const TRIAL_PERIOD_DAYS = 30;

export type AppSettings = typeof defaultAppSettings;

export const defaultAppSettings = {
    autoScrollChatWindow: true,
    logLevel: isDevMode ? "debug" : "info",
    lastMigratedVersion: "",
    maxChatEntries: 100,
    chatWindowOrder: ChatWindowOrder.InfrontOfCards
};
