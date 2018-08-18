import { premiumMembershipIAPId, AppSettings, defaultAppSettings } from "./config";
import * as fs from "file-saver";
import { AggregateLogger } from "../lib/logging/AggregateLogger";
import { ConsoleLogger } from "../lib/logging/ConsoleLogger";
import { FilteredLogger } from "../lib/logging/FilteredLogger";
import { ChromeService } from "../lib/chrome/ChromeService";
import { GoogleCloudServices } from "../lib/chrome/GoogleCloudServices";
import { ChromePersistanceService } from "../lib/persistance/ChromePersistanceService";
import { ExtensionMessageBus } from "../lib/messaging/ExtensionMessageBus";
import { HttpHelpers } from "../lib/http/HttpHelpers";
import { Extension } from "../lib/extension/Extension";
import { AuthStore } from "../lib/auth/AuthStore";
import { IAPStore } from "../lib/iap/IAPStore";
import { MembershipStore } from "../lib/membership/MembershipStore";
import { AppSettingsStore } from "../lib/settings/AppSettingsStore";
import { SessionStore } from "../lib/session/SessionStore";
import { LogsStore } from "../lib/logging/LogsStore";
import { Trunk } from "../lib/persistance/Trunk";
import { MigrationsController } from "../background/controllers/MigrationsController";
import { NotificationsStore } from "../lib/notifications/NotificationsStore";

export const premiumMembershipSelector = (p: GoogleIAPPurchase) => p.sku == premiumMembershipIAPId;

// Loggings
export const aggregateLogger = new AggregateLogger();
aggregateLogger.loggers = [new ConsoleLogger()];
export const logger = new FilteredLogger(aggregateLogger);

// services
export const chromeService = new ChromeService();
export const cloudServices = new GoogleCloudServices();
export const syncPersistance = new ChromePersistanceService(chrome.storage.sync, logger);
export const bus = new ExtensionMessageBus(logger);
export const http = new HttpHelpers();
export const notifications = new NotificationsStore(bus);
export const extension = new Extension(logger, bus, notifications);

// Stores
export const auth = new AuthStore(logger, chromeService, cloudServices);
export const iaps = new IAPStore(logger, cloudServices);
export const membership = new MembershipStore(iaps, { premiumMembershipSelector });
export const settings = new AppSettingsStore<AppSettings>(logger, defaultAppSettings);
export const logs = new LogsStore(fs);
export const session = new SessionStore(logger, auth, iaps);
export const migration = new MigrationsController(logger, settings, chromeService, syncPersistance);

// Trunk
export const trunk = new Trunk(
    {
        auth,
        iaps,
        settings
    },
    syncPersistance
);
