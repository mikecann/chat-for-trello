import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { setupStandardLogging, addLiveReloadIfDevMode } from '../helpers/utils';
import { App } from './Components/App';

async function init() {

  // Construct dependencies
  const logger = await setupStandardLogging("Installed Page");

  addLiveReloadIfDevMode();

  // Render
  ReactDOM.render(
    <Provider logger={logger}>
      <App />
    </Provider>,
    document.getElementById("root")
  );

}

init();