import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { logPageStartup, logUnhandledErrors, sendLogsToExtension } from "../common/logging";
import { configure } from "mobx";
import { Router } from "./components/Router";
import * as common from "../common/common";
import { addLiveReloadIfDevMode } from "../common/utils";

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
    addLiveReloadIfDevMode();

    ReactDOM.render(
        <Provider {...{ ...common }}>
            <Router />
        </Provider>,
        document.getElementById("root")
    );
}

init();
