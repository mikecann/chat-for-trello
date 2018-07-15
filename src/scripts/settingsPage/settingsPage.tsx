import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Router } from './components/Router';
import { AppSettingsModel } from '../models/AppSettingsModel';
import { ChromePersistanceService } from '../services/ChromePersistanceService';
import { ChromeService } from '../services/ChromeService';
import { LogMessagesFromExtensionModel } from '../models/LogMessagesFromExtensionModel';
import { BackgroundPage } from '../background/background';
import { setupStandardLogging, addLiveReloadIfDevMode } from '../helpers/utils';
import { PageAuthModel } from '../models/AuthModel';
import { ResetController } from '../controllers/ResetController';

async function init() {

  // Construct dependencies
  const logger = await setupStandardLogging("Settings Page");
  const chromeService = new ChromeService();
  const resetController = new ResetController();
  const background = await chromeService.getBackgroundPage<BackgroundPage>();
  const persistance = new ChromePersistanceService(chrome.storage.sync, logger);
  const model = new AppSettingsModel(persistance, logger, resetController);
  const logsModel = new LogMessagesFromExtensionModel();
  const authModel = new PageAuthModel(persistance, background);
  

  // Init
  await authModel.init();
  await model.init();
  logsModel.listenForModelChangesInTheBackground(background);
  addLiveReloadIfDevMode();
  resetController.listenForReset();

  // Render
  ReactDOM.render(
    <Provider logger={logger} model={model} background={background} auth={authModel} logsModel={logsModel}>
      <Router />      
    </Provider>,
    document.getElementById("root")
  );

  // When page is closing lets clear up
  //await pageClosing();

}

init();