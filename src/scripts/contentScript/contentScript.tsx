import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { logPageStartup, logUnhandledErrors, sendLogsToExtension } from "../common/logging";
import { configure } from "mobx";
import * as common from "../common/common";
import { Page } from "./components/Page";
import { GetBatchService } from "./services/GetBatchService";
import { CardsService } from "./services/CardsService";
import { BoardsService } from "./services/BoardsService";
import { ResetController } from "../controllers/ResetController";
import { WebSocketInterceptHandler } from "../controllers/WebSocketInterceptHandler";
import { WebRequestInterceptorHandler } from "../controllers/WebRequestInterceptorHandler";
import { ListsService } from "./services/ListsService";
import { ChatService } from "./services/ChatService";
import { StoresFactory } from "./helpers/StoresFactory";
import { logger } from "../common/common";
import { MembersService } from "./services/MembersService";
import { ChatNotificationtsController } from "../controllers/ChatNotificationtsController";
import { initSentry } from "../common/sentry";

const pageName = "ContentScript";

async function init() {
    // Ensure we cant have two of us running at once
    const rootElementId = "tasks-for-trello-root";
    if (document.getElementById(rootElementId)) {
        console.warn(
            "Found and existing running instance of Chat for Trello, this shouldnt ever happen. Exiting."
        );
        return;
    }

    initSentry();

    configure({ enforceActions: true });

    common.bus.connect();

    sendLogsToExtension(common.aggregateLogger, pageName, common.bus);
    logUnhandledErrors(common.logger);
    logPageStartup(common.aggregateLogger, pageName, common.chromeService);

    await common.trunk.init();

    // Create our mount point
    const root = document.createElement(`div`);
    root.id = rootElementId;
    document.body.appendChild(root);

    const batchService = new GetBatchService(common.logger, common.http);
    const cardService = new CardsService(common.logger, common.http, batchService);
    const boardsService = new BoardsService(common.logger, common.http);
    const membersService = new MembersService(common.logger, common.http);
    const listsService = new ListsService(logger, common.http);
    const resetController = new ResetController();
    const chatService = new ChatService(common.logger, boardsService, listsService, cardService);
    const factory = new StoresFactory(
        common.syncPersistance,
        common.settings,
        logger,
        boardsService,
        chatService,
        membersService
    );
    const page = factory.createPage();
    const notifications = new ChatNotificationtsController(
        common.logger,
        common.settings,
        common.membership,
        common.bus,
        page
    );
    const websocket = new WebSocketInterceptHandler(
        common.logger,
        page,
        notifications.handleNewComment
    );
    const webRequest = new WebRequestInterceptorHandler(common.logger, page);

    websocket.listen();
    webRequest.listen();
    resetController.listenForReset();

    // If we disconnect, then lets just refresh the page to cleanup
    common.bus.onDisconnect = () => {
        common.logger.debug("Background disconnected, reloading now..");
        window.location.reload();
    };

    // Start renering
    ReactDOM.render(
        <Provider {...{ ...common, factory, page }}>
            <Page page={page} element={document.body} />
        </Provider>,
        root
    );
}

init();
