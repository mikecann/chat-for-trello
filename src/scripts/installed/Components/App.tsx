import * as React from 'react';
import { ILogger } from 'mikeysee-helpers';
import { observer, inject } from 'mobx-react';
import { Page } from './Page';

interface Props {
    logger?: ILogger,
}

@inject("logger")
@observer
export class App extends React.Component<Props, {}>
{ 
    render() {
        return <Page />
    }
}