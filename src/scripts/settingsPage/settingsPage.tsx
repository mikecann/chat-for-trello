import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { logPageStartup, logUnhandledErrors, sendLogsToExtension } from "../common/logging";
import { configure } from "mobx";
import { Router } from "./components/Router";
import * as common from "../common/common";

const pageName = "Settings";

async function init() {
    configure({ enforceActions: true });

    const background = await common.chromeService.getBackgroundPage<any>();
    common.bus.listenForMessages();
    common.logs.beginSyncingWithBackground(background.logs);

    sendLogsToExtension(common.aggregateLogger, pageName, common.bus);
    logUnhandledErrors(common.logger);
    logPageStartup(common.aggregateLogger, pageName, common.chromeService);

    await common.trunk.init();

    common.extension.handleReboot();

    ReactDOM.render(
        <Provider {...{ ...common }}>
            <Router />
        </Provider>,
        document.getElementById("root")
    );
}

init();

// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import { Provider } from "mobx-react";
// import { Router } from "./components/Router";
// import { BackgroundPage } from "../background/background";
// import { setupStandardLogging, addLiveReloadIfDevMode } from "../helpers/utils";
// import { PageAuthModel } from "../models/AuthModel";

// async function init() {
//     // Construct dependencies
//     const logger = await setupStandardLogging("Settings Page");
//     const chromeService = new ChromeService();
//     const background = await chromeService.getBackgroundPage<BackgroundPage>();
//     const persistance = new ChromePersistanceService(chrome.storage.sync, logger);
//     const model = new AppSettingsModel(persistance, logger);
//     const logsModel = new LogMessagesFromExtensionModel();
//     const authModel = new PageAuthModel(persistance, background);

//     // Init
//     await authModel.init();
//     await model.init();
//     logsModel.listenForModelChangesInTheBackground(background);
//     addLiveReloadIfDevMode();

//     // Render
//     ReactDOM.render(
//         <Provider
//             logger={logger}
//             model={model}
//             background={background}
//             auth={authModel}
//             logsModel={logsModel}
//         >
//             <Router />
//         </Provider>,
//         document.getElementById("root")
//     );
// }

// init();
