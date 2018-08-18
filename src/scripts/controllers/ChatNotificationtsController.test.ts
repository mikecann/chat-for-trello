// import { ChatNotificationtsController } from "./ChatNotificationtsController";
// import { AppSettings } from "../common/config";
// import { AppSettingsStore } from "../lib/settings/AppSettingsStore";
// import { mockBus, mockExtension, nullLogger } from "../lib/test/commonMocks";
// import { PageStore } from "../contentScript/stores/PageStore";

// let controller: ChatNotificationtsController;
// let settings: AppSettingsStore<AppSettings>;
// let page: PageStore;

// beforeEach(() => {
//     jest.clearAllMocks();
//     settings = {
//         settings: {
//             notificationsEnabled: false
//         }
//     } as any;
//     page = {
//         board: {
//             me: {
//                 me: {}
//             }
//         }
//     } as any;
//     controller = new ChatNotificationtsController(nullLogger, settings, mockBus, page);
// });

// describe("handleNewComment", () => {
//     // it("does nothing if notifications are not enabled in the settings", () => {
//     //     settings.settings.notificationsEnabled = false;
//     // });

//     // it("ignores the comment if it is from the currently logged in user", () => {});

//     it("creates a new notification", () => {
//         settings.settings.notificationsEnabled = true;
//         page.board!.me.me.id = "aaa";
//         controller.handleNewComment({
//             memberCreator: {}
//         } as any);
//     });
// });
