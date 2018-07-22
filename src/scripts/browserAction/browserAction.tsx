import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Page } from './components/Page';
import { Provider } from 'mobx-react';
import { ChromeService } from '../services/ChromeService';
import { BrowserActionModel } from './models/BrowserActionModel';
import { UpdatesLoader } from '../helpers/UpdatesLoader';
import { setupStandardLogging, addLiveReloadIfDevMode } from '../helpers/utils';

async function init() {

  // Construct dependencies
  const logger = await setupStandardLogging("Browser Action");
  const chromeService = new ChromeService();
  const model = new BrowserActionModel(chromeService);

  // Init  
  model.init(new UpdatesLoader());
  addLiveReloadIfDevMode();

  ReactDOM.render(
    <Provider logger={logger}>
      <Page model={model} />
    </Provider>,
    document.getElementById("root")
  );

}

init();