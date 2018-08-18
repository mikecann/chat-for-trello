import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { App } from "./Components/App";
import * as common from "../common/common";
import { sendLogsToExtension, logUnhandledErrors, logPageStartup } from "../common/logging";
import { configure } from "mobx";

const pageName = "InstalledPage";

async function init() {
    configure({ enforceActions: true });

    common.bus.listenForMessages();
    //common.logs.beginSyncingWithBackground();

    sendLogsToExtension(common.aggregateLogger, pageName, common.bus);
    logUnhandledErrors(common.logger);
    logPageStartup(common.aggregateLogger, pageName, common.chromeService);

    await common.trunk.init();

    // Render
    ReactDOM.render(
        <Provider logger={common.logger}>
            <App />
        </Provider>,
        document.getElementById("root")
    );
}

init();
