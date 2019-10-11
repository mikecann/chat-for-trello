import * as React from "react";
import * as ReactDOM from "react-dom";
import { Page } from "./components/Page";
import { Provider } from "mobx-react";
import { logPageStartup, sendLogsToExtension, logUnhandledErrors } from "../common/logging";
import { BrowserActionStore } from "./stores/BrowserActionStore";
import { configure } from "mobx";
import { chromeService, bus, aggregateLogger, logger, trunk, extension } from "../common/common";
import { UpdatesLoader } from "../lib/updates/UpdatesLoader";
import { UpdatesStore } from "../lib/updates/UpdatesStore";
import { initSentry } from "../common/sentry";

const pageName = "BrowserAction";

async function init() {
    initSentry();

    const store = new BrowserActionStore(chromeService);
    const updates = new UpdatesStore();

    configure({ enforceActions: true });

    sendLogsToExtension(aggregateLogger, pageName, bus);
    logUnhandledErrors(logger);
    logPageStartup(aggregateLogger, pageName, chromeService);

    await trunk.init();
    await updates.loadUpdates(new UpdatesLoader());
    extension.handleReboot();

    ReactDOM.render(
        <Provider {...{ store, updates, logger }}>
            <Page />
        </Provider>,
        document.getElementById("root")
    );
}

init();
