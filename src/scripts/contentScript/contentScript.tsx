import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContentScriptToBackgroundController } from './controllers/ContentScriptToBackgroundController';
import { configure } from 'mobx';
import { StoresFactory } from './helpers/StoresFactory';
import { CardsService } from './services/CardsService';
import { ServiceHelpers } from '../helpers/ServiceHelpers';
import { GetBatchService } from './services/GetBatchService';
import { ChromePersistanceService } from '../services/ChromePersistanceService';
import { AppSettingsModel } from '../models/AppSettingsModel';
import { Provider } from 'mobx-react';
import { AggregateLogger, ConsoleLogger } from 'mikeysee-helpers';
import { ExtensionMessagingLogger } from '../helpers/ExtensionMessagingLogger';
import { FilteredLogger } from '../helpers/FilteredLogger';
import { logUnhandledErrors, createAppSettingsLogFilter } from '../helpers/utils';
import { ChromeService } from '../services/ChromeService';
import { ContentScriptAuthModel } from '../models/AuthModel';
import { BoardsService } from './services/BoardsService';
import { Page } from './components/Page';
import { ListsService } from './services/ListsService';
import { WebSocketInterceptHandler } from '../controllers/WebSocketInterceptHandler';
import { ChatService } from './services/ChatService';

async function init() {

  // Logging is important
  const aggregateLogger = new AggregateLogger();
  aggregateLogger.loggers = [ new ConsoleLogger(), new ExtensionMessagingLogger("ContentScript", chrome.runtime.sendMessage) ];
  const logger = new FilteredLogger(aggregateLogger);
  logUnhandledErrors(logger);

  // Ensure we cant have two of us running at once
  const rootElementId = "chat-for-trello-root";
  if (document.getElementById(rootElementId))
    throw new Error("Found and existing running instance of Chat for Trello, this shouldnt ever happen. Exiting.")

  // Setup mobX
  configure({ enforceActions: true });

  // Create our mount point
  const root = document.createElement(`div`);
  root.id = rootElementId;
  document.body.appendChild(root);

  // Construct the objects
  const backgroundController = new ContentScriptToBackgroundController(logger);
  const chromeService = new ChromeService();
  const serviceHelpers = new ServiceHelpers();
  const batchService = new GetBatchService(logger, serviceHelpers);
  const cardService = new CardsService(logger, serviceHelpers, batchService);
  const boardsService = new BoardsService(logger, serviceHelpers);
  const listsService = new ListsService(logger, serviceHelpers);
  const chatService = new ChatService(logger, serviceHelpers, boardsService, listsService, cardService);
  const persistance = new ChromePersistanceService(chrome.storage.sync, logger);
  const appSettings = new AppSettingsModel(persistance, logger);
  const factory = new StoresFactory(cardService, persistance, appSettings, logger, boardsService, chatService);
  const page = factory.createPage();
  const websocket = new WebSocketInterceptHandler(logger, page);
  const auth = new ContentScriptAuthModel(persistance);

  // Init
  logger.filter = createAppSettingsLogFilter(appSettings.settings);
  logger.info(`Chat for Trello v${chromeService.appVersion} starting up Content Script Page`);
  await appSettings.init();
  await auth.init();
  backgroundController.connect();
  websocket.listen();

  // If we disconnect, then lets just refresh the page to cleanup
  backgroundController.onDisconnect.add(() => {
    logger.debug("Background disconnected, reloading now..")
    window.location.reload();
  });

  // Start renering
  ReactDOM.render(
    <Provider page={page} backgroundController={backgroundController} appSettings={appSettings} logger={logger} factory={factory} auth={auth}>
      <Page model={page} element={document.body} />
    </Provider>,
    root
  );

}

init();